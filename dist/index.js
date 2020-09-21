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
const cors_1 = __importDefault(require("cors"));
const express_session_1 = __importDefault(require("express-session"));
const passport_1 = __importDefault(require("passport"));
const mongoose_1 = __importDefault(require("mongoose"));
const connect_mongo_1 = __importDefault(require("connect-mongo"));
const url_1 = __importDefault(require("url"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const apollo_server_express_1 = require("apollo-server-express");
const type_graphql_1 = require("type-graphql");
const http_1 = require("http");
const hello_1 = require("./resolvers/hello");
const shape_1 = require("./resolvers/shape");
const canvas_1 = require("./resolvers/canvas");
const user_1 = require("./resolvers/user");
const socket_1 = __importDefault(require("./socket"));
const validateUserByCookies_1 = require("./utils/validateUserByCookies");
require('dotenv').config();
require('./passport');
const { HOST, PORT, DB, FRONTEND_HOST, } = process.env;
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    const app = express_1.default();
    app.use(cors_1.default({
        origin: FRONTEND_HOST,
        credentials: true
    }));
    app.use(cookie_parser_1.default());
    mongoose_1.default.connect(DB, { useNewUrlParser: true });
    const db = mongoose_1.default.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function () {
        console.log('connected to db');
    });
    app.get('/', (_, res) => res.redirect('/graphql'));
    const MongoStore = connect_mongo_1.default(express_session_1.default);
    const store = new MongoStore({ mongooseConnection: mongoose_1.default.connection });
    app.use(express_session_1.default({
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
    }));
    app.use(passport_1.default.initialize());
    app.use(passport_1.default.session());
    app.get('/auth/google', passport_1.default.authenticate('google', { scope: ['profile', 'email'] }));
    app.get('/auth/google/callback', passport_1.default.authenticate('google', {
        failureRedirect: `${FRONTEND_HOST}/auth/failed`
    }), (_, res) => {
        res.redirect(FRONTEND_HOST);
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
                    res
                });
            }
        }
    });
    const httpServer = http_1.createServer(app);
    socket_1.default(httpServer);
    apolloServer.applyMiddleware({ app, cors: false });
    apolloServer.installSubscriptionHandlers(httpServer);
    httpServer.listen({ port: PORT }, () => {
        console.log(`🚀 Server ready at ${HOST}:${PORT}/graphql`);
        console.log(`🚀 Subscriptions ready at ${HOST}:${PORT}/graphql`);
    });
    let [socketioUpgradeListener, apolloUpgradeListener] = httpServer.listeners('upgrade').slice(0);
    httpServer.removeAllListeners('upgrade');
    httpServer.on("upgrade", (req, socket, head) => __awaiter(void 0, void 0, void 0, function* () {
        const pathname = url_1.default.parse(req.url).pathname;
        console.log({ pathname }, req.headers.cookie);
        if (!validateUserByCookies_1.validateUserByCookies(req, store)) {
            socket.write('HTTP/1.1 401 Web Socket Protocol Handshake\r\n' +
                'Upgrade: WebSocket\r\n' +
                'Connection: Upgrade\r\n' +
                '\r\n');
            socket.destroy();
            return;
        }
        if (pathname === '/socket.io/') {
            socketioUpgradeListener(req, socket, head);
        }
        if (pathname === '/graphql') {
            apolloUpgradeListener(req, socket, head);
        }
    }));
});
main();
//# sourceMappingURL=index.js.map