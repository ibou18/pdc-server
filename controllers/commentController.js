const db = require("../configs/db");
const BaseController = require("../packages/BaseController");

class commentController extends BaseController {
  model;
  includes = [];
  constructor(model) {
    super(model);
    this.model = model;
  }
}

const Comment = new commentController(db.comments);

module.exports = Comment;
