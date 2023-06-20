const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = (sequelize, Sequelize) => {
  const maxAge = 3 * 24 * 60 * 60 * 1000; // 3 days
  const Client = sequelize.define(
    "client",
    {
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
      identifiant: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: {
          args: true,
          msg: "identifiant already exist",
        },
      },
      firstName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      image: {
        type: Sequelize.STRING,
        // allowNull: true,
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      phone: {
        type: Sequelize.STRING,
      },
      status: {
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
      provider: {
        type: Sequelize.STRING,
      },
      ref_2: {
        type: Sequelize.STRING,
      },
      ref_3: {
        type: Sequelize.STRING,
      },
      ref_4: {
        type: Sequelize.STRING,
      },
      ref_5: {
        type: Sequelize.STRING,
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
  return Client;
};
