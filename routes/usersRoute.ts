import { Router } from "express";
import { signupUser, getUserInfo, updateProfile, getSelfInfo, searchUsers, getIcons } from "../controllers/usersController";
import { validateCredentials, validateOptionalCredentials, validateSearchUser, validateUserProfile, validateUUID } from "../util/validators";
import { validationErrorMiddleware } from "../middleware/validationErrorMiddleware";
import { isAuth } from "../middleware/authMiddleware";

const usersRoute = Router();

usersRoute.get("/profile", isAuth, getSelfInfo);
usersRoute.get("/search", validateSearchUser, validationErrorMiddleware, searchUsers);
usersRoute.get("/:userid", isAuth, validateUUID("userid"), validationErrorMiddleware, getUserInfo);
usersRoute.post("/", validateCredentials, validateUserProfile, validationErrorMiddleware, signupUser);
usersRoute.put("/profile", isAuth, validateUserProfile, validateOptionalCredentials, validationErrorMiddleware, updateProfile);
usersRoute.get("/profile/icons", isAuth, getIcons);

export default usersRoute;