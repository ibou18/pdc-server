const pg = require("pg");
pg.defaults.ssl = true;
const Sequelize = require("sequelize");

// config de la DB
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    // port: process.env.DB_PORT,
    dialect: "postgres",
    operatorsAliases: 0,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 60000,
      idle: 10000,
    },
  }
);
const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;
// ----------------

// Import des models (il Creer s'il existe pas dans la DB)
db.userTemps = require("../models/userTempModel")(sequelize, Sequelize);
db.categories = require("../models/categoryModel")(sequelize, Sequelize);
db.types = require("../models/typeModel")(sequelize, Sequelize);
db.publications = require("../models/publicationModel")(sequelize, Sequelize);
db.admin = require("../models/adminModel")(sequelize, Sequelize);
db.adherents = require("../models/adherentModel")(sequelize, Sequelize);
db.countries = require("../models/country")(sequelize, Sequelize);
db.paiements = require("../models/paiementModel")(sequelize, Sequelize);

// Declaration des relations entre les models'

db.adherents.hasMany(db.paiements);
db.paiements.belongsTo(db.adherents);

db.admin.hasOne(db.publications, {
  foreignKey: {
    allowNull: true, // permet à la clé étrangère d'être null
  },
});

db.publications.belongsTo(db.admin);

module.exports = db;
