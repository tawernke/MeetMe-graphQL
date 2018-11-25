const Mutations = {
  async createEvent(parent, args, ctx, info) {
    //TODO: check if they are logged in


    //ctx.db accesses the db (seeing as it's available on context), call query or mutation, then reference the method
    const event = await ctx.db.mutation.createEvent({
      data: {
        ...args
      }
    }, info)

    return event
  },

  async createPlace(parent, args, ctx, info) {
    const place = await ctx.db.mutation.createPlace({
      data: {
        ...args
      }
    }, info)
    return place
  },

  async createPreference(parent, args, ctx, info) {
    const preference = await ctx.db.mutation.createpreference({
      data: {
        ...args
      }
    }, info)
    return preference
  }
  // createDog(parent, args, ctx, info) {
  //   global.dogs = global.dogs || []
  //   //create a dog
  //   const newDog = {name: args.name}
  //   global.dogs.push(newDog)
  //   return newDog
  // }
};

module.exports = Mutations;
