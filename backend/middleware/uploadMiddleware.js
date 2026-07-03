const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/");
  },

  filename(req, file, cb) {
    cb(
      null,
      `${Date.now()}${path.extname(
        file.originalname
      )}`
    );
  },
});

const checkFileType = (
  file,
  cb
) => {
  const fileTypes =
    /jpg|jpeg|png|webp/;

  const extName =
    fileTypes.test(
      path.extname(
        file.originalname
      ).toLowerCase()
    );

  const mimeType =
    fileTypes.test(file.mimetype);

  if (extName && mimeType) {
    return cb(null, true);
  } else {
    cb(
      "Images only!"
    );
  }
};

const upload = multer({
  storage,
  fileFilter(req, file, cb) {
    checkFileType(file, cb);
  },
});

module.exports = upload;