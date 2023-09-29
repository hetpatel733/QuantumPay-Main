const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
    fname: {
        type: String,
        required: true
    },
    lname: {
        type: String,
        required: true
    },
    uname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
});

const loginschema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
});

const Business = mongoose.model("Business_Accounts", Schema);
const Personal = mongoose.model("Personal_Accounts", Schema);
const Loginlogs = mongoose.model("login_logs", loginschema);

module.exports = { Loginlogs, Business, Personal };

// update::
// let data = await Business.updateOne(
//     { email: "het@gmail" },
//     {$set:{password:"hetpatel"}}
//     )
//     console.log(data);