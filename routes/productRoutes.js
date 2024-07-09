const express = require("express");
const services = require("../services/productServices");
// eslint-disable-next-line import/no-useless-path-segments
const reviewsRoute = require('../routes/reviewRoute');
const {
  getProductValidator,
  createProductValidator,
  updateProductValidator,
  deleteProductValidator,
} = require("../utils/validators/productValidator");
const authServices = require("../services/authServices");


const router = express.Router();
router.use("/:productId/reviews", reviewsRoute);
router
  .route("/")
  .get(services.getProducts)
  .post(
    authServices.protect,
    authServices.allowedTo("admin", "manager"),
    services.uploadProductImage,
    services.resizeImage,
    createProductValidator,
    services.createProduct
  );
router
  .route("/:id")
  .get(getProductValidator, services.getProduct)
  .put(
    authServices.protect,
    authServices.allowedTo("admin", "manager"),
    services.uploadProductImage,
    services.resizeImage,
    updateProductValidator,
    services.updateProduct
  )
  .delete(
    authServices.protect,
    authServices.allowedTo("admin", "manager"),
    deleteProductValidator,
    services.deleteProduct
  );
module.exports = router;
