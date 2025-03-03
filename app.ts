import express from "express";
import session from "express-session";
import passport from "passport";
const app = express();
import "dotenv/config";
import cors from "cors";
import { errorHandler } from "./middleware/errorMiddleware";
import prisma from "./config/client";
import { PrismaSessionStore } from '@quixo3/prisma-session-store';
import authRoute from "./routes/authRoute";
import usersRoute from "./routes/usersRoute";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use(session({
  secret: process.env.SECRET as string, 
  resave: true, 
  saveUninitialized: true,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24
  },
  store: new PrismaSessionStore(
    prisma,
    {
      checkPeriod: 2 * 60 * 1000,  //ms
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }
  )
}));

import "./config/passport";

app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", authRoute);
app.use("/users", usersRoute);

app.use(errorHandler);

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Listening on Port ${PORT}`);
});
