const db = require("../configs/db");
const BaseController = require("../packages/BaseController");

class TypeController extends BaseController {
  constructor(model) {
    super(model);
  }
}

const type = new TypeController(db.types);

module.exports = type;
