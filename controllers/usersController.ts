import asyncHandler from "express-async-handler";
import { matchedData } from "express-validator";
import { changeUserInfo, checkIfFriendshipExists, checkIfUsernameAvailable, createUser, getAllIconsInfo, getIconInfo, getUser, getUserPassword, searchForUsers } from "../util/queries";
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
        await createUser({...formData, password: hashedPassword, joinedAt: new Date(), username: formData.username });
        res.status(200).json();
        return;
    });
    return;
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
    res.status(200).json({user: userInfo});
    return;
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

    if (formData.password && !formData.oldPassword || formData.oldPassword && !formData.password) {
        res.status(400).json({message: "Missing either old or new password"});
        return;
    };

    if (formData.password && formData.oldPassword) {
        const userPw = await getUserPassword(req.user.id);
        if  (!userPw) {
            res.status(400).json();
            return;
        }
        const match = bcrypt.compare(formData.oldPassword, userPw.password);
        if (!match) {
            res.status(400).json({message: "Wrong old password"});
            return;
        };
        bcrypt.hash(formData.password, 10, async (err, hashedPassword) => {
            if (err) {
                console.log(err);
                res.status(500).json({message: "Internal Error"});
                return;
            }
            if (req.user) {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { oldPassword, ...rest} = formData;
                await changeUserInfo(req.user.id, {...rest, password: hashedPassword});
                res.status(200).json();
                return;
            };
        });
        return;
    } else if (formData.username) {
        const alreadyUsed = await checkIfUsernameAvailable(formData.username);
        if (alreadyUsed){
            res.status(400).json({message: "Invalid Username"});
            return;
        }
    };
    await changeUserInfo(req.user.id, formData);

    res.status(200).json();
    return;
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
    res.status(200).json({user: userInfo});
    return;
});

const searchUsers = asyncHandler(async(req, res) => {
    const formData = matchedData(req);
    if (isUUID(formData.user)) {
        const possibleUser = await getUser(formData.user);
        res.status(200).json({users: [possibleUser]});
        return;
    };

    const possibleUsers = await searchForUsers(formData.user);

    res.status(200).json({users: possibleUsers});
    return;
});

const getIcons = asyncHandler(async(req, res) => {
    if (!req.user) {
        res.status(400).json();
        return;
    };
    const iconsInfo = await getAllIconsInfo();
    res.status(200).json({icons: iconsInfo});
    return;
});

export { signupUser, getUserInfo, updateProfile, getSelfInfo, searchUsers, getIcons };