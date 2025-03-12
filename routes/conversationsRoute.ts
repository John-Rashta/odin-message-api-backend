import { Router } from "express";
import { isAuth } from "../middleware/authMiddleware";
import { validationErrorMiddleware } from "../middleware/validationErrorMiddleware";
import { validateBodyUUID, validateMessage, validateOptionalUUID, validateUUID } from "../util/validators";
import { addMessageToConversation, createConvo, getConversation, getConversations } from "../controllers/conversationsController";

const conversationsRoute = Router();

conversationsRoute.get("/", isAuth, getConversations );
conversationsRoute.get("/:conversationid", isAuth, validateUUID("conversationid"), validationErrorMiddleware, getConversation);
conversationsRoute.post("/", isAuth, validateOptionalUUID("targetid"), validateMessage, validateOptionalUUID("conversationid"), validationErrorMiddleware, addMessageToConversation);
conversationsRoute.post("/create", isAuth, validateBodyUUID, validationErrorMiddleware, createConvo);

export default conversationsRoute;