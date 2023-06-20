const aws = require("aws-sdk");
const multer = require("multer");
// cmulter = require("multer")),
const multerS3 = require("multer-s3");
aws.config.update({
  secretAccessKey: "baf4FpQmpSRlBF+SoOSYxV8H7Bnha+9TwScxvgXO",
  accessKeyId: "AKIAXVQOLFHPEAFCZEZ2",
  region: "us-east-1",
});

s3 = new aws.S3();

module.exports.uploadImage = multer({
  storage: multerS3({
    s3: s3,
    bucket: "lagui-photo/CoverImage",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      cb(null, Date.now() + file.originalname);
    },
  }),
});
