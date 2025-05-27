// const alchemyDocs = require("@api/alchemy-docs");
const express = require("express");
const path = require("path");
var cookieParser = require("cookie-parser");
const app = express();

// ----------------------------------imports
require("./db/conn");
const utility = require("./services/utility");
require("./models/payment");

const port = process.env.PORT || 8000;
const static_path = path.join(__dirname, "../public");
const views_path = path.join(__dirname, "../views");

// express definitions
app.use(express.static(static_path));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.set("views", views_path);

// ---------------------------------------------Pages
app.get("/", (req, res) => { });

app.get("/signup", (req, res) => {
  res.sendFile(path.join(__dirname, "../views", "signup.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "../views", "login.html"));
});

app.get("/contact", (req, res) => {
  res.sendFile(path.join(__dirname, "../views", "contact.html"));
});

app.get("/panel", (req, res) => {
  res.send("Panel is here");
});

app.get("/payment", (req, res) => {
  const { api, order_id } = req.query;
  utility.paymentFunction(api, order_id, res);
});
app.get("/payment/coinselect", (req, res) => {
  res.sendFile(path.join(__dirname, "../views", "payment1.html"));
});

app.post("/payment/coinselect", (req, res) => {
  utility.CoinselectFunction(req, res, app);
});

app.get("/payment/finalpayment", (req, res) => {
  res.sendFile(path.join(__dirname, "../views", "payment2.html"));
  utility.FinalpayFunction(req, res);
});

app.get('/api/check-status', async (req, res) => {
  utility.checkstatus(req, res);
});

// User Actions
app.post("/login", async (req, res) => {
  utility.login(req, res);
});

app.post("/signup", async (req, res) => {
  utility.signup(req, res, app);
});

app.post("/contact", async (req, res) => {
  utility.contact(req, res, app);
});

app.listen(port, () => {
  console.log(`http://localhost:${port}/`);
});
