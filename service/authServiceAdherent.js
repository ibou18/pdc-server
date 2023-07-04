// const sendEmail = require("../utils/sendEmail");
const bcrypt = require("bcrypt");
const db = require("../configs/db");
const adherentModel = db.adherents;
const router = require("express").Router();
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");
const handlebars = require("handlebars");
const fs = require("fs");
const path = require("path");
const { uploadImage } = require("../middlewares/uploadImage");
const generateString = require("../utils/generateString");

const emailTemplate = fs.readFileSync(
  path.join(__dirname, "../utils/index.handlebars"),
  "utf-8"
);
const maxAge = 3 * 24 * 60 * 60 * 1000;

const createToken = (id) => {
  return jwt.sign({ id }, process.env.TOKEN_SECRET, {
    expiresIn: maxAge,
  });
};

router.post(
  "/register-adherent",
  uploadImage.single("file"),
  async (req, res) => {
    const {
      firstName,
      lastName,
      email,
      password,
      adresse,
      birth_date,
      birthday_location,
      phone,
      profession,
      citizen,
      province,
      civil_status,
      gradutation,
      politic_member,
      motivations,
      ambitions,
      is_sign_declaration,
      isActive,
      country,
      city,
      postal_code,
      is_previously_politic,
      indicatif,
      prefecture,
      commune,
    } = req.body;

    const unique =
      firstName.substring(0, 2).toLowerCase() +
      lastName.substring(0, 2).toLowerCase() +
      generateString(5).code;

    const form = {
      firstName,
      lastName,
      email,
      password,
      identifiant: unique,
      adresse,
      birth_date,
      birthday_location,
      phone,
      profession,
      citizen,
      province,
      civil_status,
      gradutation,
      politic_member,
      motivations,
      ambitions,
      is_sign_declaration,
      isActive: true,
      country,
      city,
      postal_code,
      is_previously_politic,
      indicatif,
      prefecture,
      commune,
    };

    console.log("req.file", req.file);
    try {
      if (req.file?.location) {
        form.image = req.file.location;
      }
      const data = await adherentModel.create(form);

      return res.status(200).send({
        status: "success",
        message: "data created successful",
        data: data,
      });
    } catch (error) {
      return res.status(400).send({
        status: "error",
        message: `Erreur un problème est survenu lors de l'opération`,
        data: error,
      });
    }
  }
);

router.post("/forgot-password", async (req, res, next) => {
  let user = await adherentModel.findOne({ where: { email: req.body.email } });
  console.log("user ----------------------", user.id);
  if (!user) {
    return res
      .status(400)
      .send({ status: "error", message: "Email non trouvable !" });
  }
  try {
    const resetToken = createToken(user.id);
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    const template = handlebars.compile(emailTemplate);

    const messageBody = template({
      resetUrl: resetUrl,
      name: user?.firstName,
    });
    try {
      sendEmail({
        to: req.body.email,
        subject: `🔐 ${user.firstName}-Réinitialisation de ton mot de passe`,
        // text: message,
        text: messageBody,
      });
      console.log("USer", user);
      adherentModel.update(
        {
          tokens: resetToken,
        },
        {
          where: { id: user.id },
        }
      );
      return res.status(200).send({
        status: "success",
        message:
          "Veuillez consulter vos mails pour réinitialiser votre mot de passe",
      });
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .send({ status: "error", message: "Erreur veuillez recommencer" });
    }
  } catch (err) {
    next(err);
  }
});

router.post("/reset-password/:token", async (req, res) => {
  var user = null;
  console.log("Params", req.params);
  try {
    jwt.verify(
      req.params.token,
      process.env.TOKEN_SECRET,
      async (err, decodedToken) => {
        if (err) {
          return res
            .status(400)
            .send({ status: "error", message: "Le token n'est pas valide" });
        } else {
          console.log("decodedToken", decodedToken);
          user = await adherentModel.findOne({
            where: { id: decodedToken.id },
            attributes: {
              exclude: ["password"],
            },
          });
          console.log("user :>> ", user);
          if (user === null) {
            return res.status(400).send({
              status: "error",
              message: "Le token n'est pas valide",
            });
          }
          if (user.tokens === req.params.token) {
            const salt = await bcrypt.genSalt();
            const newPassword = bcrypt.hashSync(req.body.password, salt);

            await adherentModel.update(
              {
                password: newPassword,
              },
              {
                where: { id: user.id },
              }
            );

            return res.status(200).send({
              status: "success",
              message: "Mot de passe modifié avec success",
            });
          } else {
            return res.status(400).send({
              status: "error",
              message: "Le token n'est pas valide 1",
            });
          }
        }
      }
    );
  } catch (error) {}
});

module.exports = router;
