const { Yelp } = require("graphql-binding-yelp");
const { GraphQLServer } = require("graphql-yoga");
const Mutation = require("./resolvers/Mutation");
const { forwardTo } = require('prisma-binding')
const { importSchema } = require("graphql-import");
const Query = require("./resolvers/Query");
const db = require("./db");

//Create the GraphQL Yoga Server. GraphQL Yoga Server is an express server that sits on top of apollo server

function createServer() {
  const apiKey =
    "qHwBybthx8SOAu_231Jff9xKWrt9cq3p2lc1oytmPLmQSdyizg4mVm2wWVTgx9yjkvH-nJrNLdpnhoQRs0fhSWgZ8Ef1aQCAzPf15zPn6WC2nxLiDmpGiwOmGGm-WnYx";
  const yelp = new Yelp(apiKey);
  const typeDefs = importSchema("src/schema.graphql");
  return new GraphQLServer({
    typeDefs: "src/schema.graphql",
    resolvers: {
      Mutation,
      Query: {
        async favoriteBusinesses(parent, args, context, info) {
          const res = await yelp.delegate("query", "search", args, context, info)
          return res

        },
        users: forwardTo("db"),

        async events(parent, { userId }, ctx, info) {
          const events = await ctx.db.query.events(
            {
              where: {
                user_some: { id_contains: userId }
              }
            },
            info
          );
          return events;
        },

        event: forwardTo("db"),

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
        // places: forwardTo('db'),
        async places(parent, { userId, type }, ctx, info) {
          const places = await ctx.db.query.places(
            {
              where: {
                user: { id: userId },
                type: type
              }
            },
            info
          );
          return places;
        },

        // preferences: forwardTo('db'),

        me(parent, args, ctx, info) {
          //check if there is a current user ID
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

