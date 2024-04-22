const nodemailer = require("nodemailer");
const ejs = require("ejs");
require("dotenv").config();

const { Logtail } = require("@logtail/node");
const logtail = new Logtail("sRBk6hMoi8YQBW6CKanunY2Z");

const settings = {
  host: "smtp.zoho.com",
  secure: true,
  port: 465,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
};

const sendEmail = async (senderName, recipient, title, template, options = {}) => {
  return new Promise(async (resolve, reject) => {
    const transporter = nodemailer.createTransport(settings);
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
        resolve(false);
      } else {
        console.log(`Sent ${template} email to ${recipient}: ${info.response}`);
        logtail.info(`Sent ${template} email to ${recipient}: ${info.response}`);
        resolve(true);
      }
      logtail.flush();
    });
  });
};

module.exports = { sendEmail };
