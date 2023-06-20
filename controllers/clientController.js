const db = require("../configs/db");
const BaseController = require("../packages/BaseController");

class ClientController extends BaseController {
  model;
  includes = [];
  constructor(model) {
    super(model);
    this.model = model;
  }
}

const Client = new ClientController(db.clients);

module.exports = Client;
