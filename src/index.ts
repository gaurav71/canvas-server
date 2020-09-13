import "reflect-metadata"
import express from 'express'
import cors from "cors"
import session from 'express-session'
import passport from "passport"
import mongoose from 'mongoose'

import { ApolloServer } from "apollo-server-express"
import { buildSchema } from "type-graphql"
import { createServer } from "http"

import { HelloResolver } from "./resolvers/hello"
import { ShapeResolver } from "./resolvers/shape"
import { CanvasResolver } from "./resolvers/canvas"
import { UserResolver } from "./resolvers/user"

require('dotenv').config()
require('./passport')
import {} from '../global'

const {
  HOST,
  PORT,
  DB,
  FRONTEND_HOST,
} = process.env

const a: string = process.env.NODE_ENV

const main = async () => {
  
  mongoose.connect(DB, {useNewUrlParser: true})

  const db = mongoose.connection
  db.on('error', console.error.bind(console, 'connection error:'))
  db.once('open', function() {
    console.log('connected to db')
  })

  const app = express()

  app.use(cors({
    origin: FRONTEND_HOST,
    credentials: true
  }))

  app.get('/', (_, res) => res.redirect('/graphql'))

  const MongoStore = require('connect-mongo')(session)
 
  app.use(
    session({
      name: 'qid',
      store: new MongoStore({ mongooseConnection: mongoose.connection }),
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

  apolloServer.applyMiddleware({ app, cors: false })

  apolloServer.installSubscriptionHandlers(httpServer)

  httpServer.listen({ port: PORT }, () => {
    console.log(`🚀 Server ready at ${HOST}:${PORT}/graphql`)
    console.log(`🚀 Subscriptions ready at ${HOST}:${PORT}/graphql`)
  })

}

main() 