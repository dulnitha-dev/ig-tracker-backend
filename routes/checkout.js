const router = require("express").Router();
const crypto = require("crypto");
const uuid = require("uuid");

const planDetails = require("../utils/planDetails");
const createInvoice = require("../utils/paymentApi");
const { insertToken, findToken, findInvoice, updateInvoice } = require("../utils/dbActions");
const { sendEmailTemplate } = require("../utils/sendEmail");

router.get("/", (req, res) => {
  const plan = planDetails[req.query.plan - 1];
  plan
    ? res.render("checkout", { title: "Checkout", plan: plan })
    : res.status(404).render("404", { title: "Page Not Found" });
});

router.post("/", async (req, res) => {
  const [tokenDoc] = (await findToken({ email: req.body.email })) || [];
  const plan = planDetails[req.body.planId - 1];
  const payUrl = `${baseUrl}checkout/create/?email=${req.body.email}&planId=${req.body.planId}`;

  let success;

  if (tokenDoc && tokenDoc.token && new Date(tokenDoc.expire) > new Date()) {
    success = await sendEmailTemplate("IG Tracker", req.body.email, "Already Have a Token", "resend", {
      baseUrl: baseUrl,
      tokenDoc: tokenDoc,
      payUrl: payUrl,
      plan: plan,
    });
  } else {
    success = await sendEmailTemplate("IG Tracker", req.body.email, "Continue Payment", "payment", {
      baseUrl: baseUrl,
      payUrl: payUrl,
      plan: plan,
    });
  }
  res.json({ success: success });
});

router.get("/create", async (req, res) => {
  res.render("redirect", { title: "Redirect" });
});

router.post("/create", async (req, res) => {
  const plan = planDetails[req.body.planId - 1];
  const response = await createInvoice(req.body.email, plan);
  res.json({ url: response.data.invoice_url });
});

const verifyCallback = (req, res, next) => {
  const data = req.body;
  const secretKey = process.env.API_KEY;

  if (data && data.verify_hash) {
    const ordered = { ...data };
    delete ordered.verify_hash;
    const string = JSON.stringify(ordered);
    const hmac = crypto.createHmac("sha1", secretKey);
    hmac.update(string);
    const hash = hmac.digest("hex");
    if (hash === data.verify_hash) next();
    else res.status(400).send("Invalid hash");
  } else res.status(400).send("Invalid payload");
};

router.post("/callback", verifyCallback, async (req, res) => {
  const data = req.body;

  const [invoiceDoc] = (await findInvoice({ order_number: data.order_number })) || [];
  const newInvoiceDoc = { ...invoiceDoc, ...data };
  delete newInvoiceDoc._id;

  if (invoiceDoc && !invoiceDoc.token && (data.status === "completed" || data.status === "mismatch")) {
    const validMonths = invoiceDoc.plan.validMonths;
    const email = invoiceDoc.email;
    const orderNum = invoiceDoc.order_number;
    const date = new Date();

    const tokenDoc = {
      token: uuid.v4(),
      email: email,
      created: new Date(),
      expire: date.setMonth(date.getMonth() + validMonths),
      order_number: orderNum,
    };
    await insertToken(tokenDoc);

    newInvoiceDoc.token = tokenDoc.token;

    await sendEmailTemplate("IG Tracker", tokenDoc.email, "Payment Successfull", "success", {
      baseUrl: baseUrl,
      tokenDoc: tokenDoc,
    });
  }

  await updateInvoice({ order_number: data.order_number }, newInvoiceDoc);
  res.status(200).send();
});

module.exports = router;
