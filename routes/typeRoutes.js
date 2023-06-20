const router = require("express").Router();
const BaseRoutes = require("../packages/BaseRoute");
const typeController = require("../controllers/typeController");
class TypeRoute extends BaseRoutes {
  constructor(router, controller) {
    super(router, controller);
  }
}
new TypeRoute(router, typeController);

module.exports = router;
