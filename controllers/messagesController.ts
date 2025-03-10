import asyncHandler from "express-async-handler";
import { matchedData } from "express-validator";
import { checkOwnerOfMessage, deleteMessage, updateMessage } from "../util/queries";

const updateUserMessage = asyncHandler(async(req, res) => {
    if (!req.user) {
        res.status(400).json();
        return;
    };

    const formData = matchedData(req);
    const possibleMessage = await checkOwnerOfMessage(req.user.id, formData.messageid);

    if (!possibleMessage) {
        res.status(400).json();
        return;
    };

    await updateMessage(formData.messageid, formData.content);
    res.status(200).json();
});

const deleteUserMessage = asyncHandler(async(req, res) => {
    if (!req.user) {
        res.status(400).json();
        return;
    };

    const formData = matchedData(req);
    const possibleMessage = await checkOwnerOfMessage(req.user.id, formData.messageid);

    if (!possibleMessage) {
        res.status(400).json();
        return;
    };

    await deleteMessage(formData.messageid);
    res.status(200).json();
});

export { updateUserMessage, deleteUserMessage };