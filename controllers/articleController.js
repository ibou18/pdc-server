const db = require("../configs/db");
const BaseController = require("../packages/BaseController");

class ArticleController extends BaseController {
  includes = [{ model: db.comments }];
  constructor(model) {
    super(model);
    this.model = model;
  }
}

const Article = new ArticleController(db.article);

module.exports = Article;
