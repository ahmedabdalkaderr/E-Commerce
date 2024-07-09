const express = require("express");
const services = require("../services/categoryServices");
const subCategoryRoute = require("./subCategoryRoutes");
const {
  getCatgeoryValidator,
  createCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
} = require("../utils/validators/categoryValidator");
const authServices = require("../services/authServices");

const router = express.Router();
router.use("/:categoryId/subcategories", subCategoryRoute);

router
  .route("/")
  .get(services.getCategories)
  .post(
    authServices.protect,
    authServices.allowedTo("admin", "manager"),
    services.uploadCategoryImage,
    services.resizeImage,
    createCategoryValidator,
    services.createCateogry
  );
router
  .route("/:id")
  .get(getCatgeoryValidator, services.getCategory)
  .put(
    authServices.protect,
    authServices.allowedTo("admin", "manager"),
    services.uploadCategoryImage,
    services.resizeImage,
    updateCategoryValidator,
    services.updateCategory
  )
  .delete(
    authServices.protect,
    authServices.allowedTo("admin"),
    deleteCategoryValidator,
    services.deleteCategory
  );
module.exports = router;
