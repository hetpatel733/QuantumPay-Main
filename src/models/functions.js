const { Loginlogs, Business, Personal } = require("./signup-login");
const { contactsave } = require("./contact");
const { apicheck } = require("./api");
const { paymentlogschema, paymentcompletschema, addressesschema } = require("./payment");
const { response } = require("express");

// Mini Functions
const addtotempdata = (tempdata, id, message) => {
    return tempdata.push({ id, message });
}
const removetotempdata = (tempdata, idtodel) => {
    tempdata = null;
}
async function Loginlog(Loginlogs, email, password) {
    var loginlog = new Loginlogs({
        email, password
    })
    var logsuccess = await loginlog.save();
}

function randomnumber(length) {
    let result = '';
    const characters = '0123456789'; // Characters to choose from

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters.charAt(randomIndex);
    }

    return result;
}

const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
async function Randompayid(length) {
    let payid = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        payid += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    const payiddb = await paymentlogschema.findOne({ payid });
    while (payiddb) {
        payid = await Randompayid(5);
        payiddb = null;
    }
    return payid;
}

const paycompletedcall = async (payid) => {
    var paycompleted = new paymentcompletschema({ payid });
    const paycompletedsave = await paycompleted.save();
}
// Big Handlers Functions
const Loginfunction = async (req, res, app) => {
    try {
        var { email, password } = req.body;
        var Businessemaillog = await Business.findOne({ email: email });
        var Personalemaillog = await Personal.findOne({ email: email });
        if (Businessemaillog || Personalemaillog) {
            var Businesspass = await Business.findOne({ email, password });
            var Personalpass = await Personal.findOne({ email, password });
            if (Businesspass) {
                Loginlog(Loginlogs, Businesspass.email, Businesspass.password);
                req.session.email = Businesspass.email;
                req.session.save();
                res.redirect('/dashboard');
            } else if (Personalpass) {
                Loginlog(Loginlogs, Personalpass.email, Personalpass.password);
                req.session.email = Personalpass.email;
                req.session.save();
                res.redirect('/dashboard');
            } else {
                return res.status(401).redirect('/login?error=WrongloginPassword');
            }
        } else {
            return res.status(401).redirect('/signup?error=Wrongloginemail');
        }
    } catch (error) {
        console.log(error);
    }
}
// res.cookie('email', email);
// res.cookie('password', password);
// console.log(req.cookies);

const Bdashboard = async (req, res, app) => {
    const { logout } = req.query;
    req.session.destroy();
    res.redirect('/');
}

const Signupfunction = async (req, res, app) => {
    try {
        var { fname, lname, uname, email, cpassword, } = req.body;
        var Personalemailup = await Personal.findOne({ email });
        var Businessemailup = await Business.findOne({ email });
        var Personalunameup = await Personal.findOne({ uname });
        var Businessunameup = await Business.findOne({ uname });
        if (Businessemailup || Personalemailup) {
            return res.status(401).redirect('/login?error=SignEmailused');
        } else {
            registrationtype = req.body.registrationtype;
            var password = req.body.password;
            regexPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.*\s).{9,}$/;
            var match = password.match(regexPattern);

            if (Personalunameup || Businessunameup) {
                return res.status(401).redirect('/signup?error=SignUnameused');
            } else if (!match) {
                return res.status(401).redirect('/signup?error=SignPassPatt');
            } else if (password != cpassword) {
                return res.status(401).redirect('/signup?error=SignPassEequal');
            } else if (registrationtype == 'B') {
                var registerdata = new Business({
                    fname, lname, uname, email, password,
                })
                var registersuccess = await registerdata.save();
                return res.status(401).redirect('/login?error=SuccessSignup');
            } else if (registrationtype = 'P') {
                var registerdata = new Personal({
                    fname, lname, uname, email, password,
                })
                var registersuccess = await registerdata.save();
                return res.status(401).redirect('/login?error=SuccessSignup');
            }
        }

    } catch (error) {
        console.log(error);
    }
}

const Contactfunction = async (req, res, app) => {
    try {
        var { email, subject, comment } = req.body;
        var contactdata = new contactsave({
            email: email,
            subject: subject,
            comment: comment,
        })
        const contactconfirmed = await contactdata.save();
        res.send('We will reach out you soon with your email Now You can go Back 😊😊😊😊');
    } catch (error) {
        console.log(error);
    }
}
const apicheckFunction = async (apikey, res) => {
    const apifound = await apicheck.findOne({ apikey });
    if (apifound) {
        res.redirect(`/payment/coinselect?apikey=${apikey}&uname=${apifound.uname}`);
    } else {
        return res.redirect('/');
    }
}

