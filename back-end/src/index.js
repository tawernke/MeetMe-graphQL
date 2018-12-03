const cookieParser = require("cookie-parser");
const jwt = require('jsonwebtoken')
require('dotenv').config({path: 'variables.env' })
const createServer = require('./createServer')
const db = require('./db')

//Start a version of the server from the createServer function
const server = createServer()

server.express.use(cookieParser());

server.express.use((req, res, next) => {
  const { token } = req.cookies
  if (token) {
    const { userId } = jwt.verify(token, process.env.APP_SECRET)
    //put the userId onto the req for future requests to access
    req.userId = userId
  }
  next()
})

//TODo Use express middleware to populate current user

server.start({
  cors: {
    credentials: true,
    origin: process.env.FRONTEND_URL,
  },
}, deets => {
  console.log(`Server is now running on port http://localhost:${deets.port}`)
})