import passport from "passport";
import asyncHandler from "express-async-handler";

const loginUser = passport.authenticate("local");

const logoutUser = asyncHandler(async (req, res, next) => {
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