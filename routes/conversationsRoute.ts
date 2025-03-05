import { Router } from "express";
import { isAuth } from "../middleware/authMiddleware";
import { validationErrorMiddleware } from "../middleware/validationErrorMiddleware";
import { validateBodyUUID, validateMessage, validateOptionalUUID, validateUUID } from "../util/validators";
import { addMessageToConversation } from "../controllers/conversationsController";

const conversationsRoute = Router();

conversationsRoute.get("/", isAuth, );
conversationsRoute.get("/:conversationid", isAuth, validateUUID("conversationid"), validationErrorMiddleware);
conversationsRoute.post("/{:conversationid}", isAuth, validateBodyUUID, validateMessage, validateOptionalUUID("conversationid"), validationErrorMiddleware, addMessageToConversation);

export default conversationsRoute;