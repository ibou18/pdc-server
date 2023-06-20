const express = require("express");
const cookieParser = require("cookie-parser");
require("dotenv").config({ path: "./.env" });
const db = require("./configs/db");
db.sequelize.sync();
const cors = require("cors");
const app = express();
// const bodyParser = require("body-parser");
const path = require("path");

const { swaggerDocs: V1SwaggerDocs } = require("./v1/swagger");

// App routes
const adminsRoutes = require("./routes/adminRoutes");
const publicationRoutes = require("./routes/publicationRoutes");
const typeRoutes = require("./routes/typeRoutes");
const clientRoutes = require("./routes/clientRoutes");
const countryRoutes = require("./routes/countryRoutes");
const paiementRoutes = require("./routes/paiementRoutes");
const Stripe = require("./service/stripe");
const Paypal = require("./service/paypal");
const orangeMoney = require("./service/orangeMoney");
const Stats = require("./routes/statsRoutes");
const AuthService = require("./service/authService");
const AuthServiceClient = require("./service/authServiceClient");
const ContactService = require("./service/contactService");
// const { checkUser, requireAuth } = require("./middleware/auth.middleware");

var whitelist = [
  "https://cinema-client-psi.vercel.app",
  "https://lagui-admin.vercel.app",
  "https://lagui-admin.vercel.app/",
  "https://cinema-client-git-env-dev-laguidev.vercel.app",
  "http://localhost:3000",
  "http://localhost:19006",
  "http://localhost:3001",
  "http://192.168.2.114:3000",
  "https://client-lagui.vercel.app",
  "https://cine-admin.vercel.app",
  "https://mpayment.orange-money.com",
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
app.use("/api/v1/clients", clientRoutes);
app.use("/api/v1/countries", countryRoutes);
app.use("/api/v1/paiements", paiementRoutes);
app.use("/api/v1/stripes", Stripe);
app.use("/api/v1/paypals", Paypal);
app.use("/api/v1/stats", Stats);
app.use("/api/v1/orange-money", orangeMoney);
app.use("/api/v1/auth/admins", AuthService);
app.use("/api/v1/auth/clients", AuthServiceClient);
app.use("/api/v1/contacts", ContactService);

app.listen(process.env.PORT, () => {
  console.log(`🎉 API is listening on port ${process.env.PORT}`);
  /// *** ADD ***
  V1SwaggerDocs(app, process.env.PORT);
});
