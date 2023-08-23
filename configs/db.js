var pg = require("pg");
pg.defaults.ssl = true;
const Sequelize = require("sequelize");

// config de la DB
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
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

// Import des models (il Crée s'il n'existe pas dans la DB)
db.userTemps = require("../models/userTempModel")(sequelize, Sequelize);
db.categories = require("../models/categoryModel")(sequelize, Sequelize);
db.types = require("../models/typeModel")(sequelize, Sequelize);
db.publications = require("../models/publicationModel")(sequelize, Sequelize);
db.admins = require("../models/adminModel")(sequelize, Sequelize);

db.countries = require("../models/country")(sequelize, Sequelize);
db.paiements = require("../models/paiementModel")(sequelize, Sequelize);

// --------------------

// Declaration des relations entre les models'

// categorie and publications

db.publications.belongsTo(db.categories);

// types and publications
db.types.belongsToMany(db.publications, {
  through: "publication_type",
  as: "publications",
  foreignKey: "type_id",
});
db.publications.belongsToMany(db.types, {
  through: "publication_type",
  as: "types",
  foreignKey: "publication_id",
});

// planTarifaire et publication

// paiements clients films
db.publications.hasMany(db.paiements);
db.paiements.belongsTo(db.publications);

db.admins.hasOne(db.publications, {
  foreignKey: {
    allowNull: true, // permet à la clé étrangère d'être null
  },
});

db.publications.belongsTo(db.admins);

module.exports = db;
