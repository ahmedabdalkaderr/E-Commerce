const { check } = require("express-validator");
const slugify = require("slugify");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");

exports.checkCategoryId = (req, res, next) => {
  const { categoryId } = req.params;
  if (categoryId) req.body.category = categoryId;
  next();
};


exports.getSubCatgeoryValidator = [
  check("id").isMongoId().withMessage("Invalid subcategory ID"),
  validatorMiddleware,
];

exports.createSubCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("subcategory name is empty")
    .isLength({ min: 3 })
    .withMessage("too short subcategory name")
    .isLength({ max: 32 })
    .withMessage("too long subcategory name")
    .custom((val, { req }) => {
      req.body.slug = slugify(req.body.name);
      return true;
    }),
  check("category").isMongoId().withMessage("Invalid subcategory ID"),
  validatorMiddleware,
];

exports.updateSubCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid dd subcategory ID"),
  check("body").custom((val, { req }) => {
    req.body.slug = slugify(req.body.name);
    return true;
  }),
  validatorMiddleware,
];

exports.deleteSubCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid subcategory ID"),
  validatorMiddleware,
];
