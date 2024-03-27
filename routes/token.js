const router = require("express").Router();

const { findToken } = require("../utils/dbActions");

router.get("/view", async (req, res) => {
  const tokenDoc = req.session.tokenDoc;
  if (tokenDoc) res.render("token", { title: "Token", token: tokenDoc });
  else res.status(404).render("404", { title: "Page Not Found" });
});

router.get("/resend", (req, res) => {
  res.render("resend", { title: "Resend Token", msg: req.flash("msg")[0] || null });
});

router.post("/resend", async (req, res) => {
  const tokenDocs = (await findToken({ email: req.body.email })) || [];
  tokenDocs.sort((a, b) => (new Date(a.created) > new Date(b.created) ? -1 : 1));
  const tokenDoc = tokenDocs.length && tokenDocs[0];

  if (tokenDoc && new Date(tokenDoc.expire) > new Date()) {
    // Send Email
    req.flash("msg", { message: "Check your email", type: "text-green-500" });
  } else {
    req.flash("msg", { message: "You don't have a valid token", type: "text-red-500" });
  }

  res.json({});
});

router.post("/verify", async (req, res) => {
  let tokenDoc = await findToken({ token: req.body.token });
  if (tokenDoc.length) tokenDoc = tokenDoc[0];

  if (tokenDoc && new Date(tokenDoc.expire) < new Date()) {
    res.json({ valid: true });
  } else {
    res.json({ valid: false });
  }
});

module.exports = router;
