const db = require("../configs/db");
const BaseController = require("../packages/BaseController");

class PaiementController extends BaseController {
  includes = [{ model: db.clients }, { model: db.publications }];
  constructor(model) {
    super(model);
  }
}

const Paiement = new PaiementController(db.paiements);

module.exports = Paiement;
