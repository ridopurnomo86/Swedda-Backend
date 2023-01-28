const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
	service: "SendinBlue",
	auth: {
		user: process.env.EMAIL_TRANSPORTER,
		pass: process.env.PASSWORD_TRANSPORTER,
	},
});

module.exports = transporter;
