const router = require("express").Router();

const { findToken } = require("../utils/dbActions");
const sendEmail = require("../utils/sendEmail");

router.get("/view", async (req, res) => {
  const tokenDoc = req.session.tokenDoc;
  if (tokenDoc) res.render("token", { title: "Token", token: tokenDoc });
  else res.redirect("/");
});

router.get("/resend", (req, res) => {
  res.render("resend", { title: "Resend Token", msg: req.flash("msg")[0] || null });
});

router.post("/resend", async (req, res) => {
  const tokenDocs = (await findToken({ email: req.body.email })) || [];
  tokenDocs.sort((a, b) => (new Date(a.created) > new Date(b.created) ? -1 : 1));
  const [tokenDoc] = tokenDocs;

  if (tokenDoc && new Date(tokenDoc.expire) > new Date()) {
    await sendEmail("IG Tracker", tokenDoc.email, "IG Tracker Token", "resend", {
      baseUrl: "https://ig-tracker.cbu.net/",
      tokenDoc: tokenDoc,
    });

    req.flash("msg", { message: "Check your email", type: "text-green-500" });
  } else {
    req.flash("msg", { message: "You don't have a valid token", type: "text-red-500" });
  }

  res.json({});
});

router.post("/create", async (req, res) => {
  if (req.body.key !== "") {
    res.status(400).send();
    return;
  }
  const validMonths = req.body.validMonths;
  const email = req.body.email;
  const date = new Date();

  const tokenDoc = {
    token: uuid.v4(),
    email: email,
    created: new Date(),
    expire: date.setMonth(date.getMonth() + validMonths),
    viewed: false,
    order_number: null,
  };
  await insertToken(tokenDoc);

  await sendEmail("IG Tracker", tokenDoc.email, "IG Tracker Token", "resend", {
    baseUrl: "https://ig-tracker.cbu.net/",
    tokenDoc: tokenDoc,
  });
  res.json(tokenDoc);
});

router.post("/verify", async (req, res) => {
  const [tokenDoc] = (await findToken({ token: req.body.token })) || [];

  if (tokenDoc && new Date(tokenDoc.expire) > new Date()) {
    res.json({ valid: true });
  } else {
    res.json({ valid: false });
  }
});

module.exports = router;
