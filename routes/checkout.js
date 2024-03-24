const router = require("express").Router();
const uuid = require("uuid");

const planDetails = require("../utils/planDetails");
const paymentApi = require("../utils/paymentApi");
const { insertToken, findToken, updateToken } = require("../utils/dbActions");

router.get("/plan:id", (req, res) => {
  const plan = planDetails[req.params.id - 1];
  res.render("checkout", { title: "Checkout", plan: plan, token: req.session.token });
});

router.post("/", async (req, res) => {
  const plan = planDetails[req.body.planId - 1];

  const tokenDocs = await findToken({ email: req.body.email });
  const tokenDoc = tokenDocs.length && tokenDocs[0];

  if (tokenDoc && tokenDoc.token && new Date(tokenDoc.expire) > new Date() && req.body.force == false) {
    req.session.token = true;
    res.json({});
    return;
  }

  // Create Invoice
  sucessUrl = "checkout/sucess?email=";

  res.json({ url: "pay" });
});

router.get("/callback", async (req, res) => {
  const validMonths = 3;
  const email = "dul@gmail.com";

  if (true) {
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
  res.send("Callback");
});

router.get("/sucess", async (req, res) => {
  const tokenDocs = (await findToken({ email: req.query.email, viewed: false })) || [];
  tokenDocs.sort((a, b) => (new Date(a.created) > new Date(b.created) ? -1 : 1));
  const tokenDoc = tokenDocs.length && tokenDocs[0];

  if (!tokenDoc) {
    res.status(404).send();
    return;
  }

  const newDoc = tokenDoc;
  delete newDoc._id;
  await updateToken(tokenDoc, { ...newDoc, viewed: true });

  req.session.tokenDoc = tokenDoc;
  res.redirect("/token/view");
});

module.exports = router;
