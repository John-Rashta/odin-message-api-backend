import express from 'express';
import session from "express-session";
import prisma from "../config/client";
import { PrismaSessionStore } from '@quixo3/prisma-session-store';
import authRoute from "../routes/authRoute";
import usersRoute from "../routes/usersRoute";
import requestsRoute from "../routes/requestsRoute";
import friendsRoute from "../routes/friendsRoute";
import conversationsRoute from "../routes/conversationsRoute";
import groupsRoute from "../routes/groupsRoute";
import messagesRoute from "../routes/messagesRoute";
import passport from "passport";
import { errorHandler } from "../middleware/errorMiddleware";

const storeStuff = new PrismaSessionStore(prisma,
  {
    checkPeriod: 2 * 60 * 1000,  //ms
    dbRecordIdIsSessionId: true,
    dbRecordIdFunction: undefined,
});

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(session({
    secret: process.env.SECRET as string, 
    resave: true, 
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24
    },
    store: storeStuff
  }));

import "../config/passport";

app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", authRoute);
app.use("/users", usersRoute);
app.use("/requests", requestsRoute);
app.use("/friends", friendsRoute);
app.use("/conversations", conversationsRoute);
app.use("/messages", messagesRoute);
app.use("groups", groupsRoute);

app.use(errorHandler);

export default app;
export { storeStuff };