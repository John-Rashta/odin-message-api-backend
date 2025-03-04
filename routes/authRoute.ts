import { Router } from "express";
import { validateCredentials } from "../util/validators";
import { validationErrorMiddleware } from "../middleware/validationErrorMiddleware";
import { loginUser, logoutUser } from "../controllers/authController";
import { isAuth } from "../middleware/authMiddleware";

const authRoute = Router();

authRoute.post("/", validateCredentials, validationErrorMiddleware, loginUser );
authRoute.put("/", isAuth, logoutUser);


export default authRoute;