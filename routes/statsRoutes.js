const BaseRoute = require("../packages/BaseRoute");
const router = require("express").Router();
const statsController = require("../controllers/statsController");
const db = require("../configs/db");
const { requireAuth } = require("../middlewares/authMiddleware");
const sequelize = require("sequelize");
const paiementModel = db.paiements;
const adminModel = db.admin;
const adherentModel = db.adherents;
const publicationModel = db.publications;

class StatsRoute extends BaseRoute {
  constructor(route, controller) {
    route.get("/dashbaord-header/:id", async (req, res) => {
      try {
        const admin = await adminModel.findOne({
          where: { id: req.params.id },
        });
        let allMovies = [];
        let allSeries = [];

        if (admin.roles === "admin" || admin.roles === "superviseur") {
          allMovies = await publicationModel.count({
            where: { categoryId: 1 }, // categoryId 1 == films
          });

          allSeries = await publicationModel.count({
            where: { categoryId: 2 }, // categoryId 2 == series
          });
        } else if (admin.roles === "producteur") {
          allMovies = await publicationModel.count({
            where: { categoryId: 1, adminId: req.params.id }, // categoryId 1 == films
          });
          allSeries = await publicationModel.count({
            where: { categoryId: 2, adminId: req.params.id }, // categoryId 2 == series
          });
        }

        // Requete qui permet de récuperer par Producteur tous les achats en fonction du film selectionné
        const clients = await db.sequelize.query(
          `select c."firstName" ,c."lastName" , p."start_date" ,p."amount_paid" , p."devise",p.reference  FROM clients c, paiements p , publications p2 where c.id = p."clientId" and p."publicationId" =p2.id and p2."adminId" = 6`,
          {
            type: db.sequelize.QueryTypes.SELECT,
          }
        );

        // Requete qui permet de récupérer la somme des paiements par YEARS MONTH pour un Admin Specifique "adminId" = 8" a changer
        const statsbyMonth = await db.sequelize.query(
          `select date_part('year', p."createdAt") AS annee,date_part('month', p."createdAt") AS mois, p.devise ,SUM(p.amount_paid) AS total 
          FROM clients c, paiements p , publications p2 
          where c.id = p."clientId" and 
           p."publicationId" =p2.id and 
           p2."adminId" = 8
           group by  date_part ('year', p."createdAt"),date_part ('month', p."createdAt"), p.devise ;`,
          {
            type: db.sequelize.QueryTypes.SELECT,
          }
        );
        console.log("statsbyMonth", statsbyMonth);
        // console.log("clientsTest", clients);

        let data = [];
        if (admin.roles === "admin" || admin.roles === "superviseur") {
          data = [
            {
              id: 1,
              name: "Clients",
              stat: clients.length,
              icon: "faUsersLine",
              url: "/admin/clients",
            },
            {
              id: 2,
              name: "Films",
              stat: allMovies,
              icon: "films",
              url: "/admin/contenus",
            },
            {
              id: 3,
              name: "Séries",
              stat: allSeries,
              icon: "series",
              url: "/admin/contenus",
            },
          ];
        } else if (admin.roles === "producteur") {
          data = [
            {
              id: 1,
              name: "Clients",
              stat: clients.length,
              icon: "faUsersLine",
              url: "/admin/clients",
            },
            {
              id: 2,
              name: "Films",
              stat: allMovies,
              icon: "films",
              url: "/admin/contenus",
            },
            {
              id: 3,
              name: "Séries",
              stat: allSeries,
              icon: "series",
              url: "/admin/contenus",
            },
          ];
        }
        res.status(200).send(data);
      } catch (error) {
        console.log("error", error);
        return res.status(400).send({ error });
      }
    });
    super(route, controller);
  }
}

new StatsRoute(router, statsController);

module.exports = router;
