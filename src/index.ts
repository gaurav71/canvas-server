import "reflect-metadata"
import express from 'express'
import cors from "cors"
import session from 'express-session'
import passport from "passport"
import mongoose from 'mongoose'
import ConnectMongo from 'connect-mongo'
import url from 'url'
import cookieParser from 'cookie-parser'

import { ApolloServer } from "apollo-server-express"
import { buildSchema } from "type-graphql"
import { createServer } from "http"

import { HelloResolver } from "./resolvers/hello"
import { ShapeResolver } from "./resolvers/shape"
import { CanvasResolver } from "./resolvers/canvas"
import { UserResolver } from "./resolvers/user"

import initializeSocketEvents from "./socket"

import {} from '../global'
import { parseCookies } from "./utils/parseCookies"
import { validateUserByCookies } from "./utils/validateUserByCookies"
require('dotenv').config()
require('./passport')

const {
  HOST,
  PORT,
  DB,
  FRONTEND_HOST,
} = process.env

const main = async () => {

  const app = express()

  app.use(cors({
    origin: FRONTEND_HOST,
    credentials: true
  }))

  app.use(cookieParser())
  
  mongoose.connect(DB, {useNewUrlParser: true})

  const db = mongoose.connection
  db.on('error', console.error.bind(console, 'connection error:'))
  db.once('open', function() {
    console.log('connected to db')
  })


  app.get('/', (_, res) => res.redirect('/graphql'))

  const MongoStore = ConnectMongo(session)
  const store = new MongoStore({ mongooseConnection: mongoose.connection })

  app.use(
    session({
      name: 'qid',
      store: store,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
        httpOnly: true,
        sameSite: 'lax',
        secure: false
      },
      secret: 'asdfasdbhgasdfsdf',
      resave: false,
      saveUninitialized: false
    })
  )

  app.use(passport.initialize())
  app.use(passport.session())

  app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }))

  app.get('/auth/google/callback', 
    passport.authenticate('google', { 
      failureRedirect: `${FRONTEND_HOST}/auth/failed` 
    }),
    (_, res) => {
      res.redirect(FRONTEND_HOST)
    }
  )

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, ShapeResolver, CanvasResolver, UserResolver],
      validate: false
    }),
    context: ({ req, res, connection }) => {
      if (connection) {
        return connection.context
      } else {
        return ({
          req,
          res
        })
      }
    }
  })

  const httpServer = createServer(app)
  
  initializeSocketEvents(httpServer)

  apolloServer.applyMiddleware({ app, cors: false })

  apolloServer.installSubscriptionHandlers(httpServer)

  httpServer.listen({ port: PORT }, () => {
    console.log(`🚀 Server ready at ${HOST}:${PORT}/graphql`)
    console.log(`🚀 Subscriptions ready at ${HOST}:${PORT}/graphql`)
  })


  let [socketioUpgradeListener, apolloUpgradeListener] = httpServer.listeners('upgrade').slice(0);
  
  httpServer.removeAllListeners('upgrade');

  httpServer.on("upgrade", async (req, socket, head) => {

    const pathname = url.parse(req.url).pathname

    console.log({pathname}, req.headers.cookie)

    if (!validateUserByCookies(req, store)) {
      socket.write(
        'HTTP/1.1 401 Web Socket Protocol Handshake\r\n' +
        'Upgrade: WebSocket\r\n' +
        'Connection: Upgrade\r\n' +
        '\r\n'
      )

      socket.destroy()
      return
    }

    if (pathname === '/socket.io/') {
      socketioUpgradeListener(req, socket, head);
    }

    if (pathname === '/graphql') {
      apolloUpgradeListener(req, socket, head)
    }
    
  })

}

main() 
