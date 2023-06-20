const db = require("../configs/db");
const BaseController = require("../packages/BaseController");

class adherentController extends BaseController {
  model;
  includes = [];
  constructor(model) {
    super(model);
    this.model = model;
  }
}

const Adherent = new adherentController(db.adherents);

module.exports = Adherent;
