const { accounts } = require("../models/account");

const signup = async (req, res, app) => {
    try {
        let verified = false;
        const { uname, email, password, type } = req.body;

        const emailExists = await accounts.findOne({ email });
        const unameExists = await accounts.findOne({ uname });

        if (emailExists) {
            return res.status(401).redirect('/login?error=SignEmailused');
        } else if (unameExists) {
            return res.status(401).redirect('/signup?error=SignUnameused');
        } else {
            const registerdata = new accounts({
                uname, email, password, type, verified
            });
            await registerdata.save();
            return res.status(200).redirect('/login?error=SuccessSignup');
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send("Internal Server Error");
    }
};

module.exports = {
    signup
};
