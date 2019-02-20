const Subscriptions = {
  newEvent: {
    subscribe: async (parent, {id}, ctx, info) => {
      const eventSubscription = await ctx.db.subscription.event(
        {
          where: {
            mutation_in: ["CREATED"],
            AND: {
              node: {
                user_some: { id }
              }
            }
          },
        },
        info
      );
      return eventSubscription;
    },
  }
};

module.exports = Subscriptions;
