import asyncHandler from "express-async-handler";
import { matchedData } from "express-validator";
import { checkIfUsernameAvailable, createUser, getUser } from "../util/queries";
import bcrypt from "bcryptjs";

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
        await createUser(formData.username, hashedPassword);
        res.status(200).json();
    });
});

const getUserInfo = asyncHandler(async(req, res) => {
    if (!req.user) {
        res.status(400).json();
        return;
    };

    const userInfo = await getUser(req.user.id);

    if (!userInfo) {
        res.status(400).json();
        return;
    };

    res.status(200).json(userInfo);
});

export { signupUser, getUserInfo };