class BaseRoutes {
  constructor(router, controller, middleware) {
    router.get("/:id", async (req, res) => {
      try {
        const data = await controller.findOne(req.params.id);
        if (data) {
          return res.status(200).send({
            status: "success",
            message: "data fetched successful",
            data: data,
          });
        } else {
          return res.status(400).send({
            status: "error",
            message: `Erreur un problème est survenu lors de l'opération`,
            data: error,
          });
        }
      } catch (error) {
        return res.status(400).send({
          status: "error",
          message: error,
          data: error,
        });
      }
    });

    router.get("/", async (req, res) => {
      try {
        const data = await controller.findAll();
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

    router.post("/", async (req, res) => {
      try {
        const data = await controller.createOne(req.body);
        return res.status(200).send({
          status: "success",
          message: "data created successful",
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

    router.patch("/:id", async (req, res) => {
      try {
        const data = await controller.updateOne(req.params.id, req.body);
        return res.status(200).send({
          status: "success",
          message: "data updated successfully",
          data: data,
        });
      } catch (error) {
        console.log("error :>> ", error);
        return res.status(400).send({
          status: "error",
          message: `Erreur un problème est survenu lors de l'opération`,
          data: error,
        });
      }
    });

    router.delete("/:id", async (req, res) => {
      try {
        const data = await controller.deleteOne(req.params.id);
        return res.status(200).send({
          status: "success",
          message: "data deleted successfully",
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
  }
}

module.exports = BaseRoutes;
