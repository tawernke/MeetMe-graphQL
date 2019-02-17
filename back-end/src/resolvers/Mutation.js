const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { randomBytes } = require("crypto");
const { promisify } = require("util");
const { transport, makeANiceEmail } = require("../mail");

const Mutations = {
  //Event Muatations
  async createEvent(parent, args, ctx, info) {
    const idsArray = args.user.map(user => {
      return {
        id: user
      };
    });
    delete args.user;

    //ctx.db accesses the db (seeing as it's available on context), call query or mutation, then reference the method
    const event = await ctx.db.mutation.createEvent(
      {
        data: {
          user: {
            connect: idsArray
          },
          ...args
        }
      },
      info
    );

    return event;
  },

  async updateEvent(parent, args, ctx, info) {
    const newUserIds = args.user
      ? args.user.map(user => {
          return { id: user };
        })
      : null;
    delete args.user;
    const updates = { ...args };
    const oldEventDetails = await ctx.db.query.event(
      { where: { id: updates.id } },
      `{
        id,
        user {
          id
        }
      }`
    );
    const userInvitedToEvent = oldEventDetails.user.find(
      user => user.id === ctx.request.userId
    ); 
    if(!userInvitedToEvent) throw new Error("You must be invited to an event to update it");
    delete updates.id;
    const disconnectOldUsers = await ctx.db.mutation.updateEvent(
      {
        data: {
          user: {
            disconnect: oldEventDetails.user.map(user => {
              return { id: user.id };
            })
          }
        },
        where: {
          id: args.id
        }
      },
      info
    );
    const updatedEvent = await ctx.db.mutation.updateEvent(
      {
        data: {
          user: {
            connect: newUserIds || oldEventDetails.user
          },
          ...updates
        },
        where: {
          id: args.id
        }
      },
      info
    );
    return updatedEvent;
  },

  updateUser(parent, args, ctx, info) {
    const updates = { ...args };
    delete updates.id;
    return ctx.db.mutation.updateUser(
      {
        data: updates,
        where: {
          id: args.id
        }
      },
      info
    );
  },

  async deleteEvent(parent, args, ctx, info) {
    const where = { ...args };
    //Find the event
    const event = await ctx.db.query.event({ where }, `{id title user {id}}`);
    //Check if they are part of that event
    const userInvitedToEvent = event.user.find(
      user => user.id === ctx.request.userId
    );
    //If user is part of the event, delete the event, otherwise show an error
    if (userInvitedToEvent) return ctx.db.mutation.deleteEvent({ where }, info);
    else throw new Error("You must be invited to an event to delete it");
  },

  async createPlace(parent, args, ctx, info) {
    const placeAlreadyExists = await ctx.db.query.places({
      where: {
        name: args.name,
        AND: {
          type: args.type
        }
      }
    });

    if (placeAlreadyExists.length >= 1) {
      return ctx.db.mutation.updatePlace(
        {
          where: {
            id: placeAlreadyExists[0].id
          },
          data: {
            user: {
              connect: [{ id: ctx.request.userId }]
            }
          }
        },
        info
      );
    } else {
      return ctx.db.mutation.createPlace(
        {
          data: {
            user: {
              connect: {
                id: ctx.request.userId
              }
            },
            ...args
          }
        },
        info
      );
    }
  },

  async deletePlace(parent, args, ctx, info) {
    const where = { id: args.id };
    return ctx.db.mutation.deletePlace({ where }, info);
  },

  async createPreference(parent, args, ctx, info) {
    const preference = await ctx.db.mutation.createpreference(
      {
        data: {
          ...args
        }
      },
      info
    );
    return preference;
  },

  async signup(parent, args, ctx, info) {
    //check to see an email, name, and password have been entered
    if (!args.email || !args.name || !args.password) {
      throw new Error("Please fill in all the fields");
    }
    //lowercase the email
    args.email = args.email.toLowerCase();
    //hash the password
    const password = await bcrypt.hash(args.password, 10);
    //create the user in the db
    const user = await ctx.db.mutation.createUser(
      {
        data: {
          ...args,
          password,
          permissions: { set: ["USER"] }
        }
      },
      info
    );
    //create the JWT token for them
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
    //we set the jwt as a cookie on the response
    ctx.response.cookie("token", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365 //1 year cookie
    });
    //Finally, return the user to the browser
    return user;
  },
  async signin(parent, { email, password }, ctx, info) {
    // 1. check if there is a user with that email
    const user = await ctx.db.query.user({ where: { email } });
    if (!user) {
      throw new Error(`No such user found for email ${email}`);
    }
    // 2. Check if their password is correct
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new Error("Invalid Password!");
    }
    // 3. generate the JWT Token
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
    // 4. Set the cookie with the token
    ctx.response.cookie("token", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365
    });
    // 5. Return the user
    return user;
  },

  signout(parent, args, ctx, info) {
    ctx.response.clearCookie("token");
    return { message: "Goodbye!" };
  },

  async requestReset(parent, args, ctx, info) {
    // 1. check if there is a user with that email
    const user = await ctx.db.query.user({ where: { email: args.email } });
    if (!user) {
      throw new Error(`No such user found for email ${args.email}`);
    }
    //2. Set a reset token and expiry on that user
    const randomBytesPromiseified = promisify(randomBytes);
    const resetToken = (await randomBytesPromiseified(20)).toString("hex");
    const resetTokenExpiry = Date.now() + 3600000; //1 hour from now
    const res = await ctx.db.mutation.updateUser({
      where: { email: args.email },
      data: { resetToken, resetTokenExpiry }
    });
    //3. Email them that reset
    const mailRes = await transport.sendMail({
      from: "t.a.wernke@gmail.com",
      to: user.email,
      subject: "Your password reset token",
      html: makeANiceEmail(`Your Password Reset Token is here! 
        \n\n 
        <a href="${
          process.env.FRONTEND_URL
        }/resetPassword/${resetToken}">Click Here to Reset your Password</a>`)
    });
    // 4. Return a message
    return { message: "Thanks" };
  },

  async resetPassword(parent, args, ctx, info) {
    // check if the passwords match
    if (args.password !== args.confirmPassword) {
      throw new Error("Yo Passwords don't match!");
    }
    // check if it's a legit token and if its expired
    // users is queried here instead of user so that multiple fields can be queried. Can only query ID
    // and email on user because those are the only unique fields
    const [user] = await ctx.db.query.users({
      where: {
        resetToken: args.resetToken,
        resetTokenExpiry_gte: Date.now() - 3600000
      }
    });
    if (!user) {
      throw new Error("This token is either invalid or expired!");
    }
    // 4. Hash their new password
    const password = await bcrypt.hash(args.password, 10);
    // 5. Save the new password to the user and remove old resetToken fields
    const updatedUser = await ctx.db.mutation.updateUser({
      where: { email: user.email },
      data: {
        password,
        resetToken: null,
        resetTokenExpiry: null
      }
    });
    const token = jwt.sign({ userId: updatedUser.id }, process.env.APP_SECRET);
    ctx.response.cookie("token", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365
    });
    return updatedUser;
  },

  async sendFriendRequest(parent, { email, id, friendRequester }, ctx, info) {
    const mailRes = await transport.sendMail({
      from: "t.a.wernke@gmail.com",
      to: email,
      subject: "New Friend Request",
      html: makeANiceEmail(`You have a new friend request from ${friendRequester}! 
        \n\n 
        <a href="${process.env.FRONTEND_URL}/acceptFriendRequest/${
        ctx.request.userId
      }">Click Here to accept the request</a>`)
    });
    return { message: "Thanks" };
  },

  async acceptFriendRequest(parent, args, ctx, info) {
    //Updates user that accepts invite
    const user = await ctx.db.mutation.updateUser(
      {
        where: {
          id: ctx.request.userId
        },
        data: {
          friends: {
            connect: { id: args.id }
          }
        }
      },
      info
    );

    //Updates user that sent the invite
    const otherUser = await ctx.db.mutation.updateUser(
      {
        where: {
          id: args.id
        },
        data: {
          friends: {
            connect: { id: ctx.request.userId }
          }
        }
      },
      info
    );

    return user;
  }
};

module.exports = Mutations;
