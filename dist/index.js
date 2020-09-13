"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const apollo_server_express_1 = require("apollo-server-express");
const type_graphql_1 = require("type-graphql");
const cors_1 = __importDefault(require("cors"));
const express_session_1 = __importDefault(require("express-session"));
const http_1 = require("http");
const socket_io_1 = __importDefault(require("socket.io"));
const hello_1 = require("./resolvers/hello");
const passport_1 = __importDefault(require("passport"));
const mongoose_1 = __importDefault(require("mongoose"));
const shape_1 = require("./resolvers/shape");
const canvas_1 = require("./resolvers/canvas");
const user_1 = require("./resolvers/user");
const config_1 = require("./config");
require('./passport');
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    mongoose_1.default.connect('mongodb+srv://gaurav:helloworld@cluster0.n0ebg.mongodb.net/canvas?retryWrites=true&w=majority', { useNewUrlParser: true });
    const db = mongoose_1.default.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function () {
        console.log('connected to db');
    });
    const app = express_1.default();
    app.use(cors_1.default({
        origin: config_1.web_url,
        credentials: true
    }));
    const sessionConfig = {
        cookieName: 'qid',
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
        httpOnly: true,
        sameSite: 'lax',
        secret: 'asdfasdbhgasdfsdf',
        resave: false,
        saveUninitialized: false
    };
    const MongoStore = require('connect-mongo')(express_session_1.default);
    app.use(express_session_1.default({
        name: sessionConfig.cookieName,
        store: new MongoStore({ mongooseConnection: mongoose_1.default.connection }),
        cookie: {
            maxAge: sessionConfig.maxAge,
            httpOnly: sessionConfig.httpOnly,
            sameSite: sessionConfig.sameSite,
            secure: false
        },
        secret: sessionConfig.secret,
        resave: sessionConfig.resave,
        saveUninitialized: sessionConfig.saveUninitialized
    }));
    app.use(passport_1.default.initialize());
    app.use(passport_1.default.session());
    app.get('/auth/google', passport_1.default.authenticate('google', { scope: ['profile', 'email'] }));
    app.get('/auth/google/callback', passport_1.default.authenticate('google', { failureRedirect: '/failed' }), function (req, res) {
        res.redirect(config_1.web_url);
    });
    app.get('/failed', (req, res) => res.send('You Failed to log in!'));
    app.get('/', (req, res) => {
        console.log(req.user);
        res.send(`Welcome`);
    });
    const httpServer = http_1.createServer(app);
    const socket = socket_io_1.default(httpServer);
    socket.on('connect', () => {
        socket.send('Hello!');
        socket.emit('salutations', 'Hello!', { 'mr': 'john' }, Uint8Array.from([1, 2, 3, 4]));
    });
    socket.on('message', (data) => {
        console.log(data);
    });
    socket.on('greetings', (elem1, elem2, elem3) => {
        console.log(elem1, elem2, elem3);
    });
    const apolloServer = new apollo_server_express_1.ApolloServer({
        schema: yield type_graphql_1.buildSchema({
            resolvers: [hello_1.HelloResolver, shape_1.ShapeResolver, canvas_1.CanvasResolver, user_1.UserResolver],
            validate: false
        }),
        context: ({ req, res, connection }) => {
            if (connection) {
                return connection.context;
            }
            else {
                return ({
                    req,
                    res,
                    socket
                });
            }
        }
    });
    apolloServer.applyMiddleware({ app, cors: false });
    apolloServer.installSubscriptionHandlers(httpServer);
    const PORT = 5000;
    httpServer.listen({ port: PORT }, () => {
        console.log(`🚀 Server ready at ${config_1.server_url}/graphql`);
        console.log(`🚀 Subscriptions ready at ${config_1.server_url_socket}/graphql`);
    });
});
main();
//# sourceMappingURL=index.js.map