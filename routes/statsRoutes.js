const BaseRoute = require("../packages/BaseRoute");
const router = require("express").Router();
const statsController = require("../controllers/statsController");
const db = require("../configs/db");
const { requireAuth } = require("../middlewares/authMiddleware");
const sequelize = require("sequelize");
const adherentModel = db.adherents;
const prefectures = require("../shared/prefectures");

class StatsRoute extends BaseRoute {
  constructor(route, controller) {
    route.get("/get_members_by_city", async (req, res) => {
      const allDatas = [];
      try {
        const Boké = await adherentModel.findAll({
          where: { prefecture: "Boké" },
        });
        const BokéCount = await adherentModel.count({
          where: { prefecture: "Boké" },
        });

        const Boffa = await adherentModel.findAll({
          where: { prefecture: "Boffa" },
        });
        const BoffaCount = await adherentModel.count({
          where: { prefecture: "Boffa" },
        });

        const Conakry = await adherentModel.findAll({
          where: { prefecture: "Conakry" },
        });
        const ConakryCount = await adherentModel.count({
          where: { prefecture: "Conakry" },
        });

        const Coyah = await adherentModel.findAll({
          where: { prefecture: "Coyah" },
        });
        const CoyahCount = await adherentModel.count({
          where: { prefecture: "Coyah" },
        });

        const Dabola = await adherentModel.findAll({
          where: { prefecture: "Dabola" },
        });
        const DabolaCount = await adherentModel.count({
          where: { prefecture: "Dabola" },
        });

        const Dalaba = await adherentModel.findAll({
          where: { prefecture: "Dalaba" },
        });
        const DalabaCount = await adherentModel.count({
          where: { prefecture: "Dalaba" },
        });

        const Dinguiraye = await adherentModel.findAll({
          where: { prefecture: "Dinguiraye" },
        });
        const DinguirayeCount = await adherentModel.count({
          where: { prefecture: "Dinguiraye" },
        });

        const Dubréka = await adherentModel.findAll({
          where: { prefecture: "Dubréka" },
        });
        const DubrékaCount = await adherentModel.count({
          where: { prefecture: "Dubréka" },
        });

        const Faranah = await adherentModel.findAll({
          where: { prefecture: "Faranah" },
        });
        const FaranahCount = await adherentModel.count({
          where: { prefecture: "Faranah" },
        });

        const Forécariah = await adherentModel.findAll({
          where: { prefecture: "Forécariah" },
        });
        const ForécariahCount = await adherentModel.count({
          where: { prefecture: "Forécariah" },
        });

        const Fria = await adherentModel.findAll({
          where: { prefecture: "Fria" },
        });
        const FriaCount = await adherentModel.count({
          where: { prefecture: "Fria" },
        });

        const Gaoual = await adherentModel.findAll({
          where: { prefecture: "Gaoual" },
        });
        const GaoualCount = await adherentModel.count({
          where: { prefecture: "Gaoual" },
        });

        const Guékédou = await adherentModel.findAll({
          where: { prefecture: "Guékédou" },
        });
        const GuékédouCount = await adherentModel.count({
          where: { prefecture: "Guékédou" },
        });

        const Kamsar = await adherentModel.findAll({
          where: { prefecture: "Kamsar" },
        });
        const KamsarCount = await adherentModel.count({
          where: { prefecture: "Kamsar" },
        });

        const Kankan = await adherentModel.findAll({
          where: { prefecture: "Kankan" },
        });
        const KankanCount = await adherentModel.count({
          where: { prefecture: "Kankan" },
        });

        const Kérouané = await adherentModel.findAll({
          where: { prefecture: "Kérouané" },
        });
        const KérouanéCount = await adherentModel.count({
          where: { prefecture: "Kérouané" },
        });

        const Kindia = await adherentModel.findAll({
          where: { prefecture: "Kindia" },
        });
        const KindiaCount = await adherentModel.count({
          where: { prefecture: "Kindia" },
        });

        const Kissidougou = await adherentModel.findAll({
          where: { prefecture: "Kissidougou" },
        });
        const KissidougouCount = await adherentModel.count({
          where: { prefecture: "Kissidougou" },
        });

        const Koubia = await adherentModel.findAll({
          where: { prefecture: "Koubia" },
        });
        const KoubiaCount = await adherentModel.count({
          where: { prefecture: "Koubia" },
        });

        const Koundara = await adherentModel.findAll({
          where: { prefecture: "Koundara" },
        });
        const KoundaraCount = await adherentModel.count({
          where: { prefecture: "Koundara" },
        });

        const Kouroussa = await adherentModel.findAll({
          where: { prefecture: "Kouroussa" },
        });
        const KouroussaCount = await adherentModel.count({
          where: { prefecture: "Kouroussa" },
        });

        const Labé = await adherentModel.findAll({
          where: { prefecture: "Labé" },
        });
        const LabéCount = await adherentModel.count({
          where: { prefecture: "Labé" },
        });

        const Lélouma = await adherentModel.findAll({
          where: { prefecture: "Lélouma" },
        });
        const LéloumaCount = await adherentModel.count({
          where: { prefecture: "Lélouma" },
        });

        const Lola = await adherentModel.findAll({
          where: { prefecture: "Lola" },
        });
        const LolaCount = await adherentModel.count({
          where: { prefecture: "Lola" },
        });

        const Macenta = await adherentModel.findAll({
          where: { prefecture: "Macenta" },
        });
        const MacentaCount = await adherentModel.count({
          where: { prefecture: "Macenta" },
        });

        const Mali = await adherentModel.findAll({
          where: { prefecture: "Mali" },
        });
        const MaliCount = await adherentModel.count({
          where: { prefecture: "Mali" },
        });

        const Mamou = await adherentModel.findAll({
          where: { prefecture: "Mamou" },
        });
        const MamouCount = await adherentModel.count({
          where: { prefecture: "Mamou" },
        });

        const Mandiana = await adherentModel.findAll({
          where: { prefecture: "Mandiana" },
        });
        const MandianaCount = await adherentModel.count({
          where: { prefecture: "Mandiana" },
        });

        const Nzérékoré = await adherentModel.findAll({
          where: { prefecture: "Nzérékoré" },
        });
        const NzérékoréCount = await adherentModel.count({
          where: { prefecture: "Nzérékoré" },
        });

        const Pita = await adherentModel.findAll({
          where: { prefecture: "Pita" },
        });
        const PitaCount = await adherentModel.count({
          where: { prefecture: "Pita" },
        });

        const Siguiri = await adherentModel.findAll({
          where: { prefecture: "Siguiri" },
        });
        const SiguiriCount = await adherentModel.count({
          where: { prefecture: "Siguiri" },
        });

        const Télimélé = await adherentModel.findAll({
          where: { prefecture: "Télimélé" },
        });
        const TéliméléCount = await adherentModel.count({
          where: { prefecture: "Télimélé" },
        });

        const Tougué = await adherentModel.findAll({
          where: { prefecture: "Tougué" },
        });
        const TouguéCount = await adherentModel.count({
          where: { prefecture: "Tougué" },
        });

        const Yomou = await adherentModel.findAll({
          where: { prefecture: "Yomou" },
        });
        const YomouCount = await adherentModel.count({
          where: { prefecture: "Yomou" },
        });

        allDatas.push(
          {
            name: "Boké",
            count: BokéCount,
            // data: Boké,
          },
          {
            name: "Boffa",
            count: BoffaCount,
            // data: Boffa,
          },
          {
            name: "Conakry",
            count: ConakryCount,
            // data: Conakry,
          },
          {
            name: "Coyah",
            count: CoyahCount,
            // data: Coyah,
          },
          {
            name: "Dabola",
            count: DabolaCount,
            // data: Dabola,
          },
          {
            name: "Dalaba",
            count: DalabaCount,
            // data: Dalaba,
          },
          {
            name: "Dinguiraye",
            count: DinguirayeCount,
            // data: Dinguiraye,
          },
          {
            name: "Dubréka",
            count: DubrékaCount,
            // data: Dubréka,
          },
          {
            name: "Faranah",
            count: FaranahCount,
            // data: Faranah,
          },
          {
            name: "Forécariah",
            count: ForécariahCount,
            // data: Forécariah,
          },
          {
            name: "Fria",
            count: FriaCount,
            // data: Fria,
          },
          {
            name: "Fria",
            count: FriaCount,
            // data: Fria,
          },
          {
            name: "Gaoual",
            count: GaoualCount,
            // data: Gaoual,
          },
          {
            name: "Guékédou",
            count: GuékédouCount,
            // data: Guékédou,
          },
          {
            name: "Kamsar",
            count: KamsarCount,
            // data: Kamsar,
          },
          {
            name: "Kankan",
            count: KankanCount,
            // data: Kankan,
          },
          {
            name: "Kérouané",
            count: KérouanéCount,
            // data: Kérouané,
          },
          {
            name: "Kindia",
            count: KindiaCount,
            // data: Kindia,
          },
          {
            name: "Kissidougou",
            count: KissidougouCount,
            // data: Kissidougou,
          },
          {
            name: "Koubia",
            count: KoubiaCount,
            // data: Koubia,
          },
          {
            name: "Koundara",
            count: KoundaraCount,
            // data: Koundara,
          },
          {
            name: "Kouroussa",
            count: KouroussaCount,
            // data: Kouroussa,
          },
          {
            name: "Labé",
            count: LabéCount,
            // data: Labé,
          },
          {
            name: "Labé",
            count: LabéCount,
            // data: Labé,
          },
          {
            name: "Labé",
            count: LabéCount,
            // data: Labé,
          },
          {
            name: "Lélouma",
            count: LéloumaCount,
            // data: Lélouma,
          },
          {
            name: "Lélouma",
            count: LéloumaCount,
            // data: Lélouma,
          },
          {
            name: "Lola",
            count: LolaCount,
            // data: Lola,
          },
          {
            name: "Macenta",
            count: MacentaCount,
            // data: Macenta,
          },
          {
            name: "Mali",
            count: MaliCount,
            // data: Mali,
          },
          {
            name: "Mamou",
            count: MamouCount,
            // data: Mamou,
          },
          {
            name: "Mandiana",
            count: MandianaCount,
            // data: Mandiana,
          },
          {
            name: "Nzérékoré",
            count: NzérékoréCount,
            // data: Nzérékoré,
          },
          {
            name: "Pita",
            count: PitaCount,
            // data: Pita,
          },
          {
            name: "Siguiri",
            count: SiguiriCount,
            // data: Siguiri,
          },
          {
            name: "Télimélé",
            count: TéliméléCount,
            // data: Télimélé,
          },
          {
            name: "Tougué",
            count: TouguéCount,
            // data: Tougué,
          },
          {
            name: "Yomou",
            count: YomouCount,
            // data: Yomou,
          }
        );
        res.status(200).send({
          status: true,
          message: "data fetched successfully !",
          data: allDatas,
        });
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
