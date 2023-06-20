// const sendEmail = require("../utils/sendEmail");
const db = require("../configs/db");
const AdminModel = db.admin;
const adherentModel = db.adherents;
const router = require("express").Router();
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");
const handlebars = require("handlebars");
const fs = require("fs");
const path = require("path");

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

router.post("/forgot-password", async (req, res, next) => {
  let user = await adherentModel.findOne({ where: { email: req.body.email } });
  console.log("user ----------------------", user.id);
  if (!user) {
    return res
      .status(400)
      .send({ status: "error", message: "Email non trouvable !" });
  }

  const template = handlebars.compile(emailTemplate);

  try {
    const resetToken = createToken(user.id);
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    const messageBody = template({
      resetUrl: resetUrl,
      name: user?.firstName,
    });
    // const message = `
    //   <h1>Cliquez sur le lien pour modifier votre mot de passe </h1>
    //   <p> plus de description de la tâche </p>
    //   <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
    // `;
    try {
      sendEmail({
        to: req.body.email,
        subject: `🔐 ${user.firstName}-Réinitialisation de ton mot de passe`,
        // text: message,
        text: messageBody,
      });
      console.log("USer", user);
      AdminModel.update(
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
          user = await AdminModel.findOne({
            where: { id: decodedToken.id },
            attributes: {
              exclude: ["password"],
            },
          });

          if (user === null) {
            return res.status(400).send({
              status: "error",
              message: "Le token n'est pas valide",
            });
          }
          if (user.tokens === req.params.token) {
            await AdminModel.update(
              {
                password: req.body.password,
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
