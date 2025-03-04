import { Router } from "express";
import { isAuth } from "../middleware/authMiddleware";
import { validationErrorMiddleware } from "../middleware/validationErrorMiddleware";
import { validateUUID } from "../util/validators";
import { getFriends, deleteFriend } from "../controllers/friendsController";


const friendsRoute = Router();

friendsRoute.get("/", isAuth, getFriends);
friendsRoute.delete("/:friendshipid", isAuth, validateUUID("friendshipid"), validationErrorMiddleware, deleteFriend);

export default friendsRoute;