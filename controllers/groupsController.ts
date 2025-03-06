import asyncHandler from "express-async-handler";
import { checkAndReturnGroup, checkIfGroupAdmin, checkIfGroupMember, createGroupChat, createMessage, getUser, getUserGroupsInfo, updateGroupInfo } from "../util/queries";
import { matchedData } from "express-validator";

const createGroup = asyncHandler(async(req, res) => {
    if (!req.user) {
        res.status(400).json();
        return;
    };

    const formData = matchedData(req);

    const newGroup = await createGroupChat(req.user.id, (formData.name ? formData.name : "New Group"));
    res.status(200).json(newGroup);

});

const getGroups = asyncHandler(async(req, res) => {
    if (!req.user) {
        res.status(400).json();
        return;
    };

    const groupsInfo = await getUserGroupsInfo(req.user.id);

    res.status(200).json(groupsInfo);
});

const getGroup = asyncHandler( async(req, res) => {
    if (!req.user) {
        res.status(400).json();
        return;
    };
    const formData = matchedData(req);
    const groupInfo = await checkAndReturnGroup(req.user.id, formData.groupid);

    if (!groupInfo) {
        res.status(400).json();
        return;
    };

    res.status(200).json(groupInfo);
});

const leaveGroup = asyncHandler(async(req, res) => {
    if (!req.user) {
        res.status(400).json();
        return;
    };

    const formData = matchedData(req);
    const checkGroup = await checkIfGroupMember(req.user.id, formData.groupid);

    if (!checkGroup) {
        res.status(400).json();
        return;
    };

    await updateGroupInfo(formData.groupid, {action: "REMOVE", adminid: req.user.id, memberid: req.user.id});

    res.status(200).json();
});

const updateGroup = asyncHandler(async(req, res) => {
    if (!req.user) {
        res.status(400).json();
        return;
    };
     
    const formData = matchedData(req);
    const checkAdmin = await checkIfGroupAdmin(req.user.id, formData.groupid);

    if (!checkAdmin) {
        res.status(400).json();
        return;
    };

    if (formData.targetid) {
        const checkTarget = await getUser(formData.targetid);
        
        if (!checkTarget) {
            res.status(400).json();
            return;
        }
    }

    if (formData.action  === "PROMOTE" && formData.targetid) {
        const checkIfMember = await checkIfGroupMember(formData.targetid, formData.groupid);

        if (!checkIfMember) {
            res.status(400).json({message: "Can't promote non-members"});
            return;
        };

        await updateGroupInfo(formData.groupid, {adminid: formData.targetid, action: "ADD", ...(formData.name ? { name: formData.name } : {})});
        res.status(200).json();
        return;
    };

    if ((formData.action === "ADD" || formData.action === "REMOVE") && formData.targetid) {
        await updateGroupInfo(formData.groupid, 
        {
            memberid: formData.targetid,
            action: formData.action,
            ...(formData.name ? { name: formData.name } : {}),
            ...(formData.action === "REMOVE" ? {adminid: formData.targetid,} : {})
        });
        res.status(200).json();
        return;
    };

    if (formData.name) {
        await updateGroupInfo(formData.groupid, {name: formData.name});
        res.status(200).json();
        return;
    };

    res.status(400).json();

});

const createMessageInGroup = asyncHandler(async(req, res) => {
    if (!req.user) {
        res.status(400).json();
        return;
    };
    const formData = matchedData(req);
    const checkIfMember = await checkIfGroupMember(req.user.id, formData.groupid);
    if (!checkIfMember) {
        res.status(400).json();
        return;
    };

    await createMessage(formData.content, req.user.id, Date(), {groupid: formData.groupid});
    res.status(200).json();
});

export { getGroups, getGroup, leaveGroup, updateGroup, createMessageInGroup, createGroup };