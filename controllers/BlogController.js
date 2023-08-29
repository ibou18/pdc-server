const db = require("../configs/db");
const BaseController = require("../packages/BaseController");

class BlogController extends BaseController {
  includes = [{ model: db.adherents }];
  constructor(model) {
    super(model);
  }
}

const blog = new BlogController(db.blogs);

module.exports = blog;
