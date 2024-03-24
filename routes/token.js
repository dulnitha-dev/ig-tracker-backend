const router = require("express").Router();

const { findToken } = require("../utils/dbActions");

router.get("/view", async (req, res) => {
  const tokenDoc = req.session.tokenDoc;
  if (tokenDoc) res.render("token", { title: "Token", token: tokenDoc });
  else res.status(404).send();
});

router.get("/resend", (req, res) => {
  res.render("resend", { title: "Resend" });
});

router.post("/resend", (req, res) => {
  // Send Email
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
