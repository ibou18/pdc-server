const router = require("express").Router();
const publicationController = require("../controllers/publicationController");
const BaseRoutes = require("../packages/BaseRoute");
const { uploadImage } = require("../middlewares/uploadImage");
const db = require("../configs/db");
const { requireAuth } = require("../middlewares/authMiddleware");
const publicationModel = db.publications;
const PlanTarifaire = db.planTarifaires;

class PublicationRoute extends BaseRoutes {
  includes = [{ model: db.admin }];
  constructor(route, controller) {
    route.post("/add-pub", uploadImage.single("file"), async (req, res) => {
      const form = {
        availability: req.body.availability,
        title: req.body.title,
        description: req.body.description,
        link: req.body.link,
        adminId: req.body.adminId,
      };
      try {
        if (req.file?.location) {
          form.image_banner = req.file.location;
        }

        const data = await publicationModel.create(form);
        console.log("data******", data);

        return res.status(200).send({
          status: "success",
          message: "data created successful",
          data: data,
        });
      } catch (error) {
        console.log("error", error);
      }
    });

    route.patch(
      "/update-pub/:id",
      uploadImage.single("file"),
      async (req, res) => {
        const form = {
          availability: req.body.availability,
          title: req.body.title,
          description: req.body.description,
          Link: req.body.link,
          adminId: req.body.adminId,
        };
        if (req.file?.location) {
          form.image_banner = req.file.location;
        }
        const data = await publicationModel.update(form, {
          where: { id: req.params.id },
        });
        if (req.body.types) {
          req.body.types.forEach((el) => {
            data.addType(el);
          });
        }
        return res.status(200).send({
          status: "success",
          message: "data created successful",
          data: data,
        });
      }
    );

    route.get("/stats-publications", async (req, res) => {
      try {
        const countAllPublications = await publicationModel.count();
        const countMovie = await publicationModel.findAll({
          where: {
            "$category.label$": "Film",
          },
        });

        console.log("countMovie :>> ", countMovie);
        console.log("countAllPublications :>> ", countAllPublications);
        if (countAllPublications)
          res.status(200).send({ count: countAllPublications });
      } catch (error) {
        console.log("error :>> ", error);
      }
    });

    // Need to be modified
    route.get("/publications-by-admins/:id", async (req, res) => {
      try {
        const data = await publicationModel.findAll({
          where: { adminId: req.params.id },
          include: [
            { model: db.categories },
            { model: db.episodes, order: ["order_number", "DESC"] },
            { model: db.planTarifaires },
            { model: db.types, through: { attributes: [] }, as: "types" },
          ],
          order: [[{ model: db.episodes }, "order_number", "ASC"]],
        });
        return res.status(200).send({
          status: "success",
          message: "data fetched successful",
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

    super(route, controller, requireAuth);
  }
}

new PublicationRoute(router, publicationController);

module.exports = router;
