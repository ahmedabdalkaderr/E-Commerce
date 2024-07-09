const express = require("express");
const services = require("../services/userServices");

const {
  getUserValidator,
  createUserValidator,
  updateUserValidator,
  updateLoggedUserValidator,
  deleteUserValidator,
  changeUserPasswordValidation,
} = require("../utils/validators/userValidator");
const authServices = require("../services/authServices");

const router = express.Router();

router
  .route("/me")
  .get(authServices.protect, services.getLoggedUser, services.getUser);
router
  .route("/me")
  .put(
    authServices.protect,
    updateLoggedUserValidator,
    services.updateLoggedUser
  );
router
  .route("/changeMyPassword")
  .put(authServices.protect, services.updateLoggedUserPassword);
router
  .route("/me")
  .delete(authServices.protect, services.deleteLoggedUser);
 router.use(authServices.protect, authServices.allowedTo("admin"));

router
  .route("/changePassword/:id")
  .put(
    authServices.protect,
    changeUserPasswordValidation,
    services.changeUserPassword
  );

router
  .route("/")
  .get(services.getUsers)
  .post(
    services.uploadUserImage,
    services.resizeImage,
    createUserValidator,
    services.createUser
  );
router
  .route("/:id")
  .get(getUserValidator, services.getUser)
  .put(
    services.uploadUserImage,
    services.resizeImage,
    updateUserValidator,
    services.updateUser
  )
  .delete(deleteUserValidator, services.deleteUser);
module.exports = router;
