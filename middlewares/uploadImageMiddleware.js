const multer = require("multer");
const APIError = require("../utils/apiError");

const multerOptions = () => {
  const multerStorage = multer.memoryStorage();
  const multerFilter = function (req, file, cb) {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new APIError("only images are allowed", 400));
    }
  };
  const upload = multer({ storage: multerStorage, fileFilter: multerFilter });
  return upload;
};

exports.uploadMixOfImages = (arrFields) => multerOptions().fields(arrFields);
exports.uploadSingleImage = (fieldName) => multerOptions().single(fieldName);
