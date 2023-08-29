module.exports = (sequelize, Sequelize) => {
  const Blog = sequelize.define("blog", {
    adherentId: {
      type: Sequelize.INTEGER,
      references: { model: "adherents", key: "id" },
      allowNull: true,
    },
    title: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    description: {
      type: Sequelize.STRING,
    },
    image: {
      type: Sequelize.JSON,
      allowNull: true,
    },
    status: {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
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
  return Blog;
};
