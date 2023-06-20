module.exports = (sequelize, Sequelize) => {
  const Publication = sequelize.define("publication", {
    title: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    link: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    availability: {
      type: Sequelize.BOOLEAN,
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
  return Publication;
};
