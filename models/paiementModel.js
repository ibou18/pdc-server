module.exports = (sequelize, Sequelize) => {
  const Paiement = sequelize.define("paiement", {
    reference: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    operator: {
      type: Sequelize.STRING,
      allowNull: false,
    },

    amount_paid: {
      type: Sequelize.FLOAT,
      allowNull: false,
    },
    status: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    devise: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    start_date: {
      allowNull: true,
      type: Sequelize.DATE,
    },
    adminId: {
      type: Sequelize.INTEGER,
      references: { model: "admins", key: "id" },
      allowNull: true,
    },
    financial_transaction: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    comments: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
  });
  return Paiement;
};
