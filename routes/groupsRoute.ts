import { Router } from "express";
import { isAuth } from "../middleware/authMiddleware";
import { multerErrorMiddleware } from "../middleware/multerErrorMiddleware";
import { upload } from "../middleware/uploadMiddleware";
import { validationErrorMiddleware } from "../middleware/validationErrorMiddleware";
import { validateGroupName, validateGroupUpdate, validateOptionalMessage, validateUUID } from "../util/validators";
import { createGroup, createMessageInGroup, fullDeleteGroup, getGroup, getGroups, leaveGroup, updateGroup } from "../controllers/groupsController";

const groupsRoute = Router();

groupsRoute.get("/", isAuth, getGroups);
groupsRoute.get("/:groupid", isAuth, validateUUID("groupid"), validationErrorMiddleware, getGroup);
groupsRoute.post("/", isAuth, validateGroupName, validationErrorMiddleware, createGroup);
groupsRoute.post("/:groupid", isAuth, validateUUID("groupid"), validateOptionalMessage ,validationErrorMiddleware, upload.single("uploaded_file"), createMessageInGroup,  multerErrorMiddleware);
groupsRoute.post("/:groupid/leave", isAuth, validateUUID("groupid"), validationErrorMiddleware, leaveGroup);
groupsRoute.put("/:groupid", isAuth, validateUUID("groupid"), validateGroupName, validateGroupUpdate, validationErrorMiddleware, updateGroup);
groupsRoute.delete("/:groupid", isAuth, validateUUID("groupid"), validationErrorMiddleware, fullDeleteGroup);

export default groupsRoute;