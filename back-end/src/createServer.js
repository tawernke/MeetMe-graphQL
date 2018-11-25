const { GraphQLServer} = require('graphql-yoga')
const Mutation = require('./resolvers/Mutation')
const Query = require('./resolvers/Query')
const db = require('./db')

//Create the GraphQL Yoga Server. GraphQL Yoga Server is an express server that sits on top of apollo server

function createServer() {
  return new GraphQLServer({
    typeDefs: 'src/schema.graphql',
    resolvers: {
      Mutation,
      Query
    },
    resolverValidationOptions: {
      requireResolversForResolveType: false
    },
    //Expose the db to every single request
    context: req => ({ ...req, db}),
  })
}

module.exports = createServer