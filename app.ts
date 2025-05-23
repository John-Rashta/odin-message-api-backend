import express from "express";
import session from "express-session";
import passport from "passport";
const app = express();
import "dotenv/config";
import cors from "cors";
import { errorHandler } from "./middleware/errorMiddleware";
import prisma from "./config/client";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import authRoute from "./routes/authRoute";
import usersRoute from "./routes/usersRoute";
import requestsRoute from "./routes/requestsRoute";
import friendsRoute from "./routes/friendsRoute";
import conversationsRoute from "./routes/conversationsRoute";
import groupsRoute from "./routes/groupsRoute";
import messagesRoute from "./routes/messagesRoute";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ credentials: true, origin: "http://localhost:5173" }));

app.use(
  session({
    secret: process.env.SECRET as string,
    resave: true,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
    },
    store: new PrismaSessionStore(prisma, {
      checkPeriod: 2 * 60 * 1000, //ms
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
  }),
);

import "./config/passport";

app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", authRoute);
app.use("/users", usersRoute);
app.use("/requests", requestsRoute);
app.use("/friends", friendsRoute);
app.use("/conversations", conversationsRoute);
app.use("/messages", messagesRoute);
app.use("/groups", groupsRoute);

app.use(errorHandler);

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Listening on Port ${PORT}`);
});
