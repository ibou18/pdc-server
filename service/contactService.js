// const sendEmail = require("../utils/sendEmail");
const express = require("express");
const router = require("express").Router();
const db = require("../configs/db");
const AdminModel = db.admin;
const adherentModel = db.adherents;
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");

router.post("/", async (req, res, next) => {
  const { email, name, phone, message } = req.body;
  try {
    const sendMessage = `
      <h2>Message provenant du formulaire de contact du site cooking</h2>
      <h4> Nom: ${name}</h4>
      <h4> Email: ${email}</h4>
      <h4> phone: ${phone}</h4>
      <p>${message}</p>
    `;
    try {
      await sendEmail({
        to: "laguidev@gmail.com",
        subject: "🔐 Nouveau contact venant du site Cooking ",
        text: sendMessage,
      });
      return res.status(200).send({
        status: "success",
        message: "Votre message a été envoyé avec succes",
      });
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .send({ status: "error", message: "erreur veuillez recommencer" });
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
