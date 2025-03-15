import { Router } from "express";
import { isAuth } from "../middleware/authMiddleware";
import { upload } from "../middleware/uploadMiddleware";
import { validationErrorMiddleware } from "../middleware/validationErrorMiddleware";
import { multerErrorMiddleware } from "../middleware/multerErrorMiddleware";
import { validateBodyUUID, validateOptionalMessage, validateOptionalUUID, validateUUID } from "../util/validators";
import { addMessageToConversation, createConvo, getConversation, getConversations } from "../controllers/conversationsController";

const conversationsRoute = Router();

conversationsRoute.get("/", isAuth, getConversations );
conversationsRoute.get("/:conversationid", isAuth, validateUUID("conversationid"), validationErrorMiddleware, getConversation);
conversationsRoute.post("/", isAuth, upload.single("uploaded_file"), validateOptionalUUID("targetid"), validateOptionalMessage, validateOptionalUUID("conversationid"), validationErrorMiddleware, addMessageToConversation, multerErrorMiddleware);
conversationsRoute.post("/create", isAuth, validateBodyUUID, validationErrorMiddleware, createConvo);

export default conversationsRoute;