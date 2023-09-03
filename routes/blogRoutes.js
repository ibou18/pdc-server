const router = require("express").Router();
const blogController = require("../controllers/BlogController");
const BaseRoute = require("../packages/BaseRoute.js");
const db = require("../configs/db.js");
const {
  uploadImage,
  uploadReport,
  deleteFileFromBucket,
} = require("../middlewares/uploadImage");
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

    route.delete("/:id", async (req, res) => {
      try {
        const info = await blogModel.findOne({
          where: { id: req.params.id },
          include: [
            {
              model: db.adherents,
              attributes: ["id", "firstName", "lastName", "image"],
            },
          ],
        });

        console.log("info", info);
        let linkImage = info.image;

        // Delete file in the bucket
        function separerLien(url) {
          const lastSlashIndex = url.lastIndexOf("/");
          if (lastSlashIndex !== -1) {
            // data.folder = url.substring(0, lastSlashIndex); // https://pdc-laguidev.s3.ca-central-1.amazonaws.com/docs
            // data.file = url.substring(lastSlashIndex + 1); // 1693283602384LOGO%20SEUL.jpg
            let data = {
              folder: url.substring(0, lastSlashIndex),
              file: url.substring(lastSlashIndex + 1),
            };
            console.log("Partie 1:", data.folder);
            console.log("Partie 2:", data.file);

            return data;
          } else {
            console.log("Le lien ne correspond pas au format attendu.");
          }
        }

        console.log("linkImage", linkImage);
        const resultLink = separerLien(linkImage);

        if (resultLink) {
          deleteFileFromBucket(resultLink.file, resultLink.folder);
          ("Fichier supprimé ");
        }

        // https://pdc-laguidev.s3.ca-central-1.amazonaws.com/docs/1693283602384LOGO%20SEUL.jpg
        const data = await blogModel.destroy({
          where: { id: req.params.id },
        });

        // console.log("data", data);

        return res.status(200).send({
          status: "success",
          message: "data deleted successful and file deleted successfully",
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
