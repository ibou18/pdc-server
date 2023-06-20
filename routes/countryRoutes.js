const router = require("express").Router();
const countryController = require("../controllers/countryController");
const BaseRoute = require("../packages/BaseRoute");

class CountryRoute extends BaseRoute {
  constructor(router, controller) {
    super(router, controller);
  }
}

new CountryRoute(router, countryController);

module.exports = router;
