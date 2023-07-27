const express = require("express");
const cookieParser = require("cookie-parser");
require("dotenv").config({ path: "./.env" });
const db = require("./configs/db");
db.sequelize.sync();
const cors = require("cors");
const app = express();
const path = require("path");

const { swaggerDocs: V1SwaggerDocs } = require("./v1/swagger");

// App routes
const adminsRoutes = require("./routes/adminRoutes");
const publicationRoutes = require("./routes/publicationRoutes");
const typeRoutes = require("./routes/typeRoutes");
const AdherentRoutes = require("./routes/AdherentRoutes");
const countryRoutes = require("./routes/countryRoutes");
const paiementRoutes = require("./routes/paiementRoutes");
const CommentRoutes = require("./routes/commentRoutes");
const ArticleRoutes = require("./routes/articleRoutes");
const Stripe = require("./service/stripe");
const Paypal = require("./service/paypal");
const orangeMoney = require("./service/orangeMoney");
const Stats = require("./routes/statsRoutes");
const AuthService = require("./service/authService");
const AuthServiceAdherent = require("./service/authServiceAdherent");
const ContactService = require("./service/contactService");

// const { checkUser, requireAuth } = require("./middleware/auth.middleware");

var whitelist = [
  "https://pdc-client.vercel.app",
  "https://pdc-client.vercel.app/",
  "https://www.pdc-gn.com/",
  "https://www.pdc-gn.com",
  "http://localhost:3000",
  "http://localhost:19006",
  "http://localhost:3001",
  "http://192.168.2.114:3000",
  "https://mpayment.orange-money.com",
  "https://admin.pdc-gn.com",
];

console.log("Demarrage");
const corsOptions = {
  // origin: process.env.CLIENT_URL,
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  allowedHeaders: ["sessionId", "Content-Type", "x-access-token"],
  exposedHeaders: ["sessionId"],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(cors(corsOptions));

app.use(function (req, res, next) {
  // res.header("Access-Control-Allow-Origin", process.env.CLIENT_URL);
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, x-access-token"
  );
  next();
});

// routes
app.use("/api/v1/admins", adminsRoutes);
app.use("/api/v1/publications", publicationRoutes);
app.use("/api/v1/types", typeRoutes);
app.use("/api/v1/adherents", AdherentRoutes);
app.use("/api/v1/countries", countryRoutes);
app.use("/api/v1/paiements", paiementRoutes);
app.use("/api/v1/stripes", Stripe);
app.use("/api/v1/paypals", Paypal);
app.use("/api/v1/stats", Stats);
app.use("/api/v1/orange-money", orangeMoney);
app.use("/api/v1/auth/admins", AuthService);
app.use("/api/v1/auth/adherents", AuthServiceAdherent);
app.use("/api/v1/contacts", ContactService);
// app.use("/api/v1/comments", CommentRoutes);
// app.use("/api/v1/articles", ArticleRoutes);

app.listen(process.env.PORT, () => {
  console.log(`🎉 API is listening on port ${process.env.PORT}`);
  /// *** ADD ***
  V1SwaggerDocs(app, process.env.PORT);
});
