const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
    uname: {
        type: String,
        required: true
    },
    apikey: {
        type: String,
        required: true
    }
});

const apicheck = mongoose.model("account_apis", Schema);

module.exports = { apicheck };