const express = require("express");
const services = require("../services/reviewServices");
const authServices = require("../services/authServices");
const {
  checkproductId,
  getReviewValidator,
  createReviewValidator,
  updateReviewValidator,
  deleteReviewValidator,
} = require("../utils/validators/reviewValidator");

const router = express.Router({ mergeParams: true });
router.use(authServices.protect);
router
  .route("/")
  .get(services.createFilterObject, services.getReviews)
  .post(
    checkproductId,
    createReviewValidator,
    services.createReview
  );
router
  .route("/:id")
  .get(
    authServices.allowedTo("admin", "manager"),
    getReviewValidator,
    services.getReview
  )
  .put(
    authServices.allowedTo("user"),
    updateReviewValidator,
    services.updateReview
  )
  .delete(
    deleteReviewValidator,
    services.deleteReview
  );
module.exports = router;
