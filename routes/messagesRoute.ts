import { Router } from "express";
import { isAuth } from "../middleware/authMiddleware";
import { validateMessage, validateUUID } from "../util/validators";
import { deleteUserMessage, updateUserMessage } from "../controllers/messagesController";

const messagesRoute = Router();

messagesRoute.put("/:messageid", isAuth, validateUUID("messageid"), validateMessage, updateUserMessage );
messagesRoute.delete("/:messageid", isAuth, validateUUID("messageid"), deleteUserMessage);

export default messagesRoute;