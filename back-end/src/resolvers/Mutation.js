const Mutations = {
  //Event Muatations
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

  updateEvent(parent, args, ctx, info) {
    //first take a copy of the updates
    const updates = {...args}
    //remove the ID from the updates copy
    delete updates.id
    //run the update method
    return ctx.db.mutation.updateEvent(
      {
        data: updates,
        where: {
          id: args.id
        },
      },
      info
    )
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
