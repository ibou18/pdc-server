const moment = require("moment");
require("moment/locale/fr");
moment.locale("fr");

const generateStatsPaiement = (datas) => {
  let dataStats = [];

  datas.forEach((element) => {
    dataStats.push({
      amount: element.amount_paid,
      date: moment(element.createdAt).format("MMMM YYYY"),
    });
  });
  const groupedData = dataStats?.reduce((acc, { amount, date }) => {
    if (date in acc) {
      acc[date] += amount;
    } else {
      acc[date] = amount;
    }
    return acc;
  }, {});

  const result = Object.entries(groupedData).map(([date, total]) => ({
    date,
    total,
  }));

  return result;
};

module.exports = generateStatsPaiement;
