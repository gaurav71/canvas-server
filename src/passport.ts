import passport from 'passport';
import { Profile, Strategy as GoogleStrategy } from 'passport-google-oauth20'
import User from './schemas/User';

const {
  HOST,
  PORT,
  NODE_ENV,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET
} = process.env

const callbackURL = NODE_ENV === 'production' ? `https://${HOST}:${PORT}` : `http://${HOST}:${PORT}`

passport.serializeUser(function(userId, done) {
    console.log('serializeUser',userId)
    done(null, userId);
  });
  
passport.deserializeUser(function(userId, done) {
    done(null, userId);
});

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL
  },
  async function(accessToken, refreshToken, profile, done) {
    const userId = await createOrCheckUser(profile)
    return done(undefined, userId);
  }
));

const createOrCheckUser = async (profile: Profile) => {
  const { id, displayName, _json: { email } } = profile

  let user = await User.findOne({ profileId: id })

  if (!user) {
    user = new User({ profileId: id, fullName: displayName, email })
    await user.save()
    console.log('new user created', { user })
  } else {
    console.log('user logged in', { user })
  }

  return user.id
}