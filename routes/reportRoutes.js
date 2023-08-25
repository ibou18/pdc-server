const router = require("express").Router();
const reportController = require("../controllers/reportController.js");
const BaseRoute = require("../packages/BaseRoute");
const db = require("../configs/db");
const ReportModel = db.reports;

class ReportRoute extends BaseRoute {
  includes = [{ model: db.adherents }];
  constructor(route, controller) {
    route.get("/", async (req, res) => {
      try {
        const data = await ReportModel.findAll({
          include: [{ model: db.adherents }],
        });

        return res.status(200).send({
          status: "success",
          message: "data fetched successful",
          data: data,
        });
      } catch (error) {
        console.log("error :>> ", error);
        res.status(400).send({
          message: `Erreur requetes `,
          data: error,
        });
      }
    });

    super(route, controller);
  }
}

new ReportRoute(router, reportController);

module.exports = router;
