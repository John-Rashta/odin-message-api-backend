import asyncHandler from "express-async-handler";
import { changeOnlineStatus } from "../util/queries";

const loginUser = asyncHandler(async(req, res) => {
  if (!req.user) {
    res.status(400).json();
    return;
  };
  await changeOnlineStatus(req.user.id, true);
  res.status(200).json({id: req.user.id});
});

const logoutUser = asyncHandler(async (req, res, next) => {
  if (!req.user) {
    res.status(400).json();
    return;
  };
  await changeOnlineStatus(req.user.id, false);
  req.logout((err) => {
    if (err) {
      next(err);
      return;
    }
    res.status(200).json();
    return;
  });
});

export { loginUser, logoutUser };