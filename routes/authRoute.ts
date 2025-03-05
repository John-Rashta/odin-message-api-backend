import { Router } from "express";
import { validateCredentials } from "../util/validators";
import { validationErrorMiddleware } from "../middleware/validationErrorMiddleware";
import { loginUser, logoutUser } from "../controllers/authController";
import { isAuth } from "../middleware/authMiddleware";
import passport from "passport";

const authRoute = Router();

authRoute.post("/", validateCredentials, validationErrorMiddleware, passport.authenticate("local"), loginUser);
authRoute.put("/", isAuth, logoutUser);


export default authRoute;