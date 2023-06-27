const db = require("../configs/db");
const BaseController = require("../packages/BaseController");

class AdminController extends BaseController {
  model;
  includes = [];
  constructor(model) {
    super(model);
    this.model = model;
  }
}

const Admin = new AdminController(db.admin);

module.exports = Admin;
