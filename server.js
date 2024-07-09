const path = require("path");

const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
// eslint-disable-next-line import/no-extraneous-dependencies
const mongoSanitize = require("express-mongo-sanitize");

const categoryRoute = require("./routes/categoryRoutes");
const subCategoryRoute = require("./routes/subCategoryRoutes");
const brandRoute = require("./routes/brandRoutes");
const productRoute = require("./routes/productRoutes");
const reviewRoute = require("./routes/reviewRoute");
const userRoute = require("./routes/userRoutes");
const authRoute = require("./routes/authRoutes");
const wishlistRoute = require("./routes/wishlistRoutes");
const couponRoute = require("./routes/couponRoutes");
const cartRoute = require("./routes/cartRoutes");
const orderRoute = require("./routes/orderRoutes");

const dbConnection = require("./config/databaseConnection");
const APIError = require("./utils/apiError");
const global = require("./middlewares/middlewareErrors");

dotenv.config({ path: "config.env" });
const app = express();
dbConnection();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(mongoSanitize());
app.use(express.json());
app.use(express.static(path.join(__dirname, "uploads")));
// mount routes
app.use("/api/v1/categories", categoryRoute);
app.use("/api/v1/subcategories", subCategoryRoute);
app.use("/api/v1/brands", brandRoute);
app.use("/api/v1/products", productRoute);
app.use("/api/v1/reviews", reviewRoute);
app.use("/api/v1/wishlists", wishlistRoute);
app.use("/api/v1/coupons", couponRoute);
app.use("/api/v1/carts", cartRoute);
app.use("/api/v1/orders", orderRoute);

app.use("/api/v1/users", userRoute);
app.use("/api/v1/auth", authRoute);

app.all("*", (req, res, next) => {
  next(new APIError(`this url is not found ${req.url}`, 400));
});

app.use(global);

const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
  console.log(`app is running on port ${PORT}`);
});

/// handle errors which are outside express
process.on("unhandledRejection", (err) => {
  console.log(`unhandled rejection: ${err.name}, ${err.message}`);
  server.close(() => {
    process.exit(1);
  });
});
