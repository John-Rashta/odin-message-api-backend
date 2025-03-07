import asyncHandler from "express-async-handler";
import { getUserFriends, deleteFriendship, checkIfFriendshipExists } from "../util/queries";
import { matchedData } from "express-validator";

const getFriends = asyncHandler( async(req, res) => {
    if (!req.user) {
        res.status(400).json();
        return;
    };
    
    const friendships = await getUserFriends(req.user.id);
    if (!friendships) {
        res.status(200).json({message: "Empty Friendlist"});
        return;
    }
    res.status(200).json({friends: friendships});
});

const deleteFriend = asyncHandler(async(req, res) => {
    if (!req.user) {
        res.status(400).json();
        return;
    };

    const formData = matchedData(req);

    const checkFriendship = await checkIfFriendshipExists(req.user.id, formData.targetid);

    if (!checkFriendship) {
        res.status(400).json();
        return;
    };

    await deleteFriendship(checkFriendship.id);

    res.status(200).json();
});

export { getFriends, deleteFriend };