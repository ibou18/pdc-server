module.exports = (sequelize, Sequelize) => {
  const Article = sequelize.define("article", {
    idAuthor: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    images: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    title: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    category: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    Keywords: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    likes: {
      type: Sequelize.INTEGER,
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
  return Article;
};
