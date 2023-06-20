const db = require("../configs/db");
const BaseController = require("../packages/BaseController");

class AdminController extends BaseController {
  constructor(AdminModel) {
    super(AdminModel);
  }
}

const Admin = new AdminController(db.admin);

module.exports = Admin;
