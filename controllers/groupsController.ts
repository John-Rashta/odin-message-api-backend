import asyncHandler from "express-async-handler";
import { checkAndReturnGroup, checkIfGroupAdmin, checkIfGroupMember, createGroupChat, createMessage, deleteGroup, getUser, getUserGroupsInfo, updateGroupInfo } from "../util/queries";
import { matchedData } from "express-validator";

const createGroup = asyncHandler(async(req, res) => {
    if (!req.user) {
        res.status(400).json();
        return;
    };

    const formData = matchedData(req);

    const newGroup = await createGroupChat(req.user.id, (formData.name ? formData.name : "New Group"));
    res.status(200).json({group: newGroup});

});

const getGroups = asyncHandler(async(req, res) => {
    if (!req.user) {
        res.status(400).json();
        return;
    };

    const groupsInfo = await getUserGroupsInfo(req.user.id);

    res.status(200).json({user: groupsInfo});
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

    res.status(200).json({group: groupInfo});
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
    const groupInfo = await updateGroupInfo(formData.groupid, {action: "REMOVE", adminid: req.user.id, memberid: req.user.id});
    if (groupInfo.members.length < 1) {
        await deleteGroup(formData.groupid);
    };
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

    if (formData.action === "DEMOTE" && formData.targetid) {
        const checkIfAdmin = await checkIfGroupAdmin(formData.targetid, formData.groupid);
        if (!checkIfAdmin) {
            res.status(400).json();
            return;
        };

        await updateGroupInfo(formData.groupid, {adminid: formData.targetid, action:"REMOVE"});
        res.status(200).json();
        return;
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

    if (formData.action === "REMOVE" && formData.targetid) {
        const groupInfo = await updateGroupInfo(formData.groupid, 
        {
            memberid: formData.targetid,
            action: formData.action,
            ...(formData.name ? { name: formData.name } : {}),
            adminid: formData.targetid,
        });
        if (groupInfo.members.length < 1) {
            await deleteGroup(formData.groupid);
        };
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

    await createMessage(formData.content, req.user.id,  new Date(), {groupid: formData.groupid});
    res.status(200).json();
});

const fullDeleteGroup = asyncHandler(async(req, res) => {
    if (!req.user) {
        res.status(400).json();
        return;
    };

    const formData = matchedData(req);
    const checkIfAdmin = await checkIfGroupAdmin(req.user.id, formData.groupid);

    if (!checkIfAdmin) {
        res.status(400).json();
        return;
    };

    await deleteGroup(formData.groupid);
    res.status(200).json();
});

export { getGroups, getGroup, leaveGroup, updateGroup, createMessageInGroup, createGroup, fullDeleteGroup };