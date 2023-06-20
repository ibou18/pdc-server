const router = require("express").Router();
const userController = require("../controllers/adminController");
const bcrypt = require("bcrypt");
const BaseRoute = require("../packages/BaseRoute");
const { route } = require("./publicationRoutes");
const db = require("../configs/db");
const AdminModel = db.admin;
const jwt = require("jsonwebtoken");
const createToken = (id) => {
  return jwt.sign({ id }, process.env.TOKEN_SECRET, {
    expiresIn: "24h",
  });
};
class AdminRoute extends BaseRoute {
  constructor(route, UserController) {
    route.post("/login", async (req, res) => {
      const { email, password } = req.body;
      try {
        const user = await AdminModel.findOne({ where: { email: email } });
        if (!user) {
          res.status(401).send({ status: "error", message: "User not found" });
        } else {
          const auth = await bcrypt.compare(password, user.password);
          if (auth) {
            const token = createToken(user.id);
            // res.cookie("jwt", token, { httpOnly: true, maxAge });
            user.tokens = token;
            const newUser = {
              user: user,
              token: token,
            };
            return res.status(200).send({ status: "success ", data: newUser });
          }
          return res
            .status(401)
            .send({ status: "error", message: "Password Error" });
        }
      } catch (error) {
        return res.status(400).send({
          status: "error",
          message: `Erreur un problème est survenu lors de l'opération`,
          data: error,
        });
      }
    });

    route.post("/create-admin", async (req, res) => {
      console.log("Error", req.body);
      try {
        let form = {
          email: req.body.email,
          display_name: req.body.display_name,
          telephone: req.body.telephone,
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          comment: req.body.comment,
          country: req.body.country,
          roles: req.body.roles,
          isActive: req.body.isActive,
          password: "Test1234",
        };

        const admin = await AdminModel.create(form);
        return res.status(200).send({ status: "success", user: admin });
      } catch (error) {
        console.log("Error ", error);
        return res.status(400).send({
          status: "error",
          message: `Erreur un problème est survenu lors de l'opération`,
          data: error,
        });
      }
    });

    super(route, UserController);
  }
}

new AdminRoute(router, userController);

module.exports = router;
