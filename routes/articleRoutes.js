const BaseRoutes = require("../packages/BaseRoute");
const router = require("express").Router();
const articleController = require("../controllers/articleController");

class ArticleRoute extends BaseRoutes {
  constructor(router, controller) {
    super(router, controller);
  }
}

new ArticleRoute(router, articleController);

module.exports = router;
