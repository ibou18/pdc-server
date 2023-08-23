const BaseRoute = require("../packages/BaseRoute");
const router = require("express").Router();
const paiementController = require("../controllers/paiementController");
const db = require("../configs/db");
const PaiementModel = db.paiements;
const PublicationModel = db.publications;
const adminModel = db.admin;

const moment = require("moment");

class PaiementRoute extends BaseRoute {
  constructor(route, controller) {
    route.get("/", async (req, res) => {
      console.log("🚀 Supppperrr ");
      const payment = await PaiementModel.findAll();
      res.status(200).send({ data: payment });
    });
    super(route, controller);
  }
}

new PaiementRoute(router, paiementController);

module.exports = router;
