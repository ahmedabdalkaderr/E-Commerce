const mongoose = require("mongoose");

// create a schema
const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "category must have a name"],
      unique: [true, "category must be unique"],
      minlength: [3, "name is too short"],
      maxlength: [30, "name is too long"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    image: String,
  },
  { timestamps: true }
);
const setImage = (doc)=>{
  if (doc.image) {
    const imageUrl = `${process.env.BASE_URL}/categories/${doc.image}`;
    doc.image = imageUrl;
  }
}

CategorySchema.post(["save","init"],setImage);

// create a model
// eslint-disable-next-line new-cap
const Category = new mongoose.model("CategoryModel", CategorySchema);

module.exports = Category;
