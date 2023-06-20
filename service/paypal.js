const express = require("express");
const paypal = require("paypal-rest-sdk");
const db = require("../configs/db");
const PaiementModel = db.paiements;
const router = require("express").Router();

paypal.configure({
  mode: process.env.PAYPAL_ENV, //sandbox or live
  client_id: process.env.PAYPAL_CLIENT_ID,
  client_secret: process.env.PAYPAL_SECRET_KEY,
});

router.post("/pay", (req, res) => {
  console.log("req.body", req.body);
  const create_payment_json = {
    intent: "sale",
    payer: {
      payment_method: "paypal",
    },
    redirect_urls: {
      return_url: `${process.env.CLIENT_URL}/publication/${req.body.publication.id}/success/`,
      cancel_url: `${process.env.CLIENT_URL}/publication/${req.body.publication.id}/paiements`,
    },
    transactions: [
      {
        item_list: {
          items: [
            {
              name: req.body.publication.title,
              sku: "001",
              price: req.body.price,
              currency: "EUR",
              quantity: 1,
            },
          ],
        },
        amount: {
          currency: "EUR",
          total: req.body.price,
        },
        description: req.body.publication.title,
      },
    ],
  };

  paypal.payment.create(create_payment_json, function (error, payment) {
    if (error) {
      console.log("ErrorI", error);
    } else {
      for (let i = 0; i < payment.links.length; i++) {
        if (payment.links[i].rel === "approval_url") {
          res.send({ url: payment.links[i].href });
        }
      }
      PaiementModel.create({
        clientId: req.body.client.id,
        amount_paid: req.body.price,
        status: false,
        start_date: new Date(),
        day_active: req.body.days,
        devise: "EUR",
        operator: "Paypal",
        publicationId: req.body.publication.id,
        financial_transaction: payment.id,
        reference: "ref",
      });
    }
  });
});

router.get("/cancel", (req, res) => res.send("Cancelled"));

router.post("/payment-validated", async (req, res) => {
  console.log("ID", req.body.token);
  const payerId = req.body.PayerID;
  const paymentId = req.body.paymentId;
  let paiement = await PaiementModel.findOne({
    where: { financial_transaction: paymentId },
  });
  const execute_payment_json = {
    payer_id: payerId,
    transactions: [
      {
        amount: {
          currency: "EUR",
          total: paiement.amount,
        },
      },
    ],
  };

  // const data = await PaiementModel.update(
  //   {
  //     status: true,
  //     start_date: new Date(),
  //   },
  //   {
  //     where: { id: paiement.id },
  //   }
  // );
  paypal.payment.execute(
    paymentId,
    execute_payment_json,
    function (error, payment) {
      if (error) {
        console.log(error.response);
        throw error;
      } else {
        PaiementModel.update(
          {
            status: true,
            start_date: new Date(),
          },
          {
            where: { id: paiement.id },
          }
        );
        return res.status(200).send({
          status: "success",
          message: "paiement valider",
          data: { status: true },
        });
      }
    }
  );
});

module.exports = router;
