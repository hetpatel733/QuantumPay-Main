const mongoose = require('mongoose');

const Schema = new mongoose.Schema({

    payid: {
        type: String,
        required: true
    },
    uname: {
        type: String,
        required: true
    },
    fname: {
        type: String,
        required: true
    },
    lname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    paymenttype: {
        type: String,
        require: true
    },
    amnt: {
        type: String,
        require: true
    }
});

const Schema2 = new mongoose.Schema({
    payid: {
        type: String,
        required: true
    },
})

const Schema3 = new mongoose.Schema({
    uname: {
        type: String,
        required: true
    },
    BTC: {
        type: String,
        required: true
    },
    SOL: {
        type: String,
        required: true
    },
    EVM: {
        type: String,
        required: true
    },
    TRX: {
        type: String,
        required: true
    },
    amnt: {
        type: String,
        require: true
    }
})

const paymentlogschema = mongoose.model("payment_logs", Schema);
const paymentcompletschema = mongoose.model("completedpayment_logs", Schema2);
const addressesschema = mongoose.model("addresses", Schema3);

module.exports = { paymentlogschema, paymentcompletschema, addressesschema };