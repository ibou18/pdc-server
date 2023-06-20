module.exports = (sequelize, Sequelize) => {
  const UserTemp = sequelize.define("userTemp", {
    token: {
      type: Sequelize.STRING,
    },
    email: {
      type: Sequelize.STRING,
    },
  });

  return UserTemp;
};
