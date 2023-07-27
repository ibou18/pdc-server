const BaseRoutes = require("../packages/BaseRoute");
const router = require("express").Router();
const commentController = require("../controllers/commentController");

class CommentRoute extends BaseRoutes {
  constructor(router, controller) {
    super(router, controller);
  }
}

new CommentRoute(router, commentController);

module.exports = router;
