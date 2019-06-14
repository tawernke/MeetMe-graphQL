const { PubSub } = require('graphql-subscriptions')

const subUtils = {
  pubsub: new PubSub(),
  NEW_FRIEND_REQUEST: "new_friend_request",
  NEW_EVENT: "new_event"
};

module.exports = subUtils