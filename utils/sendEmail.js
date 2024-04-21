const nodemailer = require("nodemailer");
const ejs = require("ejs");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: "smtp.zoho.com",
  secure: true,
  port: 465,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

const sendEmail = async (senderName, recipient, title, template, options = {}) => {
  const body = await ejs.renderFile(__dirname + "/../views/emails/" + template + ".ejs", options);
  const html = await ejs.renderFile(__dirname + "/../views/emails/layout.ejs", { ...options, body: body });
  const mailOptions = {
    from: `${senderName} <${process.env.MAIL_USER}>`,
    to: recipient,
    subject: title,
    html: html,
  };

  const result = {};

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      result = error;
    } else {
      console.log(`Email sent to ${recipient}: ${info.response}`);
      result = info;
    }
    return result;
  });
};

module.exports = { sendEmail };
