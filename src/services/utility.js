const { login } = require('./login');
const { signup } = require('./signup');
const { contact } = require('./contact');
const { paymentFunction, CoinselectFunction, FinalpayFunction, checkstatus } = require('./payment');



module.exports = { login, signup, contact, paymentFunction, CoinselectFunction, FinalpayFunction, checkstatus };