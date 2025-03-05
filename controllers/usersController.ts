import asyncHandler from "express-async-handler";
import { matchedData } from "express-validator";
import { changeUserInfo, checkIfFriendshipExists, checkIfUsernameAvailable, createUser, getIconInfo, getUser, searchForUsers } from "../util/queries";
import bcrypt from "bcryptjs";
import isUUID from "validator/lib/isUUID";

const signupUser = asyncHandler(async (req, res) => {
    const formData = matchedData(req);
    const invalidUser = await checkIfUsernameAvailable(formData.username);
    if (invalidUser) {
        res.status(404).json({message: "Unavailable Username"});
        return;
    };

    bcrypt.hash(formData.password, 10, async (err, hashedPassword) => {
        if (err) {
            console.log(err);
            res.status(500).json({message: "Internal Error"});
            return;
        }
        await createUser({...formData, password: hashedPassword, joinedAt: Date(), username: formData.username });
        res.status(200).json();
    });
});

const getUserInfo = asyncHandler(async(req, res) => {
    if (!req.user) {
        res.status(400).json();
        return;
    };
    const formData = matchedData(req);
    let friendsConfirmed = false;
    const checkIfFriends = await checkIfFriendshipExists(req.user.id, formData.userid);
    if (checkIfFriends) {
        friendsConfirmed = true;
    }
    const userInfo = await getUser(formData.userid, friendsConfirmed);
    
    if (!userInfo) {
        res.status(400).json();
        return;
    };
    const iconInfo = await getIconInfo(userInfo.icon);
    res.status(200).json({...userInfo, icon: iconInfo});
});

const updateProfile = asyncHandler(async(req, res) => {
    if (!req.user) {
        res.status(400).json();
        return;
    };

    const formData = matchedData(req);
    if (formData.icon) {
        const checkIcon = await getIconInfo(formData.icon);
        if (!checkIcon) {
            res.status(400).json();
            return;
        };
    };
    if (formData.username) {
        const alreadyUsed = await checkIfUsernameAvailable(formData.username);
        if (alreadyUsed){
            res.status(400).json({message: "Invalid Username"});
            return;
        }
    }
    await changeUserInfo(req.user.id, formData);

    res.status(200).json();
});

const getSelfInfo = asyncHandler(async(req, res) => {
    if (!req.user) {
        res.status(400).json();
        return;
    };

    const userInfo = await getUser(req.user.id);

    if (!userInfo) {
        res.status(400).json();
        return;
    };

    const iconInfo = await getIconInfo(userInfo.icon);

    res.status(200).json({...userInfo, icon: iconInfo});
});

const searchUsers = asyncHandler(async(req, res) => {
    const formData = matchedData(req);
    if (isUUID(formData.user)) {
        const possibleUser = await getUser(formData.user);
        res.status(200).json([possibleUser]);
        return;
    };

    const possibleUsers = await searchForUsers(formData.user);

    res.status(200).json(possibleUsers);
});

export { signupUser, getUserInfo, updateProfile, getSelfInfo, searchUsers };