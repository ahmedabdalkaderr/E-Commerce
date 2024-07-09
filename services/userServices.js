const { v4: uuidv4 } = require("uuid");
// eslint-disable-next-line import/no-extraneous-dependencies
const bcrypt = require("bcryptjs");
const sharp = require("sharp");
const asyncHandler = require("express-async-handler");
const factory = require("./handlersFactory");
const APIError = require("../utils/apiError");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");
const createToken = require("../utils/createToken");

const User = require("../models/userModel");

exports.uploadUserImage = uploadSingleImage("profileImg");
exports.resizeImage = asyncHandler(async (req, res, next) => {
  if (req.file) {
    const filename = `user-${uuidv4()}-${Date.now()}.jpeg`;
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`uploads/users/${filename}`);
    req.body.profileImg = filename;
  }

  next();
});
exports.getUsers = factory.getAll(User);
exports.createUser = factory.createOne(User);
exports.getUser = factory.getOne(User);
exports.updateUser = asyncHandler(async (req, res, next) => {
  const document = await User.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      role: req.body.role,
      profileImg: req.body.profileImg,
    },
    {
      new: true,
    }
  );

  if (!document) {
    return next(new APIError(`no document with this id ${req.params.id}`, 404));
  }
  res.status(200).json({
    data: document,
  });
});

exports.changeUserPassword = asyncHandler(async (req, res, next) => {
  const document = await User.findByIdAndUpdate(
    req.params.id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now(),
    },
    {
      new: true,
    }
  );

  if (!document) {
    return next(new APIError(`no document with this id ${req.params.id}`, 404));
  }
  res.status(200).json({
    data: document,
  });
});

exports.deleteUser = factory.deleteOne(User);

exports.getLoggedUser = asyncHandler(async (req, res, next) => {
  req.params.id = req.user._id;
  next();
});

exports.updateLoggedUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
    },
    {
      new: true,
    }
  );

  res.status(200).json({
    data: user,
  });
});

exports.updateLoggedUserPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now(),
    },
    {
      new: true,
    }
  );

  if (!user) {
    return next(new APIError(`no user with this id ${req.params.id}`, 404));
  }
  const token = createToken(user._id);
  res.status(200).json({
    data: user,
    token,
  });
});

exports.deleteLoggedUser = asyncHandler(async (req, res, next) => {
  await User.findByIdAndRemove(req.user._id);
  res.status(204).json({status:"success"});
});

