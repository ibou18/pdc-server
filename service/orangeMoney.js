const express = require("express");
const db = require("../configs/db");
const PaiementModel = db.paiements;
const router = require("express").Router();
const axios = require("axios");

router.post("/pay", (req, res) => {
  const authOptions = {
    method: "POST",
    url: "https://api.orange.com/oauth/v3/token",
    headers: {
      Authorization: `Basic ${process.env.ORANGE_MONEY_TOKEN}`,
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
    data: "grant_type=client_credentials",
  };

  axios(authOptions)
    .then(async (response) => {
      const accessToken = response.data.access_token;
      console.log("acess token", accessToken);
      // Envoi d'argent
      const uniqueString = (+new Date()).toString(36).slice(-5);
      const paymentData = await PaiementModel.create({
        clientId: req.body.client.id,
        amount_paid: req.body.price,
        status: false,
        start_date: new Date(),
        day_active: req.body.days,
        devise: "GNF",
        operator: "orange money",
        publicationId: req.body.publication.id,
        financial_transaction: `${req.body.publication.title}_______${req.body.client.id}${uniqueString}`,
        reference: "ref",
      });
      console.log("paymentData", paymentData);
      const sendOptions = {
        method: "POST",
        url: "https://api.orange.com/orange-money-webpay/gn/v1/webpayment",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        data: {
          merchant_key: `${process.env.ORANGE_MONEY_MARCHAND_KEY}`,
          currency: "GNF",
          order_id: `${req.body.publication.title}_______${req.body.client.id}${uniqueString}`,
          amount: req.body.publication.planTarifaire.rate_gn,

          // return_url: `https://client-lagui.vercel.app/publication/${req.body.publication.id}`,
          // cancel_url: `https://client-lagui.vercel.app/publication/${req.body.publication.id}/paiements`,
          // notif_url: `${process.env.SERVER_URL}/api/v1/orange-money/payment-validated/${paymentData.id}`,

          return_url: `${process.env.API_URL}/${req.body.publication.id}`,
          cancel_url: `${process.env.API_URL}/${req.body.publication.id}/paiements`,
          notif_url: `${process.env.API_URL}/api/v1/orange-money/payment-validated/${paymentData.id}`,
          // cancel_url: "http://www.merchant-example.org/cancel",
          lang: "fr",
          reference: "dwhLt3C4GoUR5H7Q",
        },
      };
      console.log("TEST II");

      axios(sendOptions)
        .then(({ data }) => {
          console.log("RES II", data);
          res.send({ url: data.payment_url });
        })
        .catch((error) => {
          console.error("Error II", error?.response?.data);
        });
    })
    .catch((error) => {
      console.error("Error", error?.response?.data);
    });
});

router.post("/payment-validated/:id", async (req, res) => {
  console.log("TEST HOOKS", req.params.id);
  console.log("req HOOKS", req.body);

  if (req.body.status === "FAILED") {
    console.log("Transaction a echouee");
  } else if (req.body.status === "SUCCESS") {
    let paiement = await PaiementModel.findOne({
      where: { id: req.params.id },
    });
    await PaiementModel.update(
      {
        status: true,
        start_date: new Date(),
        financial_transaction: req.body.txnid,
      },
      {
        where: { id: paiement.id },
      }
    );
    res.send({
      url: `${process.env.CLIENT_URL}/publication/${paiement.publicationId}`,
      // url: `https://client-lagui.vercel.app/publication/${paiement.publicationId}`,
    });
  }
});

module.exports = router;
