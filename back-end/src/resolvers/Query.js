const { forwardTo} = require('prisma-binding')
//If a query is exactly the same on Yoga as it is on prisma, you can forward the query from yoga to prisma

const Query = {
  events: forwardTo('db'), //This pulls the function from the prisma.graphql file pulled from the PRISMA server
  // async items(parent, args, ctx, info) {
  //   const items = await ctx.db.query.items()
  //   return items
  // }
  places: forwardTo('db'),
  preferences: forwardTo('db')
}

module.exports = Query;
