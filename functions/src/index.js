/** SERVER MODULES */
const express = require("express");
const { resolve } = require("path");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");

const cors = require("cors");

/** SERVER CONFIGS */
dotenv.config();

const app = express();

// Configure CORS
const corsOptions = {
  //origin: ['https://nutrient.trading', 'https://neptunechain.io'],
  origin: '*',
  methods: 'GET,POST,PUT,DELETE,OPTIONS',
  allowedHeaders: 'Content-Type,Authorization',
  credentials: true 
};

app.use(cors(corsOptions));

// Ensure that preflight (OPTIONS) requests are handled with a 200 response
app.options('*', (req, res) => {
  //res.setHeader('Access-Control-Allow-Origin', 'https://nutrient.trading');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.status(200).send();
});

app.use(express.json());
app.use(express.static("./public"));
app.use(bodyParser.json());

/* **********************************#WEB*ROUTES*********************************************** */
app.get("/", (req, res) => {
  const path = resolve("/index.html");
  res.sendFile(path);
});

app.get("/docs", (req, res) => {
  const path = resolve("/docs.html");
  res.sendFile(path);
});

/* **********************************#API*ROUTES*********************************************** */
const accountRoutes = require("./routes/accountRoutes");
app.use("/account", accountRoutes);

const userDatabaseRoutes = require("./routes/userDatabaseRoutes");
app.use("/db/user", userDatabaseRoutes);

const mediaDatabaseRoutes = require("./routes/mediaDatabaseRoutes");
app.use("/db/media", mediaDatabaseRoutes);

const assetDatabaseRoutes = require("./routes/assetDatabaseRoutes");
app.use("/db/asset", assetDatabaseRoutes);

const livepeerRoutes = require("./routes/livepeerRoutes");
app.use("/livepeer", livepeerRoutes);

const mapsRoutes = require("./routes/mapsRoutes");
app.use("/maps", mapsRoutes);

const alchemyRoutes = require("./routes/alchemyRoutes");
app.use("/alchemy", alchemyRoutes);

const neptuneChainCreditsRoutes = require("./routes/npcCreditsRoutes");
app.use("/npc_credits", neptuneChainCreditsRoutes);

const stripeRoutes = require("./routes/stripeRoutes");
app.use("/stripe", stripeRoutes);

const deviceManagementRoutes = require("./routes/deviceManagementRoutes");
app.use("/device", deviceManagementRoutes);

const marketplaceRoutes = require("./routes/marketplaceRoutes");
app.use("/marketplace", marketplaceRoutes);

/****************************************************************************************** */
exports.app = require("firebase-functions").https.onRequest(app);
console.log(`SERVER IS LIVE!!`);
