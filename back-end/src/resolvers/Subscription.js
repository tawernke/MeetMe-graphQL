const subUtils = require('../pubsub')
const { withFilter } = require('graphql-subscriptions')

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
  },

  newFriendRequest: {
    subscribe: withFilter(
      () => subUtils.pubsub.asyncIterator('new_friend_request'), (payload, args) => {
        return payload.newFriendRequest.id === args.id
      }
    )
  }
};

module.exports = Subscriptions;
