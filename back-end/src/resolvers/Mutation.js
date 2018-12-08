const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Mutations = {
  //Event Muatations
  async createEvent(parent, args, ctx, info) {
    //Checks if user is logged in
    const idsArray = args.user.map(user => {
      return {
        id: user
      }
    })
    delete args.user
    // if (!ctx.request.userId) {
    //   throw new Error("You must be logged in to do that");
    // }
    
    //ctx.db accesses the db (seeing as it's available on context), call query or mutation, then reference the method
    const event = await ctx.db.mutation.createEvent(
      {
        data: {
          //This is how we create a relationship between the Event and the User
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

  updateEvent(parent, args, ctx, info) {
    //first take a copy of the updates
    const updates = { ...args };
    //remove the ID from the updates copy
    delete updates.id;
    //run the update method
    return ctx.db.mutation.updateEvent(
      {
        data: updates,
        where: {
          id: args.id
        }
      },
      info
    );
  },

  updateUser(parent, args, ctx, info) {
    //first take a copy of the updates
    const updates = { ...args };
    //remove the ID from the updates copy
    delete updates.id;
    //run the update method
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
    //1. find the event
    const event = await ctx.db.query.event({ where }, `{id title}`);
    //2. Check if they own that item, or they have permissions
    //TODO
    //3. Delete it
    return ctx.db.mutation.deleteEvent({ where }, info);
  },

  async createPlace(parent, args, ctx, info) {
    const place = await ctx.db.mutation.createPlace(
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
    return place;
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
  }
};

module.exports = Mutations;
