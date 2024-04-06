const router = require("express").Router();
const uuid = require("uuid");

const { insertToken, findToken } = require("../utils/dbActions");
const { sendEmailTemplate } = require("../utils/sendEmail");

router.post("/create", async (req, res) => {
  if (req.body.key !== process.env.SECRET_KEY) {
    res.status(404).render("404", { title: "Page Not Found" });
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
    order_number: null,
  };
  await insertToken(tokenDoc);

  await sendEmailTemplate("IG Tracker", tokenDoc.email, "Payment Successfull", "success", {
    baseUrl: baseUrl,
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
