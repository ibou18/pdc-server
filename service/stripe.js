// const sendEmail = require("../utils/sendEmail");
const express = require("express");
const bodyParser = require("body-parser");
const db = require("../configs/db");
const PaiementModel = db.paiements;
const stripe = require("stripe")(process.env.STRIPE_KEY, {
  apiVersion: "2020-08-27",
});
const router = require("express").Router();

router.post("/create-checkout-session", async (req, res) => {
  console.log("KEy", process.env.STRIPE_KEY);
  const taxRate = await stripe.taxRates.create({
    display_name: "TPS - TVQ",
    inclusive: false,
    percentage: 5.0 + 9.975,
    country: "CA",
    state: "QC",
  });

  const items = [
    {
      price_data: {
        currency: "EUR",
        product_data: {
          name: req.body.publication.title,
          images: [req.body.publication.image_banner],
        },

        unit_amount: req.body.price * 100,
      },
      quantity: 1,
      //   tax_rates: [taxRate.id],
    },
  ];

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: items,
    customer_email: req.body.client.email,
    phone_number_collection: {
      enabled: true,
    },
    tax_id_collection: {
      enabled: true,
    },
    // billing_address_collection: "required",
    // shipping_address_collection: {
    //   allowed_countries: ["CA"],
    // },
    mode: "payment",
    success_url: `${process.env.CLIENT_URL}/publication/${req.body.publication.id}/success/{CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.CLIENT_URL}/publication/${req.body.publication.id}/paiements`,
  });

  res.send({ url: session.url });
  await PaiementModel.create({
    clientId: req.body.client.id,
    amount_paid: req.body.price,
    status: false,
    start_date: new Date(),
    day_active: req.body.days,
    devise: "EUR",
    operator: "Stripe",
    publicationId: req.body.publication.id,
    financial_transaction: session.id,
    reference: "ref",
  });
});

router.post("/payment-validated", async (req, res) => {
  try {
    console.log("Token", req.body.token);
    const session = await stripe.checkout.sessions.retrieve(req.body.token, {
      expand: ["line_items.data.price.product"],
    });
    console.log("session", session);
    let paiement = await PaiementModel.findOne({
      where: { financial_transaction: session.id },
    });
    console.log("paiement", paiement);

    const data = await PaiementModel.update(
      {
        status: true,
        start_date: new Date(),
      },
      {
        where: { id: paiement.id },
      }
    );
    console.log("data", data);
    return res.status(200).send({
      status: "success",
      message: "paiement valider",
      data: { status: true },
    });
  } catch (err) {
    console.log("__ Error Sent Mailling __", err);
    return res.status(500).send({
      status: "error",
      message: "Consultez la console pour Analyser L'Erreur",
    });
  }
});

router.get(
  "/webhook",
  bodyParser.raw({ type: "*/*" }),
  async (request, response) => {
    let event = request.body;

    try {
      event = stripe.webhooks.constructEvent(
        request.body,
        request.headers["stripe-signature"],
        process.env.STRIPE_WEBHOOK
      );
    } catch (err) {
      console.log(`Error`, err.message);
      return response.sendStatus(400);
    }

    // Handle the event
    switch (event.type) {
      case "payment_intent.succeeded":
        // const paymentIntent = event.data.object;
        console.log("Paiement Success");
        const paymentIntent = event;
        console.log("amount data", paymentIntent);
        const session = await stripe.checkout.sessions.list({
          limit: 1,
          payment_intent: paymentIntent.data.object.id,
        });
        let comm = await CommandeModel.findOne({
          session_id: session.data[0].id,
        }).select();

        let upComm = await CommandeModel.findOneAndUpdate(
          { _id: comm._id },
          {
            $set: {
              paymentStatus: true,
              livraisonAddress: paymentIntent.data.object.shipping.address,
              receipt_url:
                paymentIntent.data.object.charges.data[0].receipt_url,
            },
          },
          { new: true, upsert: true, setDefaultsOnInsert: true }
        );
        // console.log("upComm =>>", upComm);
        break;

      case "payment_intent.payment_failed":
        // envoyer un email au client en disant son payement n'a pas ete valider
        // et on supprimer la commande pour eviter des probleme

        const paymentEchec = event;
        const sessionEchec = await stripe.checkout.sessions.list({
          limit: 1,
          payment_intent: paymentEchec.data.object.id,
        });

        let commEchec = await CommandeModel.findOne({
          session_id: sessionEchec.data[0].id,
        }).select();

        await stripe.checkout.sessions.expire(sessionEchec.data[0].id);
        await CommandeModel.deleteOne({ _id: commEchec._id }).exec();
        break;
      default:
        // Unexpected event type
        console.log(`Unhandled event type ${event.type}.`);
    }
    // Return a 200 response to acknowledge receipt of the event
    response.send();
  }
);

router.post("/mobile-pay", async (req, res) => {
  console.log("PAYMENT MOBILE ************");
  console.log("**** req.body *****", req.body);
  try {
    // Getting data from client
    let { price, title } = req.body;
    console.log("*** title ****", title);
    console.log("*** price ****", price);
    // Simple validation
    if (!price || !title)
      return res.status(400).json({ message: "All fields are required" });
    price = parseInt(price);

    // Initiate payment for Mobile App
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(price * 100),
      currency: "CAD",
      payment_method_types: ["card"],
      metadata: { title },
    });

    // Extracting the client secret
    const clientSecret = paymentIntent.client_secret;
    // Sending the client secret as response

    console.log("***** clientSecret==== >>", clientSecret);

    res.json({ clientSecret: clientSecret });
  } catch (err) {
    // Catch any error and send error 500 to client
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/create-payment-intent", async (req, res) => {
  console.log("req.body", req.body);
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 100, //lowest denomination of particular currency
      currency: "eur",
      // payment_method_types: ["card"], //by default
      automatic_payment_methods: { enabled: true },
    });

    const clientSecret = await paymentIntent.client_secret;

    console.log("***** clientSecret==== >>", clientSecret);

    res.json({
      clientSecret: clientSecret,
    });
  } catch (e) {
    console.log(e.message);
    res.json({ error: e.message });
  }
});

router.post("/create-payement-mobile", async (req, res) => {
  console.log("req.body%%%%", req.body);
  await PaiementModel.create({
    // clientId: req.body.client.id,
    clientId: 85, // Changer par l'id du client connecté
    amount_paid: req.body.price,
    status: true,
    start_date: new Date(),
    day_active: req.body.day_active,
    devise: "EUR",
    operator: "Stripe",
    publicationId: req.body.publication.id,
    financial_transaction: req.body.financial_transaction,
    reference: "ref",
  });
  res.status(200).json({ message: "Success" });
});

module.exports = router;
