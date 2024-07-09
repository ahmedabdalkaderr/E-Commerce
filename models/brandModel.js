const mongoose = require("mongoose");

const BrandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "brand must have a name"],
      unique: [true, "brand must be unique"],
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

const setImage = (doc) => {
  if (doc.image) {
    const imageUrl = `${process.env.BASE_URL}/brands/${doc.image}`;
    console.log(imageUrl);
    doc.image = imageUrl;
  }
};

BrandSchema.post("init", setImage);
BrandSchema.post("save", setImage);

module.exports = new mongoose.model("BrandModel", BrandSchema);
