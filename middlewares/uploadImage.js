const aws = require("aws-sdk");
const multer = require("multer");
// cmulter = require("multer")),
const multerS3 = require("multer-s3");

aws.config.update({
  secretAccessKey: process.env.AWS_ACCESS_SECRET_KEY,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
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

module.exports.uploadReport = multer({
  storage: multerS3({
    s3: s3,
    bucket: "pdc-laguidev/docs",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      cb(null, Date.now() + file.originalname);
    },
  }),
});

function separerLien(lien) {
  const pattern = /(https:\/\/.*?)\/(.*)/;
  const resultats = lien.match(pattern);

  if (resultats) {
    const partie1 = resultats[1];
    const partie2 = "/" + resultats[2];
    return [partie1, partie2];
  } else {
    return null;
  }
}

// Supprimer un fichier du bucket
module.exports.deleteFileFromBucket = (fileName, folder) => {
  const params = {
    // Bucket: "pdc-laguidev/docs",
    Bucket: "folder",
    Key: fileName, // Remplacez par le nom du fichier à supprimer
  };

  s3.deleteObject(params, (err, data) => {
    if (err) {
      console.error("Error:", err);
    } else {
      console.log("File deleted successfully:", data);
    }
  });
};
