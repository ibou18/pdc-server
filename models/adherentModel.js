const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = (sequelize, Sequelize) => {
  const maxAge = 1 * 24 * 60 * 60 * 1000; // 1 days
  const Adherent = sequelize.define(
    "adherents",
    {
      firstName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      image: {
        type: Sequelize.STRING,
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      adresse: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      birth_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      birthday_location: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        // validate: {
        //   isEmail: true,
        // },
        unique: {
          args: true,
          msg: "Email address already exist",
        },
      },
      phone: {
        type: Sequelize.STRING,
      },
      profession: {
        type: Sequelize.STRING,
      },
      citizen: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      province: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      country: {
        type: Sequelize.STRING,
      },
      city: {
        type: Sequelize.STRING,
      },
      postal_code: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      civil_status: {
        type: Sequelize.ENUM("Marié", "Divorcé", "Célibataire"),
      },
      gradutation: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      politic_member: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      is_previously_politic: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      },
      motivations: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      ambitions: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      is_sign_declaration: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      identifiant: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: {
          args: true,
          msg: "identifiant already exist",
        },
      },
      image: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },

      tokens: {
        type: Sequelize.STRING,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
          // is: "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$",
          notNull: {
            msg: "Please enter your pasword",
          },
        },
      },
      ref_2: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      ref_3: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      ref_4: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      ref_5: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      ref_6: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      ref_7: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      ref_8: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      ref_9: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      // zone_id: {
      //   type: Sequelize.INTEGER,
      //   references: { model: "zones", key: "id" },
      //   onDelete: "CASCADE",
      // },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    },
    {
      hooks: {
        beforeCreate: async (user) => {
          if (user.password) {
            const salt = await bcrypt.genSalt();
            user.password = bcrypt.hashSync(user.password, salt);
          }
        },
        beforeUpdate: async (user) => {
          if (user.password) {
            const salt = await bcrypt.genSalt();
            user.password = bcrypt.hashSync(user.password, salt);
          }
        },
        beforeBulkUpdate: async (user) => {
          if (user.password) {
            const salt = await bcrypt.genSalt();
            user.password = bcrypt.hashSync(user.password, salt);
          }
        },
      },
    }
  );
  return Adherent;
};
