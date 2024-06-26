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

    transporter.sendMail(mailOptions, async (error, info) => {
      if (error) {
        console.error(error);
        await logtail.error(error.message);
        await logtail.flush();
        resolve(false);
      } else {
        console.log(`Sent ${template} email to ${recipient}: ${info.response}`);
        await logtail.info(`Sent ${template} email to ${recipient}: ${info.response}`);
        await logtail.flush();
        resolve(true);
      }
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
        await logtail.error(error.message);
        await logtail.flush();
        resolve(false);
      } else {
        console.log(`Sent email to ${recipient}: ${info.response}`);
        await logtail.info(`Sent email to ${recipient}: ${info.response}`);
        await logtail.flush();
        resolve(true);
      }
    });
  });
};

module.exports = { sendEmail, sendEmailTemplate };
