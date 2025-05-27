const { loginlog, accounts } = require("../models/account");


const login = async (req, res) => {
    try {
        var { email, password } = req.body;
        var emaillog = await accounts.findOne({ email: email });
        if (emaillog) {
            var passlog = await accounts.findOne({ email, password });
            if (passlog) {
                // res.cookie('email', Businesspass.email);
                // res.cookie('password', Businesspass.password);
                // console.log(req.cookies);
                res.redirect('/panel');
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

module.exports = {
    login
};