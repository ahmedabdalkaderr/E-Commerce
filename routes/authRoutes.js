const express = require("express");
const services = require("../services/authServices");

const { signupValidator, loginValidator } = require("../utils/validators/authValidator");

const router = express.Router();

router.route("/signup").post(signupValidator, services.signup);
router.route('/login').post(loginValidator, services.login);
router.route('/forgetPassword').post(services.forgetPassword);
router.route("/verifyResetCode").post(services.verifyResetCode);
router.route("/resetCode").put(services.resetPassword);

module.exports = router;
