const factory = require("./handlersFactory");
const Review = require("../models/reviewModel");

exports.createFilterObject = (req, res, next) => {
  const filterObj = {};
  if (req.params.productId) filterObj.product = req.params.productId;
  req.filterObj = filterObj;
  next();
};

exports.getReviews = factory.getAll(Review);
exports.createReview = factory.createOne(Review);
exports.getReview = factory.getOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);
