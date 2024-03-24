const axios = require("axios");
const crypto = require("crypto");

const createInvoice = async (amount) => {
  const data = {
    amount: amount.toString(),
    currency: "USD",
    order_id: crypto.randomBytes(12).toString("hex"),
    url_callback: "https://ig-tracker-tsv6.onrender.com/checkout/callback",
    url_success: "https://ig-tracker-tsv6.onrender.com/checkout/success",
  };

  const sign = crypto
    .createHash("md5")
    .update(Buffer.from(JSON.stringify(data)).toString("base64") + process.env.PAYMENT_API_KEY)
    .digest("hex");

  const headers = { merchant: process.env.MERCHANT_ID, sign: sign };

  const response = await axios.post("https://api.cryptomus.com/v1/payment", data, { headers });

  return response.data;
};

module.exports = createInvoice;
