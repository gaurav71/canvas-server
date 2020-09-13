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
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const config_1 = require("./config");
const User_1 = __importDefault(require("./schemas/User"));
passport_1.default.serializeUser(function (userId, done) {
    console.log('serializeUser', userId);
    done(null, userId);
});
passport_1.default.deserializeUser(function (userId, done) {
    done(null, userId);
});
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: "88559551316-8ef42u3pakp6bkrautgg867numd2smeu.apps.googleusercontent.com",
    clientSecret: "1HFECGRiV_WH6WVEBlrm48du",
    callbackURL: `${config_1.server_url}/auth/google/callback`
}, function (accessToken, refreshToken, profile, done) {
    return __awaiter(this, void 0, void 0, function* () {
        const userId = yield createOrCheckUser(profile);
        return done(undefined, userId);
    });
}));
const createOrCheckUser = (profile) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, displayName, _json: { email } } = profile;
    let user = yield User_1.default.findOne({ profileId: id });
    if (!user) {
        user = new User_1.default({ profileId: id, fullName: displayName, email });
        yield user.save();
        console.log('new user created', { user });
    }
    else {
        console.log('user logged in', { user });
    }
    return user.id;
});
//# sourceMappingURL=passport.js.map