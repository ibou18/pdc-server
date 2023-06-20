module.exports = (sequelize, Sequelize) => {
  const country = sequelize.define("country", {
    code: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    display_name: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    devise: {
      type: Sequelize.TEXT,
    },
    status: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
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

  return country;
};
