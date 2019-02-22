const { PubSub } = require('graphql-subscriptions')

const subUtils = {
  pubsub: new PubSub(),
  NEW_FRIEND_REQUEST: 'new_friend_request'
}

module.exports = subUtils