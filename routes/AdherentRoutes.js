const router = require("express").Router();
const db = require("../configs/db");
const adherentController = require("../controllers/adherentController");
const { uploadImage } = require("../middlewares/uploadImage");

const BaseRoute = require("../packages/BaseRoute");
const adherentModel = db.adherents;
const PaiementModel = db.paiements;
const PublicationModel = db.publications;
const createToken = require("../utils/createToken");
const bcrypt = require("bcrypt");
const maxAge = 3 * 24 * 60 * 60 * 1000;

class AdherentRoute extends BaseRoute {
  includes = [{ model: db.paiements }];
  constructor(route, controller) {
    route.post("/login", async (req, res) => {
      const { email, password } = req.body;
      const user = await adherentModel.findOne({ where: { email: email } });
      if (!user) {
        res.status(401).send({ status: "error", message: "User not found" });
      } else {
        const auth = await bcrypt.compare(password, user.password);
        if (auth) {
          const token = createToken(user.id);
          res.cookie("jwt", token, { httpOnly: true, maxAge });
          const newUser = { user, token };
          return res.status(200).send({ status: "success ", data: newUser });
        }
        res.status(401).send({ status: "error", message: "Password is wrong" });
      }
    });

    route.post("/register", async (req, res) => {
      try {
        const uniqueString = (+new Date()).toString(36).slice(-5);
        req.body.identifiant = uniqueString;
        req.body.provider = "credential";
        req.body.image =
          "https://github.com/ibou18/logo/blob/main/Picto%20profils/profil2.png?raw=true/";

        const data = await adherentModel.create(req.body);
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
    });

    route.patch("/:id", uploadImage.single("file"), async (req, res) => {
      const form = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        adresse: req.body.adresse,
        Birth_date: req.body.birth_date,
        birthday_location: req.body.birthday_location,
        email: req.body.email,
        phone: req.body.phone,
        indicatif: req.body.indicatif,
        profession: req.body.profession,
        citizen: req.body.citizen,
        province: req.body.province,
        country: req.body.country,
        city: !!req.body.city ? req.body.city : req.body.prefecture,
        postal_code: req.body.postal_code,
        civil_status: req.body.civil_status,
        gradutation: req.body.gradutation,
        politic_member: req.body.politic_member,
        is_previously_politic: req.body.is_previously_politic,
        motivations: req.body.motivations,
        ambitions: req.body.ambitions,
        is_sign_declaration: req.body.is_sign_declaration,
        identifiant: req.body.identifiant,
        isActive: req.body.isActive,
        password: req.body.password,
        commune: req.body.commune,
        prefecture: req.body.prefecture,
      };

      if (req.file?.location) {
        form.image = req.file.location;
      }

      if (form.password) {
        const salt = await bcrypt.genSalt();
        form.password = bcrypt.hashSync(form.password, salt);
      }
      const data = await adherentModel.update(form, {
        where: { id: req.params.id },
      });

      return res.status(200).send({
        status: "success",
        message: "🚀 Data Updated successfully",
        data: data,
      });
    });

    route.get("/get-detail-adherent/:adherentId", async (req, res) => {
      const adherentId = req.params.adherentId;

      try {
        const adherent = await adherentModel.findOne({
          where: { id: adherentId },
        });

        const paiement = await PaiementModel.findAll({
          where: { adherentId: adherentId },
          // include: [{ model: db.adherents }],
        });

        const totalPaiement = PaiementModel.count({
          where: { id: adherentId },
        });
        const data = { adherent, paiement, totalPaiement };
        res.status(200).send({ data: data });
      } catch (error) {
        console.log("error", error);
        res.status(400).send({ error });
      }
    });

    route.post("/get-or-create-users", async (req, res) => {
      console.log("******req.body ******", req.body);
      try {
        console.log("Client I", req.body);
        const client = await adherentModel.findOne({
          where: { email: req.body.email },
        });
        console.log("first", req.body);
        if (client === null) {
          console.log("CLient === NUL");
          const uniqueString = (+new Date()).toString(36).slice(-5);
          req.body.identifiant = uniqueString;
          let index = req.body.name.lastIndexOf(" ");
          let chaine_a = req.body.name.substring(0, index);
          let chaine_b = req.body.name.substring(index + 1);
          req.body.firstName = chaine_a;
          req.body.lastName = chaine_b;

          req.body.password = "12345";
          const data = await adherentModel.create(req.body);
          const token = createToken(data.id);
          res.cookie("jwt", token, { httpOnly: true, maxAge });
          let user = data;
          const newAdherent = { user, token };
          console.log("newAdherent Dans le IF", newAdherent);
          return res.status(200).send({
            status: "success",
            message: "data created successful",
            data: newAdherent,
          });
        } else {
          console.log("Jai le client===", client);
          const token = createToken(client.id);
          res.cookie("jwt", token, { httpOnly: true, maxAge });
          let user = client;
          const newAdherent = { user, token };

          console.log("newAdherent Dans le ELSE", newAdherent);
          return res.status(200).send({
            status: "success",
            message: "data created successful",
            data: newUser,
          });
        }
      } catch (error) {
        console.log("error", error);
        return res.status(400).send({
          status: "error",
          message: `Erreur un problème est survenu lors de l'opération`,
          data: error,
        });
      }
    });

    super(route, controller);
  }
}

new AdherentRoute(router, adherentController);

module.exports = router;
