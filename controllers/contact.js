const Contact = require('../models/contact')

const contact = async(req , res) => {
    try {
        const response = req.body;
        await Contact.create(response)
        return res.status(200).json({message: "message sent successfully"})
    } catch (error) {
        console.log(error)
    }

}

module.exports = contact ;