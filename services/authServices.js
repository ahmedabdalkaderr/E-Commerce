const crypto = require("crypto");
// eslint-disable-next-line import/no-extraneous-dependencies
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const sendEmail = require("../utils/sendEmail");
const APIError = require("../utils/apiError");
const createToken = require("../utils/createToken");

const User = require("../models/userModel");

exports.signup = asyncHandler(async (req, res) => {
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    role: req.body.role,
  });

  const token = createToken(user._id);

  res.send({ data: user, token });
});

exports.login = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  let isCorrectPassword;
  if (user)
    isCorrectPassword = await bcrypt.compare(req.body.password, user.password);
  if (!user || !isCorrectPassword) {
    return next(new APIError("email or password is not correct", 400));
  }
  const token = createToken(user._id);

  res.send({ data: user, token });
});

exports.protect = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization;
  let token;
  if (header && header.startsWith("Bearer")) token = header.split(" ")[1];
  if (!token) {
    return next(
      new APIError("you are not login, please login to access this route", 401)
    );
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  const currentUser = await User.findById(decoded.userId);

  if (!currentUser) {
    return next(
      new APIError("the user belonging to this token is no longer exist", 401)
    );
  }

  if (currentUser.passwordChangedAt) {
    // get number of seconds left since this changed happened
    const passChangedTimesTamp = parseInt(
      currentUser.passwordChangedAt.getTime() / 1000,
      10
    );
    if (passChangedTimesTamp > decoded.iat) {
      return next(
        new APIError(
          "user changed his password recently, please login again",
          401
        )
      );
    }
  }
  req.user = currentUser;
  next();
});

exports.allowedTo = (...roles) =>
  asyncHandler(async (req, res, next) => {
    console.log(roles);
    if (!roles.includes(req.user.role)) {
      return next(
        new APIError("you are not allowed to access this route", 403)
      );
    }
    next();
  });

exports.forgetPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new APIError("no user exist for this email", 404));
  }
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const hashResetCode = crypto
    .createHash("sha256")
    .update(resetCode)
    .digest("hex");

  user.passwordResetCode = hashResetCode;
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  user.passwordResetVerified = false;
  await user.save();

  const message = `Hi ${user.name},\n We received a request to reset the password on your Account. \n ${resetCode} \n Enter this code to complete the reset. \n Thanks for helping us keep your account secure.\n Your master Ahmed Abdelkader`;
  try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset code (valid for 10 min)",
      message,
    });
  } catch (err) {
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    user.passwordResetVerified = undefined;

    await user.save();
    return next(new APIError(err.message, 500));
  }

  res
    .status(200)
    .json({ status: "Success", message: "Reset code sent to email" });
});

exports.verifyResetCode = asyncHandler(async (req, res, next) => {
  const hashResetCode = crypto
    .createHash("sha256")
    .update(req.body.passwordResetCode)
    .digest("hex");

  const user = await User.findOne({
    passwordResetCode: hashResetCode,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new APIError("Invalid reset code or expired in time"));
  }

  user.passwordResetVerified = true;
  await user.save();

  res.status(200).json({
    status: "success",
  });
});

exports.resetPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new APIError(`There is no user with email ${req.body.email}`, 404)
    );
  }

  if (!user.passwordResetVerified) {
    return next(new APIError("Reset code not verified", 400));
  }

  user.password = req.body.newPassword;
  user.passwordResetCode = undefined;
  user.passwordResetExpires = undefined;
  user.passwordResetVerified = undefined;

  await user.save();

  const token = createToken(user._id);
  res.status(200).json({ token });
});
