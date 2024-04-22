const nodemailer = require("nodemailer");
const ejs = require("ejs");
require("dotenv").config();

const { Logtail } = require("@logtail/node");
const logtail = new Logtail("sRBk6hMoi8YQBW6CKanunY2Z");

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

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
      logtail.error(error.message);
    } else {
      console.log(`Email sent to ${recipient}: ${info.response}`);
      logtail.info(`Email sent to ${recipient}: ${info.response}`);
    }
    logtail.flush();
  });
};

module.exports = { sendEmail };
