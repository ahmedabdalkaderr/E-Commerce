const express = require("express");
const services = require("../services/brandServices");
const authServices = require("../services/authServices");

const {
  getBrandValidator,
  createBrandValidator,
  updateBrandValidator,
  deleteBrandValidator,
} = require("../utils/validators/brandValidator");

const router = express.Router();
// router.use("/:categoryId/subbrands", subCategoryRoute);

router
  .route("/")
  .get(services.getBrands)
  .post(
    authServices.protect,
    authServices.allowedTo("admin", "manager"),
    services.uploadBrandImage,
    services.resizeImage,
    createBrandValidator,
    services.createBrand
  );
router
  .route("/:id")
  .get(getBrandValidator, services.getBrand)
  .put(
    authServices.protect,
    authServices.allowedTo("admin", "manager"),
    services.uploadBrandImage,
    services.resizeImage,
    updateBrandValidator,
    services.updateBrand
  )
  .delete(
    authServices.protect,
    authServices.allowedTo("admin", "manager"),
    deleteBrandValidator,
    services.deleteBrand
  );
module.exports = router;
