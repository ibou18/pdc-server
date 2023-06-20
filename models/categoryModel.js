module.exports = (sequelize, Sequelize) => {
  const Category = sequelize.define("category", {
    label: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    description: {
      type: Sequelize.STRING,
    },
    status: {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
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
  return Category;
};
