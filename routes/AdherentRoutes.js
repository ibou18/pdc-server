const router = require("express").Router();
const db = require("../configs/db");
const adherentController = require("../controllers/adherentController");

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

    route.get("/get-detail-client/:clientId", async (req, res) => {
      const clientId = req.params.clientId;

      try {
        const client = await adherentModel.findOne({ where: { id: clientId } });
        const paiement = await PaiementModel.findAll({
          where: { clientId: clientId },
          include: [{ model: db.publications }, { model: db.clients }],
        });
        const totalPaiement = PaiementModel.count({ where: { id: clientId } });
        const data = { client, paiement, total_paiement: totalPaiement };

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
