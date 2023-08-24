const BaseRoute = require("../packages/BaseRoute");
const router = require("express").Router();
const paiementController = require("../controllers/paiementController");
const db = require("../configs/db");
const PaiementModel = db.paiements;
const PublicationModel = db.publications;
const adminModel = db.admin;

const generateStatsPaiement = require("../utils/statsPaiement");
const moment = require("moment");

class PaiementRoute extends BaseRoute {
  constructor(route, controller) {
    route.get("/", async (req, res) => {
      try {
        const data = await PaiementModel.findAll({
          include: [{ model: db.adherents }],
        });
        console.log("data :>> ", data);

        return res.status(200).send({
          status: "success",
          message: "data fetched successful",
          data: data,
        });
      } catch (error) {
        res.status(400).send({
          message: `Erreur requetes `,
          data: error,
        });
      }
    });

    super(route, controller);
  }
}

new PaiementRoute(router, paiementController);

module.exports = router;
