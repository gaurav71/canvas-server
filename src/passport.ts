import passport from 'passport';
import { Profile, Strategy as GoogleStrategy } from 'passport-google-oauth20'
import { server_url } from './config';
import User from './schemas/User';

passport.serializeUser(function(userId, done) {
    console.log('serializeUser',userId)
    done(null, userId);
  });
  
passport.deserializeUser(function(userId, done) {
    done(null, userId);
});

passport.use(new GoogleStrategy({
    clientID: "88559551316-8ef42u3pakp6bkrautgg867numd2smeu.apps.googleusercontent.com",
    clientSecret: "1HFECGRiV_WH6WVEBlrm48du",
    callbackURL: `${server_url}/auth/google/callback`
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