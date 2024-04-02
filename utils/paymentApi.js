const axios = require("axios");
const crypto = require("crypto");
require("dotenv").config();

const currency = "USD";
const baseUrl = "https://ig-tracker.cbu.net";

const createInvoice = async (email, amount) => {
  const url = "https://api.plisio.net/api/v1/invoices/new";
  const params = {
    order_number: crypto.randomBytes(12).toString("hex"),
    order_name: crypto.randomBytes(4).toString("hex"), // Name
    description: "", // Description
    source_currency: currency,
    source_amount: amount,
    callback_url: baseUrl + "/checkout/callback?json=true",
    success_callback_url: baseUrl + "/checkout/success?json=true",
    fail_callback_url: baseUrl,
    email: email,
    api_key: process.env.API_KEY,
  };
  const response = await axios.get(url, { params: params });
  return response.data;
};

module.exports = createInvoice;
