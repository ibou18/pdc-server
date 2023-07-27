const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = (sequelize, Sequelize) => {
  const maxAge = 3 * 24 * 60 * 60 * 1000; // 3 days
  const Admin = sequelize.define(
    "admin",
    {
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          isEmail: true,
        },
        unique: {
          args: true,
          msg: "Email address already exist",
        },
      },
      display_name: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "-",
      },
      firstName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      telephone: {
        type: Sequelize.STRING,
      },
      country: {
        type: Sequelize.STRING,
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      tokens: {
        type: Sequelize.STRING,
      },
      status: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      comment: {
        type: Sequelize.STRING,
      },
      roles: {
        type: Sequelize.ENUM,
        allowNull: false,
        values: ["admin", "producteur", "superviseur", "partenaire"],
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
          is: "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{5,}$",
          notNull: {
            msg: "Please enter your password",
          },
        },
      },
      ref_1: {
        type: Sequelize.STRING,
      },
      ref_2: {
        type: Sequelize.STRING,
      },
      red_3: {
        type: Sequelize.STRING,
      },
      ref_4: {
        type: Sequelize.STRING,
      },
      ref_5: {
        type: Sequelize.STRING,
      },
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
            console.log("🆘user", user);
            const salt = await bcrypt.genSalt();
            user.password = bcrypt.hashSync(user.password, salt);
          }
        },
        beforeUpdate: async (user) => {
          console.log("user", user);
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
  return Admin;
};
