const express = require("express");
const services = require("../services/subCategoryServices");
const {createFilterObject} = require("../services/subCategoryServices");
const {
  getSubCatgeoryValidator,
  checkCategoryId,
  createSubCategoryValidator,
  updateSubCategoryValidator,
  deleteSubCategoryValidator,
} = require("../utils/validators/subCategoryValidator");
const authServices = require("../services/authServices");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(createFilterObject, services.getSubCategories)
  .post(
    authServices.protect,
    authServices.allowedTo("admin", "manager"),
    checkCategoryId,
    createSubCategoryValidator,
    services.createSubCateogry
  );
router
  .route("/:id")
  .get(getSubCatgeoryValidator, services.getSubCategory)
  .put(
    authServices.protect,
    authServices.allowedTo("admin", "manager"),
    updateSubCategoryValidator,
    services.updateSubCategory
  )
  .delete(
    authServices.protect,
    authServices.allowedTo("admin", "manager"),
    deleteSubCategoryValidator,
    services.deleteSubCategory
  );
module.exports = router;
