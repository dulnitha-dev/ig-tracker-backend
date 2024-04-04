const axios = require("axios");
const crypto = require("crypto");
require("dotenv").config();

const { insertInvoice } = require("./dbActions");

const currency = "USD";

const createInvoice = async (email, plan) => {
  const csrfToken = crypto
    .createHash("sha256")
    .update(Buffer.from(JSON.stringify({ email: email })).toString("base64"))
    .digest("hex");

  const baseUrl = "https://ig-tracker.cbu.net";
  const callbackUrl = `${baseUrl}/checkout/callback?json=true`;
  const successUrl = `${baseUrl}/checkout/success?json=true&email=${email}&csrf=${csrfToken}`;

  const url = "https://api.plisio.net/api/v1/invoices/new";
  const params = {
    order_number: crypto.randomBytes(12).toString("hex"),
    order_name: plan.name + " Plan",
    source_currency: currency,
    source_amount: plan.price,
    callback_url: callbackUrl,
    success_callback_url: successUrl,
    fail_callback_url: baseUrl,
    email: email,
    api_key: process.env.API_KEY,
  };

  const invoice = { ...params, plan: plan };
  await insertInvoice(invoice);

  const response = await axios.get(url, { params: params });
  return response.data;
};

module.exports = createInvoice;