const CoinselectFunction = async (req, res, app) => {
    const { fname, lname, email, paymenttype } = req.body;
    var uname = req.query.uname;

    var payid = await Randompayid(5);

    var address = await addressesschema.findOne({ uname });
    var amnt = address.amnt;

    var finaladdress = null;
    var symbolforapi = null;
    if (paymenttype == "BTC") {
        finaladdress = address.BTC;
        symbolforapi = "BTC";
    } else if (paymenttype == "SOL") {
        finaladdress = address.SOL;
        symbolforapi = "SOL";
    } else if (paymenttype == "TRX") {
        finaladdress = address.TRX;
        symbolforapi = "TRX";
    } else if (paymenttype == "TRCUSDT") {
        finaladdress = address.TRX;
        symbolforapi = "TRX";
    } else {
        finaladdress = address.EVM;
        if (paymenttype == "ETH") {
            symbolforapi = "ETH";
        } else if (paymenttype == "SOL") {
            symbolforapi = "SOL";
        } else if (paymenttype == "BNB") {
            symbolforapi = "BNB"
        } else if (paymenttype == "MATIC") {
            symbolforapi = "MATIC";
        } else if (paymenttype == "TRX") {
            symbolforapi = "TRX";
        } else { symbolforapi = "USDC" }
    }

    try {
        const priceres = await fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${symbolforapi}USDT`);
        const data = await priceres.json();
        amnt /= data.price;
        amnt = amnt.toFixed(7);
        if (symbolforapi == "USDC") {
            random6numbers = randomnumber(6) / 1000000;
            amnt = Math.floor(amnt) + random6numbers * Math.pow(10, -2);
        }

    } catch (error) { console.log(error); }

    var paymentlog = new paymentlogschema({
        payid, uname, fname, lname, email, paymenttype, amnt
    })
    const paymentlogsave = await paymentlog.save();

    // Particular Currency mapping

    res.redirect(`/payment/finalpayment?uname=${uname}&payid=${payid}&finaladdress=${finaladdress}&amnt=${amnt}&symbol=${symbolforapi}`);

}
const FinalpayFunction = async (req, res, app) => {
    const { uname, payid } = req.query;
    // const { uname, payid, finaladdress, amnt, symbolforapi } = req.query;
    // const BTC = "btcadd";
    // const SOL = "soladd";
    // const EVM = "evmadd";
    // const TRX = "trxadd";
    // const amnt = "100";
    // var addressinput = new addressesschema({
    //     uname, BTC, SOL, EVM, TRX, amnt
    // })
    // const addressss= await addressinput.save();

    var payidfound = await paymentlogschema.findOne({ payid });
    var paytype = payidfound.paymenttype;
    var address = await addressesschema.findOne({ uname });
    var { BTC, SOL, EVM, TRX } = address;
    var tempamnt = payidfound.amnt;

    const apipolygon = "Y1EGDU1IS7CK8YN2MFFAGY75KWXZMP94C2";
    const apibsc = "H7UGMZ4681QAYM4JQ5A6PUGJN5V1UMAAI2";
    const apisol = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjcmVhdGVkQXQiOjE2OTQ2ODE0ODQ5ODIsImVtYWlsIjoiaGV0cGF0ZWw3NjI3QGdtYWlsLmNvbSIsImFjdGlvbiI6InRva2VuLWFwaSIsImlhdCI6MTY5NDY4MTQ4NH0.38q5FliTpdm_y9JVJlK12RLcVbjaBTNQnXD08xXD1nw";

    switch (paytype) {
        case "MATIC":
            tempamnt *= 10000000;
            var runcount = 0;
            const maticpay = async () => {
                runcount++;
                const paymentres = await fetch(`https://api.polygonscan.com/api?module=account&action=txlist&address=${EVM}&startblock=0&endblock=99999999&page=1&offset=10&sort=desc&apikey=${apipolygon}`);
                const data = await paymentres.json();
                console.log(tempamnt);
                let i = 0;
                console.log(data.result[i].value / 100000000000);

                while (i < 5) {
                    var trnxvalue = Math.floor(data.result[i].value / 100000000000);
                    console.log(trnxvalue);
                    if (trnxvalue == tempamnt) {
                        paycompletedcall(payid);
                        break
                    } else {
                        i++;
                    }
                }
            }
            if (runcount < 30) {
                // setInterval(maticpay, 60000);
                maticpay();
            } else {
                message = "failed";
            }
            break;

        case "BNB":
            tempamnt *= 10000000;
            var runcount = 0;
            const bnbpay = async () => {
                runcount++;
                const paymentres = await fetch(`https://api.bscscan.com/api?module=account&action=txlist&address=${EVM}&startblock=0&endblock=99999999&page=1&offset=10&sort=desc&apikey=${apibsc}`);
                const data = await paymentres.json();
                let i = 0;
                console.log(data.result[i].value / 100000000000);

                while (i < 5) {
                    var trnxvalue = Math.floor(data.result[i].value / 100000000000);
                    console.log(trnxvalue);
                    if (trnxvalue == tempamnt) {
                        paycompletedcall(payid);
                        break
                    } else {
                        i++;
                    }
                }
            }
            if (runcount < 30) {
                // setInterval(maticpay, 60000);
                bnbpay();
            } else {
                message = "failed";
            }
            break;


        case "SOL":
            tempamnt *= 10000000;
            var runcount = 0;
            const solpay = async () => {
                runcount++;
                const paymentres = await fetch(``);
                const data = await paymentres.json();
                console.log(tempamnt);
                let i = 0;
                console.log(data.result[i].value / 100000000000);

                while (i < 5) {
                    var trnxvalue = Math.floor(data.result[i].value / 100000000000);
                    console.log(trnxvalue);
                    if (trnxvalue == tempamnt) {
                        paycompletedcall(payid);
                        break
                    } else {
                        i++;
                    }
                }
            }
            if (runcount < 30) {
                // setInterval(maticpay, 60000);
                solpay();
            } else {
                message = "failed";
            }
            break;


        default:
            console.log("error in last");
            break;
    }
}

const paymentcomplete = async (payid) => {
    data = await paymentcompletschema.find();
    return data;
}

module.exports = { Loginfunction, Signupfunction, Contactfunction, removetotempdata, apicheckFunction, CoinselectFunction, FinalpayFunction, paymentcomplete, Bdashboard };