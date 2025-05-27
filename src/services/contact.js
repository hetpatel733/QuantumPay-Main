const { contactsave } = require("../models/contact");

const contact = async (req, res, app) => {
    try {
        var { email, subject, comment } = req.body;
        var contactdata = new contactsave({
            email: email,
            subject: subject,
            comment: comment,
        })
        const contactconfirmed = await contactdata.save();
        Success = true;
    } catch (error) {
        console.log(error);
        Success = false;
    }
    res.redirect(`/contact?Success=${Success}`);
}

module.exports = {
    contact
};