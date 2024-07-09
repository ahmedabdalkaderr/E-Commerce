const mongoose = require("mongoose");

const subCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    unique: [true, "name of sub category muse be unique"],
    minlength: [3, "too short SubCategory name"],
    maxlength: [32, "too long SubCategory name"],
  },
  slug: {
    type: String,
    lowercase: true,
  },
  category: {
    type: mongoose.Schema.ObjectId,
    ref: "CategoryModel",
    required: [true, "SubCategory should be belong to a parent category"],
  },
}, {timestamps:true});

module.exports = mongoose.model("SubCategoryModel", subCategorySchema);
