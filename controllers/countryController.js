const db = require("../configs/db");
const BaseController = require("../packages/BaseController");

class CountryController extends BaseController {
  constructor(model) {
    super(model);
  }
}

const Country = new CountryController(db.countries);

module.exports = Country;
