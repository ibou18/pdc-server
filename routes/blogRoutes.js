const router = require("express").Router();
const blogController = require("../controllers/BlogController");
const BaseRoute = require("../packages/BaseRoute.js");
const db = require("../configs/db.js");
const { uploadImage, uploadReport } = require("../middlewares/uploadImage");
const blogModel = db.blogs;

class BlogRoute extends BaseRoute {
  includes = [{ model: db.adherents }];
  constructor(route, controller) {
    route.get("/", async (req, res) => {
      try {
        const data = await blogModel.findAll({
          include: [
            {
              model: db.adherents,
              attributes: ["id", "firstName", "lastName", "image"],
            },
          ],
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
    route.get("/:id", async (req, res) => {
      try {
        const data = await blogModel.findOne({
          where: { id: req.params.id },
          include: [
            {
              model: db.adherents,
              attributes: ["id", "firstName", "lastName", "image"],
            },
          ],
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
      const { adherentId, title, description, status } = req.body;

      const form = {
        adherentId,
        title,
        description,
        status,
      };
      console.log("form", form);
      console.log("req.file.location", req.file.location);

      try {
        if (req.file?.location) {
          form.image = req.file.location;
        }

        if (form.adherentId) {
          form.adherentId = Number(form.adherentId);
        }

        const data = await blogModel.create(form);

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

new BlogRoute(router, blogController);

module.exports = router;
