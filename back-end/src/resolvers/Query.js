const { forwardTo} = require('prisma-binding')

const Query = {
  items: forwardTo('db') //This pulls the function from the file pulled from the PRISMA server
  // async items(parent, args, ctx, info) {
  //   const items = await ctx.db.query.items()
  //   return items
  // }
}

module.exports = Query;
