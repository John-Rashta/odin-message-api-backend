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
        res.status(200).json({message: "No Conversations Yet"});
        return;
    };

    res.status(200).json(conversationsInfo);
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

    res.status(200).json({conversationInfo});
});

const addMessageToConversation = asyncHandler(async(req, res) => {
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

    if (formData.conversationid) {
        const checkConvo = await checkIfInConvo(req.user.id, formData.conversationid);
        if (!checkConvo) {
            res.status(400).json();
            return;
        };
        await createMessage(formData.content, req.user.id, Date(), {convoid: formData.conversationid});
        res.status(200).json();
        return;
    };

    const diferentCheckConvo = await checkIfConvoExistsByUsers(req.user.id, formData.targetid);

    if (diferentCheckConvo) {
        await createMessage(formData.content, req.user.id, Date(), {convoid: formData.conversationid});
        res.status(200).json();
        return;
    };

    const convoInfo = await createConversation(req.user.id, formData.targetid);
    await createMessage(formData.content, req.user.id, Date(), {convoid: convoInfo.id});
    res.status(200).json(); 
});

export { getConversations, getConversation, addMessageToConversation };