const db = require("../configs/db");
const BaseController = require("../packages/BaseController");

class StatsController extends BaseController {
  includes = [{ model: db.clients }, { model: db.publications }];
  constructor(model) {
    super(model);
  }
}

const Stats = new StatsController(db.planTarifaires);

module.exports = Stats;
