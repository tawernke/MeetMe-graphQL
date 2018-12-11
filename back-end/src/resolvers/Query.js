const { forwardTo} = require('prisma-binding')
//If a query is exactly the same on Yoga as it is on prisma, you can forward the query from yoga to prisma

const Query = {
  users: forwardTo('db'),
  // events: forwardTo('db'), //This pulls the function from the prisma.graphql file pulled from the PRISMA server
  
  async events(parent, {userId}, ctx, info) {
    const events = await ctx.db.query.events(
      {
        where: { 
          user_some: { id_contains: userId},
        },
      },
      info
    )
    return events
  },
  
  event: forwardTo('db'),
  
  async user(parent, { id }, ctx, info) {
    const places = await ctx.db.query.places(
      {
        where: {
          id: id
        },
      },
      info
    )
    return user
  },
  // places: forwardTo('db'),
  async places(parent, {userId, type}, ctx, info) {
    const places = await ctx.db.query.places(
      {
        where: { 
          user: { id: userId},
          type: type
        },
      },
      info
    )
    return places
  },
  
  preferences: forwardTo('db'),
  
  me(parent, args, ctx, info) {
    //check if there is a current user ID
    if (!ctx.request.userId) {
      return null
    }
    return ctx.db.query.user(
      {
        where: { id: ctx.request.userId },
      },
      info
    )
  },

  async user(parent, {id}, ctx, info) {
    const user = await ctx.db.query.user(
      {
        where: {
          id: id
        },
        info
      }
    )
    return user
  },
}

module.exports = Query;
