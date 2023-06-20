const db = require("../configs/db");
const BaseController = require("../packages/BaseController");

class EpisodeController extends BaseController {
  constructor(model) {
    super(model);
  }
}

const Episode = new EpisodeController(db.episodes);

module.exports = Episode;
