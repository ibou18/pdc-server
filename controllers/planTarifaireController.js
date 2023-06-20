const db = require("../configs/db");
const BaseController = require("../packages/BaseController");

class PlanTarifaireController extends BaseController {
  constructor(model) {
    super(model);
  }
}

const PlanTarifaire = new PlanTarifaireController(db.planTarifaires);

module.exports = PlanTarifaire;
