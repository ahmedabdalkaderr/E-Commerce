const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const asyncHandler = require("express-async-handler");

const {uploadMixOfImages} = require('../middlewares/uploadImageMiddleware');
const factory = require("./handlersFactory");
const Product = require("../models/productModel");


exports.uploadProductImage = uploadMixOfImages([
  {
    name: "imageCover",
    maxCount: 1,
  },
  {
    name: "images",
    maxCount: 5,
  },
]);

exports.resizeImage = asyncHandler(async (req, res, next) => {
  if (req.files && req.files.imageCover) {
    const imageCoverFilename = `product-${uuidv4()}-${Date.now()}-cover.jpeg`;
    await sharp(req.files.imageCover[0].buffer)
      .resize(2000, 1333)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`uploads/products/${imageCoverFilename}`);
    req.body.imageCover = imageCoverFilename;
  }
  if (req.files && req.files.images) {
    req.body.images = [];
    await Promise.all(
      req.files.images.map(async (image, index) => {
        const imageFilename = `product-${uuidv4()}-${Date.now()}-${index + 1}.jpeg`;
        await sharp(image.buffer)
          .resize(2000, 1333)
          .toFormat("jpeg")
          .jpeg({ quality: 90 })
          .toFile(`uploads/products/${imageFilename}`);
        req.body.images.push(imageFilename);
      })
    );
  }
   next();
});
exports.getProducts = factory.getAll(Product, "Product");
exports.createProduct = factory.createOne(Product);
exports.getProduct = factory.getOne(Product,'reviews');
exports.updateProduct = factory.updateOne(Product);
exports.deleteProduct = factory.deleteOne(Product);
