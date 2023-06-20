const BaseRoutes = require("../packages/BaseRoute");
const router = require("express").Router();
const episodeController = require("../controllers/episodeController");

class EpisodeRoute extends BaseRoutes {
  constructor(router, controller) {
    super(router, controller);
  }
}

new EpisodeRoute(router, episodeController);

module.exports = router;
