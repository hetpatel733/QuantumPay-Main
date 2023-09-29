const express = require('express');
const path = require('path');
var cookieParser = require('cookie-parser');
const app = express();

// ----------------------------------imports
require("./db/conn");

const Functions = require("./models/functions");

const { request, METHODS } = require('http');
const { paymentcompletschema } = require('./models/payment');
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
app.get("/", (req, res) => { })

app.get("/signup", (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'signup.html'));
})

app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'login.html'));
})

app.get("/contact", (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'contact.html'));
})

app.get("/panel", (req, res) => {
    res.send("Panel is here");
})

// http://localhost:8000/payment?apikey=api_here
app.get("/payment", (req, res) => {
    const apikey = req.query.apikey;
    // res.send({ apikey });
    Functions.apicheckFunction(apikey, res);
})
app.get("/payment/coinselect", (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'payment1.html'));
})

app.post("/payment/coinselect", (req, res) => {
    Functions.CoinselectFunction(req, res, app);
})

app.get("/payment/finalpayment", (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'payment2.html'));
    Functions.FinalpayFunction(req, res, app);
})

app.get("/payment/confirmation", async (req, res) => {
    try {
        data = await Functions.paymentcomplete();
        res.json(data);
    } catch (err) { console.log(err) }
})


// User Actions
app.post("/login", async (req, res) => {
    Functions.Loginfunction(req, res, app);
})

app.post("/signup", async (req, res) => {
    Functions.Signupfunction(req, res, app);
})

app.post("/contact", async (req, res) => {
    Functions.Contactfunction(req, res, app);
    app.post("/payment/coinselect", (req, res) => {
        Functions.CoinselectFunction(req, res, app);
    })
})

app.listen(port, () => {
    console.log(`http://localhost:${port}/`)
});