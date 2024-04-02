const router = require("express").Router();
const uuid = require("uuid");

const planDetails = require("../utils/planDetails");
const createInvoice = require("../utils/paymentApi");
const { insertToken, findToken, updateToken } = require("../utils/dbActions");

router.get("/plan:id", (req, res) => {
  const plan = planDetails[req.params.id - 1];
  res.render("checkout", { title: "Checkout", plan: plan, token: req.flash("token")[0] || false });
});

router.post("/", async (req, res) => {
  const plan = planDetails[req.body.planId - 1];

  const tokenDocs = await findToken({ email: req.body.email });
  const tokenDoc = tokenDocs.length && tokenDocs[0];

  if (tokenDoc && tokenDoc.token && new Date(tokenDoc.expire) > new Date() && req.body.force == false) {
    req.flash("token", true);
    res.json({});
    return;
  }

  req.session.email = req.body.email;

  const response = await createInvoice(req.body.email, plan.price);
  console.log("Response:-", response);
  res.json({ url: response.data.invoice_url });
});

router.all("/callback", async (req, res) => {
  console.log("Callback Received");
  const validMonths = 3;
  const email = req.session.email;

  if (false) {
    const date = new Date();
    const tokenDoc = {
      token: uuid.v4(),
      email: email,
      created: new Date(),
      expire: date.setMonth(date.getMonth() + validMonths),
      viewed: false,
      order_id: null,
    };

    const footprint = await insertToken(tokenDoc);
  }

  console.log("Callback:", req);
  console.log("Callback body:", req.body);
  console.log("Callback params:", req.params);
  console.log("Callback query:", req.query);

  res.send("Callback");
});

router.get("/sucess", async (req, res) => {
  const tokenDocs = (await findToken({ email: req.query.email, viewed: false })) || [];
  tokenDocs.sort((a, b) => (new Date(a.created) > new Date(b.created) ? -1 : 1));
  const tokenDoc = tokenDocs.length && tokenDocs[0];

  if (!tokenDoc) {
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
