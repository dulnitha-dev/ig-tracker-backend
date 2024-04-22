const nodemailer = require("nodemailer");
const ejs = require("ejs");
require("dotenv").config();

const settings = {
  host: "smtp.zoho.com",
  secure: true,
  port: 465,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
};

const sendEmailTemplate = async (senderName, recipient, title, template, options = {}) => {
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
        global.logtail.error(error.message);
        resolve(false);
      } else {
        console.log(`Sent ${template} email to ${recipient}: ${info.response}`);
        global.logtail.info(`Sent ${template} email to ${recipient}: ${info.response}`);
        resolve(true);
      }
      global.logtail.flush();
    });
  });
};

const sendEmail = async (senderName, recipient, title, body) => {
  return new Promise(async (resolve, reject) => {
    const transporter = nodemailer.createTransport(settings);
    const mailOptions = {
      from: `${senderName} <${process.env.MAIL_USER}>`,
      to: recipient,
      subject: title,
      text: body,
    };

    transporter.sendMail(mailOptions, async (error, info) => {
      if (error) {
        console.error(error);
        await global.logtail.error(error.message);
        resolve(false);
      } else {
        console.log(`Sent email to ${recipient}: ${info.response}`);
        await global.logtail.info(`Sent email to ${recipient}: ${info.response}`);
        resolve(true);
      }
      global.logtail.flush();
    });
  });
};

module.exports = { sendEmail, sendEmailTemplate };
