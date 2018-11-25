require('dotenv').config({path: 'variables.env' })
const createServer = require('./createServer')
const db = require('./db')

//Start a version of the server from the createServer function
const server = createServer()

//TODo Use express middleware to handle cookies (JWT)
//TODo Use express middleware to populate current user

server.start({
  cors: {
    credentials: true,
    origin: process.env.FRONTEND_URL,
  },
}, deets => {
  console.log(`Server is now running on port http://localhost:${deets.port}`)
})