const db = require("../configs/db");
const AdminModel = db.admin;
module.exports.requireAuth = async (req, res, next) => {
  const token = req.cookies.jwt;
  console.log("token", !token);

  if (token) {
    return res
      .status(401)
      .json({ status: "error", message: "No token provided !" });
  } else {
    try {
      const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
      const admin = await AdminModel.findOne({
        where: { id: decodedToken.id },
      });

      if (!user) {
        throw new Error("User not found");
      }

      req.user = user.dataValues;
      req.token = token;
      console.log("USER", admin);

      // if (user.typeOfUser === "tattoo") {
      //   const tattooShop = await TattooShop.findOne({
      //     where: { userId: user.id },
      //   });
      //   req.userTattooShopId = tattooShop.id;
      //   req.TattooShop = tattooShop;
      // }
      next();
    } catch (err) {
      res
        .status(401)
        .json({ statut: "error", message: "Please authenticate!" });
    }
  }
};
