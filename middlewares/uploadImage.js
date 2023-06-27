const aws = require("aws-sdk");
const multer = require("multer");
// cmulter = require("multer")),
const multerS3 = require("multer-s3");

aws.config.update({
  secretAccessKey: "fkIdt+/pKK2S4/nDLQZvoezOLLWldcKqEEcvJisL",
  accessKeyId: "AKIAR3UUUOMK3KG2JCBB",
  region: "ca-central-1",
});

s3 = new aws.S3();
module.exports.uploadImage = multer({
  storage: multerS3({
    s3: s3,
    bucket: "pdc-laguidev/profil",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      cb(null, Date.now() + file.originalname);
    },
  }),
});
