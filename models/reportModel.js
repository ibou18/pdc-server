module.exports = (sequelize, Sequelize) => {
  const Type = sequelize.define("report", {
    adherentId: {
      type: Sequelize.INTEGER,
      references: { model: "adherents", key: "id" },
      allowNull: true,
    },
    objet: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    description: {
      type: Sequelize.STRING,
    },
    present: {
      type: Sequelize.JSON,
      allowNull: true,
    },
    actions: {
      type: Sequelize.JSON,
      allowNull: true,
    },
    status: {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
    },
    nextDate: {
      allowNull: true,
      type: Sequelize.DATE,
    },
    links: {
      allowNull: true,
      type: Sequelize.JSON,
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
  return Type;
};
