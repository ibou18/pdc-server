const db = require("../configs/db");
const BaseController = require("../packages/BaseController");

class PublicationController extends BaseController {
  includes = [
    { model: db.admin },
    { model: db.types, through: { attributes: [] }, as: "types" },
  ];

  constructor(model) {
    super(model);
  }
}

const Publication = new PublicationController(db.publications);

module.exports = Publication;
