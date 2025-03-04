import { Router } from "express";
import { signupUser, getUserInfo } from "../controllers/usersController";
import { validateCredentials } from "../util/validators";
import { validationErrorMiddleware } from "../middleware/validationErrorMiddleware";

const usersRoute = Router();

usersRoute.get("/", getUserInfo);
usersRoute.post("/", validateCredentials, validationErrorMiddleware, signupUser);

export default usersRoute;