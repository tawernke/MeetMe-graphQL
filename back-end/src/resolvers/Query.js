const { forwardTo} = require('prisma-binding')
const { Yelp } = require("graphql-binding-yelp");
//If a query is exactly the same on Yoga as it is on prisma, you can forward the query from yoga to prisma

const apiKey = process.env.YELP_API_KEY;
const yelp = new Yelp(apiKey)

const Query = {
  async favoriteBusinesses(parent, args, context, info) {
    console.log(args)
    const res = await yelp.delegate("query", "search", args, context, info);
    return res;
  },
  users: forwardTo("db"),

  async events(parent, { userId }, ctx, info) {
    const events = await ctx.db.query.events(
      {
        where: {
          user_some: { id_contains: userId }
        }
      },
      info
    );
    return events;
  },

  event: forwardTo("db"),

  async user(parent, { id }, ctx, info) {
    const places = await ctx.db.query.places(
      {
        where: {
          id: id
        }
      },
      info
    );
    return user;
  },

  // async places(parent, { type }, ctx, info) {
    
  //   const places = await ctx.db.query.places(
  //     {
  //       where: {
  //         user: { id: ctx.request.userId },
  //         type: type
  //       }
  //     },
  //     info
  //   );
  //   return places;
  // },

  // preferences: forwardTo('db'),

  me(parent, args, ctx, info) {
    //check if there is a current user ID
    if (!ctx.request.userId) {
      return null;
    }
    return ctx.db.query.user(
      {
        where: { id: ctx.request.userId }
      },
      info
    );
  },

  async user(parent, { id }, ctx, info) {
    const user = await ctx.db.query.user({
      where: {
        id: id
      },
      info
    });
    return user;
  }
};

module.exports = Query;
