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
  const body = await ejs.renderFile(__dirname + "/../views/" + template + ".email.ejs", options);
  const mailOptions = {
    from: `${senderName} <${process.env.MAIL_USER}>`,
    to: recipient,
    subject: title,
    html: body,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) console.log(error);
    else console.log("Email sent: " + info.response);
  });
};

module.exports = sendEmail;
