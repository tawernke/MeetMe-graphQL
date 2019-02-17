const { Yelp } = require("graphql-binding-yelp");
const { GraphQLServer } = require("graphql-yoga");
const Mutation = require("./resolvers/Mutation");
const { forwardTo } = require('prisma-binding')
const { importSchema } = require("graphql-import");
const Query = require("./resolvers/Query");
const db = require("./db");

//Create the GraphQL Yoga Server. GraphQL Yoga Server is an express server that sits on top of apollo server

function createServer() {
  const apiKey = process.env.YELP_API_KEY
  const yelp = new Yelp(apiKey);
  const typeDefs = importSchema("src/schema.graphql");
  
  return new GraphQLServer({
    typeDefs: "src/schema.graphql",
    resolvers: {
      Mutation,
      Query: {

        //Return businesses from the yelp API
        async favoriteBusinesses(parent, args, context, info) {
          const res = await yelp.delegate("query", "search", args, context, info)
          return res

        },

        //Querying all users
        users: forwardTo("db"),

        //Users frieds query
        async friends(parent, args, ctx, info) {
          const friends = await ctx.db.query.users({
            where: {
              friends_some: { id_contains: ctx.request.userId}
            }
          }, info)
          return friends
        },

        //Returns all event of a particular user
        async events(parent, args, ctx, info) {
          const events = await ctx.db.query.events(
            {
              where: {
                user_some: { id_contains: args.userId }
              }
            },
            info
          );
          return events;
        },

        //Returns a single event
        event: forwardTo("db"),

        //Query for a single user
        async user(parent, { id }, ctx, info) {
          const places = await ctx.db.query.places(
            {
              where: {
                id: id
              }
            },
            info
          );
          return user;
        },

        //Returns the saved places for a user of a particular type
        async places(parent, args, ctx, info) {
          const places = await ctx.db.query.places(
            {
              where: {
                // user: { id: ctx.request.userId },
                user_some: { id: ctx.request.userId},
                type: args.type
              }
            },
            info
          );
          return places;
        },

        //Query who the logged in user is
        me(parent, args, ctx, info) {
          if (!ctx.request.userId) {
            return null;
          }
          return ctx.db.query.user(
            {
              where: { id: ctx.request.userId }
            },
            info
          );
        },

        //Query for a single user
        async user(parent, { id }, ctx, info) {
          const user = await ctx.db.query.user({
            where: {
              id: id
            },
            info
          });
          return user;
        }
      },
      ...yelp.remoteResolvers(typeDefs)
    },
    resolverValidationOptions: {
      requireResolversForResolveType: false
    },
    //Expose the db to every single request
    context: req => ({ ...req, db })
  });
}

module.exports = createServer

