const BaseRoute = require("../packages/BaseRoute");
const router = require("express").Router();
const paiementController = require("../controllers/paiementController");
const db = require("../configs/db");
const PaiementModel = db.paiements;
const PublicationModel = db.publications;
const adminModel = db.admin;

const generateStatsPaiement = require("../utils/statsPaiement");
const moment = require("moment");

class PaiementRoute extends BaseRoute {
  constructor(route, controller) {
    route.post("/check-payment", async (req, res) => {
      const data = await PaiementModel.findOne({
        where: {
          publicationId: req.body.publicationId,
          clientId: req.body.clientId,
          status: true,
        },
        order: [["start_date", "DESC"]],
      });

      const publications = await PublicationModel.findOne({
        where: { id: req.body.publicationId },
      });

      if (data) {
        var start_date = data.start_date;
        start_date.setDate(start_date.getDate() + data.day_active);
        const today = new Date();

        if (start_date >= today) {
          return res.status(200).send({
            status: "success",
            message: "Accès autoriser",
            data: { access: true },
          });
        } else {
          return res.status(200).send({
            status: "error",
            message: "Votre accès a expirer ",
            data: { access: false },
          });
        }
      } else if (publications.isFree === "gratuit") {
        return res.status(200).send({
          status: "success",
          message: "Accès autoriser",
          data: { access: true },
        });
      } else {
        return res.status(200).send({
          status: "error",
          message: "Vous n'avez pas accès",
          data: { access: false },
        });
      }
    });

    route.get("/stats/:partenaireId", async (req, res) => {
      const paramsAdmin = req.params.partenaireId;
      // console.log("paramsAdmin", paramsAdmin);

      const currentAdmin = await adminModel.findOne({
        where: { id: paramsAdmin },
      });

      // console.log("___****currentAdmin***___", currentAdmin.roles);
      if (currentAdmin.roles === "admin") {
        try {
          const euroData = await PaiementModel.findAll({
            where: { devise: "EUR" },
            order: [["start_date", "ASC"]],
          });

          const CfaData = await PaiementModel.findAll({
            where: { devise: "CFA" },
            order: [["start_date", "ASC"]],
          });

          const gnfData = await PaiementModel.findAll({
            where: { devise: "GNF" },
            order: [["start_date", "ASC"]],
          });

          const countPaiementEuro = await PaiementModel.count({
            where: { devise: "EUR" },
            order: [["start_date", "ASC"]],
          });
          const countPaiementCfa = await PaiementModel.count({
            where: { devise: "CFA" },
            order: [["start_date", "ASC"]],
          });
          const countPaiementGnf = await PaiementModel.count({
            where: { devise: "GNF" },
            order: [["start_date", "ASC"]],
          });

          // const labels = moment(element.createdAt).format("MMMM YYYY");

          if (euroData || CfaData || gnfData) {
            const resultEuro = await generateStatsPaiement(euroData);
            const resultCfa = await generateStatsPaiement(CfaData);
            const resultGnf = await generateStatsPaiement(gnfData);
            res.status(200).send({
              euro: resultEuro,
              cfa: resultCfa,
              gnf: resultGnf,
              totalEuro: countPaiementEuro,
              totalCfa: countPaiementCfa,
              totalGnf: countPaiementGnf,
            });

            console.log("##_____resultEuro_____##", resultEuro);
            console.log("##_____resultCfa_____##", resultCfa);
            console.log("##_____resultGnf_____##", resultGnf);
          }
        } catch (error) {
          console.log("error :>> ", error);
          return res.status(400).send({ error });
        }
      } else {
        try {
          const euroData = await PaiementModel.findAll({
            where: { devise: "EUR", adminId: paramsAdmin },
            order: [["start_date", "ASC"]],
          });

          const CfaData = await PaiementModel.findAll({
            where: { devise: "CFA", adminId: paramsAdmin },
            order: [["start_date", "ASC"]],
          });

          const gnfData = await PaiementModel.findAll({
            where: { devise: "GNF", adminId: paramsAdmin },
            order: [["start_date", "ASC"]],
          });

          const countPaiementEuro = await PaiementModel.count({
            where: { devise: "EUR", adminId: paramsAdmin },
            order: [["start_date", "ASC"]],
          });
          const countPaiementCfa = await PaiementModel.count({
            where: { devise: "CFA", adminId: paramsAdmin },
            order: [["start_date", "ASC"]],
          });
          const countPaiementGnf = await PaiementModel.count({
            where: { devise: "GNF", adminId: paramsAdmin },
            order: [["start_date", "ASC"]],
          });

          console.log("CfaData_______>>>", CfaData);
          // const labels = moment(element.createdAt).format("MMMM YYYY");

          if (euroData || CfaData || gnfData) {
            const resultEuro = await generateStatsPaiement(euroData);
            const resultCfa = await generateStatsPaiement(CfaData);
            const resultGnf = await generateStatsPaiement(gnfData);
            res.status(200).send({
              euro: resultEuro,
              cfa: resultCfa,
              gnf: resultGnf,
              totalEuro: countPaiementEuro,
              totalCfa: countPaiementCfa,
              totalGnf: countPaiementGnf,
            });

            console.log("##_____resultEuro_____##", resultEuro);
            console.log("##_____resultCfa_____##", resultCfa);
            console.log("##_____resultGnf_____##", resultGnf);
          }
        } catch (error) {
          console.log("error :>> ", error);
          return res.status(400).send({ error });
        }
      }
    });

    // 🔥 THIS QUERY SHOULD SEND ONLY THE STATS BY USER
    route.get("/stats-query", async (req, res) => {
      const { currency, idAdmin } = req.query;
      const user = await adminModel.findOne({ where: { id: idAdmin } });

      try {
        const statPaiementbyAdmin = await PaiementModel.count({
          where: { devise: "GNF" },
        });
      } catch (error) {
        console.log("error :>> ", error);
      }
    });

    route.get("/pay-client/:clientId", async (req, res) => {
      const paramsClient = req.params.clientId;
      try {
        const data = await PaiementModel.findAll({
          where: { clientId: paramsClient },
          order: [["createdAt", "DESC"]],
        });

        res.status(200).send({ data, count: data.length });
      } catch (error) {
        res.status(400).send({
          message: `Erreur requetes pay-client/${paramsClient}`,
          data: error,
        });
      }
    });

    route.get("/paiement-admins/:id", async (req, res) => {
      try {
        const admin = await adminModel.findOne({
          where: { id: req.params.id },
        });

        if (admin.roles === "producteur") {
          const data = await PaiementModel.findAll({
            include: {
              model: db.publications,
              where: { adminId: req.params.id },
            },
          });

          return res.status(200).send({
            status: "success",
            message: "data fetched successful",
            data: data,
          });
        } else {
          const data = await PaiementModel.findAll({
            where: { partenaire_id: req.params.id },
            include: {
              model: db.clients,
            },
          });

          return res.status(200).send({
            status: "success",
            message: "data fetched successful",
            data: data,
          });
        }
      } catch (error) {
        res.status(400).send({
          message: `Erreur requetes `,
          data: error,
        });
      }
    });

    super(route, controller);
  }
}

new PaiementRoute(router, paiementController);

module.exports = router;
