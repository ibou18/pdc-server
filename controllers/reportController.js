const db = require("../configs/db");
const BaseController = require("../packages/BaseController");

class ReportController extends BaseController {
  constructor(model) {
    super(model);
  }
}

const type = new ReportController(db.reports);

module.exports = type;
