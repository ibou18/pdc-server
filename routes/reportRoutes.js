const router = require("express").Router();
const reportController = require("../controllers/reportController.js");
const BaseRoute = require("../packages/BaseRoute");
const db = require("../configs/db");
const { uploadImage, uploadReport } = require("../middlewares/uploadImage.js");
const ReportModel = db.reports;

class ReportRoute extends BaseRoute {
  includes = [{ model: db.adherents }];
  constructor(route, controller) {
    route.get("/", async (req, res) => {
      try {
        const data = await ReportModel.findAll({
          include: [{ model: db.adherents }],
          order: [["createdAt", "DESC"]],
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

    route.post("/create", uploadReport.single("file"), async (req, res) => {
      const {
        adherentId,
        objet,
        description,
        present,
        actions,
        status,
        title,
        nextDate,
      } = req.body;

      if (req.body.actions) {
        JSON.parse(req.body.actions);
      }

      const form = {
        adherentId,
        objet,
        description,
        present,
        actions,
        status,
        title,
        nextDate,
      };

      if (form.actions) {
        form.actions = JSON.parse(req.body.actions);
      }

      try {
        if (req.file?.location) {
          form.links = [{ title, link: req.file.location }];
        }

        if (form.adherentId) {
          form.adherentId = Number(form.adherentId);
        }

        const data = await ReportModel.create(form);

        return res.status(200).send({
          status: "success",
          message: "data created successful",
          total: data.length,
          data: data,
        });
      } catch (error) {
        return res.status(400).send({
          status: "error",
          message: `Erreur un problème est survenu lors de l'opération`,
          data: error,
        });
      }
    });

    super(route, controller);
  }
}

new ReportRoute(router, reportController);

module.exports = router;
