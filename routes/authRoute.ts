import { Router } from "express";
import { validateCredentials } from "../util/validators";
import { validationErrorMiddleware } from "../middleware/validationErrorMiddleware";
import { loginUser, logoutUser } from "../controllers/authController";

const authRoute = Router();

authRoute.post("/", validateCredentials, validationErrorMiddleware, loginUser );
authRoute.put("/", logoutUser);


export default authRoute;