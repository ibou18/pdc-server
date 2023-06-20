const router = require("express").Router();
const db = require("../configs/db");
const clientController = require("../controllers/clientController");
const clientModel = require("../models/clientModel");
const publicationModel = require("../models/publicationModel");
const BaseRoute = require("../packages/BaseRoute");
const ClientModel = db.clients;
const PaiementModel = db.paiements;
const PublicationModel = db.publications;
const createToken = require("../utils/createToken");
const bcrypt = require("bcrypt");
const maxAge = 3 * 24 * 60 * 60 * 1000;

class ClientRoute extends BaseRoute {
  includes = [{ model: db.paiements }];
  constructor(route, controller) {
    route.post("/login", async (req, res) => {
      const { email, password } = req.body;
      const user = await ClientModel.findOne({ where: { email: email } });
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
      const images = [
        {
          id: 1,
          link: "https://github.com/ibou18/logo/blob/main/Picto%20profils/profil2.png?raw=true",
        },
        {
          id: 2,
          link: "https://github.com/ibou18/logo/blob/main/Picto%20profils/profil1.png?raw=true",
        },
      ];

      try {
        const uniqueString = (+new Date()).toString(36).slice(-5);
        req.body.identifiant = uniqueString;
        req.body.provider = "credential";
        req.body.image =
          "https://github.com/ibou18/logo/blob/main/Picto%20profils/profil2.png?raw=true/";

        const data = await ClientModel.create(req.body);
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
        const client = await ClientModel.findOne({ where: { id: clientId } });
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
        const client = await ClientModel.findOne({
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
          var data = await ClientModel.create(req.body);
          const token = createToken(data.id);
          res.cookie("jwt", token, { httpOnly: true, maxAge });
          let user = data;
          const newUser = { user, token };
          console.log("newUser Dans le IF", newUser);
          return res.status(200).send({
            status: "success",
            message: "data created successful",
            data: newUser,
          });
        } else {
          console.log("Jai le client===", client);
          const token = createToken(client.id);
          res.cookie("jwt", token, { httpOnly: true, maxAge });
          let user = client;
          const newUser = { user, token };

          console.log("newUser Dans le ELSE", newUser);
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

new ClientRoute(router, clientController);

module.exports = router;
