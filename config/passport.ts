import passport from "passport";
import { Strategy as localStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import "dotenv/config";
import { VerifyFunction } from "passport-local";
import { getUser, getUserByName } from "../util/queries";

const verifyCallback: VerifyFunction = async (username, password, done) => {
  try {
    const user = await getUserByName(username);
    if (!user) {
      return done(null, false, { message: "Incorrect username" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return done(null, false, { message: "Incorrect password" });
    }
    return done(null, { username: user.username, id: user.id });
  } catch (err) {
    return done(err);
  }
};

const strategy = new localStrategy(verifyCallback);

passport.use(strategy);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await getUser(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});
