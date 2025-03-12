import asyncHandler from "express-async-handler";
import { matchedData } from "express-validator";
import { checkIfInConvo, getUserConversationsInfo, getUser, checkIfConvoExistsByUsers, createMessage, createConversation } from "../util/queries";

const getConversations = asyncHandler(async(req, res) => {
    if (!req.user) {
        res.status(400).json();
        return;
    };

    const conversationsInfo = await getUserConversationsInfo(req.user.id);
    
    if  (!conversationsInfo) {
        res.status(400).json();
        return;
    };

    res.status(200).json({user: conversationsInfo});
});

const getConversation = asyncHandler(async(req, res) => {
    if (!req.user) {
        res.status(400).json();
        return;
    };

    const formData = matchedData(req);

    const conversationInfo = await checkIfInConvo(req.user.id, formData.conversationid);

    if (!conversationInfo) {
        res.status(400).json();
        return;
    };

    res.status(200).json({conversation: conversationInfo});
});

const addMessageToConversation = asyncHandler(async(req, res) => {
    if (!req.user) {
        res.status(400).json();
        return;
    };
    const formData = matchedData(req);
    if (formData.targetid) {
        const checkTarget = await getUser(formData.targetid);

        if (!checkTarget) {
            res.status(400).json();
            return;
        };
    };

    if (formData.conversationid) {
        const checkConvo = await checkIfInConvo(req.user.id, formData.conversationid);
        if (!checkConvo) {
            res.status(400).json();
            return;
        };
        await createMessage(formData.content, req.user.id, new Date(), {convoid: formData.conversationid});
        res.status(200).json();
        return;
    };

    const diferentCheckConvo = await checkIfConvoExistsByUsers(req.user.id, formData.targetid);

    if (diferentCheckConvo) {
        await createMessage(formData.content, req.user.id, new Date(), {convoid: diferentCheckConvo.id});
        res.status(200).json();
        return;
    };

    const convoInfo = await createConversation(req.user.id, formData.targetid);
    await createMessage(formData.content, req.user.id, new Date(), {convoid: convoInfo.id});
    res.status(200).json({message: "New Conversation"});
});

const createConvo = asyncHandler(async(req, res) => {
    if (!req.user) {
        res.status(400).json();
        return;
    };

    const formData = matchedData(req);
    const checkTarget = await getUser(formData.targetid);

    if (!checkTarget) {
        res.status(400).json();
        return;
    };

    const newConvo = await createConversation(req.user.id, formData.targetid);
    res.status(200).json({conversation: newConvo.id});
    return;
});

export { getConversations, getConversation, addMessageToConversation, createConvo };