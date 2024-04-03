const router = require("express").Router();
const crypto = require("crypto");
const uuid = require("uuid");

const planDetails = require("../utils/planDetails");
const createInvoice = require("../utils/paymentApi");
const { insertToken, findToken, updateToken, findInvoice, updateInvoice } = require("../utils/dbActions");

router.get("/plan:id", (req, res) => {
  const plan = planDetails[req.params.id - 1];
  res.render("checkout", { title: "Checkout", plan: plan, token: req.flash("token")[0] || false });
});

router.post("/", async (req, res) => {
  const plan = planDetails[req.body.planId - 1];

  const [tokenDoc] = (await findToken({ email: req.body.email })) || [];

  if (tokenDoc && tokenDoc.token && new Date(tokenDoc.expire) > new Date() && req.body.force == false) {
    req.flash("token", true);
    res.json({});
    return;
  }

  const response = await createInvoice(req.body.email, plan);
  res.json({ url: response.data.invoice_url });
});

const verifyCallback = (req, res, next) => {
  const data = req.body;
  const secretKey = process.env.API_KEY;

  console.log("Verifying callback");

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
  console.log("Callback body:", data);

  const [invoiceDoc] = (await findInvoice({ order_number: data.order_number })) || [];
  const newInvoiceDoc = { ...invoiceDoc, ...data };
  const footprint = await updateInvoice({ order_number: data.order_number }, newInvoiceDoc);

  if (data.status === "completed" || data.status === "mismatch" || data.status === "expired") {
    if (data.status === "expired") console.log("Fake success");
    const validMonths = invoiceDoc.plan.validMonths;
    const email = invoiceDoc.email;
    const orderNum = invoiceDoc.order_number;
    const date = new Date();

    const tokenDoc = {
      token: uuid.v4(),
      email: email,
      created: new Date(),
      expire: date.setMonth(date.getMonth() + validMonths),
      viewed: false,
      order_number: orderNum,
    };
    const footprint = await insertToken(tokenDoc);
  }
});

router.get("/sucess", async (req, res) => {
  const csrfToken = crypto
    .createHash("sha256")
    .update(Buffer.from(JSON.stringify({ email: req.query.email })).toString("base64"))
    .digest("hex");

  const tokenDocs = (await findToken({ email: req.query.email, viewed: false })) || [];
  tokenDocs.sort((a, b) => (new Date(a.created) > new Date(b.created) ? -1 : 1));
  const [tokenDoc] = tokenDocs;

  if (!tokenDoc || req.query.csrf !== csrfToken) {
    res.status(404).render("404", { title: "Page Not Found" });
    return;
  }

  const newDoc = tokenDoc;
  delete newDoc._id;
  await updateToken(tokenDoc, { ...newDoc, viewed: true });

  req.session.tokenDoc = tokenDoc;
  res.redirect("/token/view");
});

module.exports = router;
