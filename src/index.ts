import "reflect-metadata";
import express from 'express';
import { createConnection } from "typeorm";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import cors from "cors"
import session from 'express-session';

import { createServer } from "http";
import io from "socket.io";
import { HelloResolver } from "./resolvers/hello";
import passport from "passport";

import mongoose from 'mongoose';
import { ShapeResolver } from "./resolvers/shape";
import { CanvasResolver } from "./resolvers/canvas";
import { UserResolver } from "./resolvers/user";
import { server_url, server_url_socket, web_url } from "./config";

require('./passport');

const main = async () => {
  
  mongoose.connect('mongodb+srv://gaurav:helloworld@cluster0.n0ebg.mongodb.net/canvas?retryWrites=true&w=majority', {useNewUrlParser: true});

  const db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function() {
    console.log('connected to db')
  });

  const app = express();

  app.use(cors({
    origin: web_url,
    credentials: true
  }))

  const sessionConfig = {
    cookieName: 'qid',
    maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
    httpOnly: true,
    sameSite: 'lax',
    secret: 'asdfasdbhgasdfsdf',
    resave: false,
    saveUninitialized: false
  } as const

    const MongoStore = require('connect-mongo')(session);
 
  app.use(
    session({
      name: sessionConfig.cookieName,
      store: new MongoStore({ mongooseConnection: mongoose.connection }),
      cookie: {
        maxAge: sessionConfig.maxAge,
        httpOnly: sessionConfig.httpOnly,
        sameSite: sessionConfig.sameSite,
        secure: false
      },
      secret: sessionConfig.secret,
      resave: sessionConfig.resave,
      saveUninitialized: sessionConfig.saveUninitialized
    })
  )

  app.use(passport.initialize());
  app.use(passport.session());

  app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

  app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/failed' }),
    function(req, res) {
      res.redirect(web_url);
    }
  );

  app.get('/failed', (req, res) => res.send('You Failed to log in!'))
  app.get('/', (req, res) => {
    console.log(req.user)
    res.send(`Welcome`)
  })

  const httpServer = createServer(app);

  const socket = io(httpServer)

  socket.on('connect', () => {
    socket.send('Hello!');
    socket.emit('salutations', 'Hello!', { 'mr': 'john' }, Uint8Array.from([1, 2, 3, 4]));
  });
  socket.on('message', (data: any) => {
    console.log(data);
  });
  socket.on('greetings', (elem1: any, elem2: any, elem3: any) => {
    console.log(elem1, elem2, elem3);
  });

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
          res,
          socket
        })
      }
    }
  })

  apolloServer.applyMiddleware({ app, cors: false })

  apolloServer.installSubscriptionHandlers(httpServer);

  const PORT = 5000

  httpServer.listen({ port: PORT }, () => {
    console.log(`🚀 Server ready at ${server_url}/graphql`);
    console.log(`🚀 Subscriptions ready at ${server_url_socket}/graphql`);
  });

}

main(); 