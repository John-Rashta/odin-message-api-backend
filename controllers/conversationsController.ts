import asyncHandler from "express-async-handler";
import { matchedData } from "express-validator";
import { checkIfInConvo, getUserConversationsInfo, getUser, checkIfConvoExistsByUsers, createMessage, createConversation } from "../util/queries";
import { deleteLocalFile, uploadFile} from "../util/helperFunctions";

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
        await deleteLocalFile(req.file);
        res.status(400).json();
        return;
    };
    const formData = matchedData(req);

    if (req.user.id === formData.targetid) {
        await deleteLocalFile(req.file);
        res.status(400).json();
        return;
    };

    if (!formData.content && !req.file) {
        await deleteLocalFile(req.file);
        res.status(400).json();
        return;
    }

    if (formData.targetid) {
        const checkTarget = await getUser(formData.targetid);

        if (!checkTarget) {
            await deleteLocalFile(req.file);
            res.status(400).json();
            return;
        };
    };

    let fileInfo;
    if (formData.conversationid) {
        const checkConvo = await checkIfInConvo(req.user.id, formData.conversationid);
        if (!checkConvo) {
            await deleteLocalFile(req.file);
            res.status(400).json();
            return;
        };
        if (req.file) {
            fileInfo = await uploadFile(req.file);
        };
        await createMessage(req.user.id, new Date(), {convoid: formData.conversationid, content: formData.content,  ...(req.file ? {fileInfo: fileInfo} : {})});
        await deleteLocalFile(req.file);
        res.status(200).json();
        return;
    };

    if (req.file) {
        fileInfo = await uploadFile(req.file);
    };

    const diferentCheckConvo = await checkIfConvoExistsByUsers(req.user.id, formData.targetid);

    if (diferentCheckConvo) {
        await createMessage(req.user.id, new Date(), {convoid: diferentCheckConvo.id, content: formData.content,...(req.file ? {fileInfo: fileInfo} : {})});
        await deleteLocalFile(req.file);
        res.status(200).json();
        return;
    };

    const convoInfo = await createConversation(req.user.id, formData.targetid);
    await createMessage(req.user.id, new Date(), {convoid: convoInfo.id, content: formData.content,...(req.file ? {fileInfo: fileInfo} : {})});
    await deleteLocalFile(req.file);
    res.status(200).json({message: "New Conversation"});
});

const createConvo = asyncHandler(async(req, res) => {
    if (!req.user) {
        res.status(400).json();
        return;
    };

    const formData = matchedData(req);
    if (req.user.id === formData.targetid) {
        res.status(400).json();
        return;
    };
    const checkTarget = await getUser(formData.targetid);

    if (!checkTarget) {
        res.status(400).json();
        return;
    };

    const checkConvo = await checkIfConvoExistsByUsers(req.user.id, formData.targetid);

    if (checkConvo) {
        res.status(200).json({conversation: checkConvo.id});
        return;
    }

    const newConvo = await createConversation(req.user.id, formData.targetid);
    res.status(200).json({conversation: newConvo.id});
    return;
});

export { getConversations, getConversation, addMessageToConversation, createConvo };