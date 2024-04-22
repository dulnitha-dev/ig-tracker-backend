const router = require("express").Router();

const checkout = require("./checkout");
const token = require("./token");
const planDetails = require("../utils/planDetails");
const { sendEmail } = require("../utils/sendEmail");

router.get("/", (req, res) => {
  res.render("index", { title: "Homepage", plans: planDetails });
});

router.get("/feedback", (req, res) => {
  res.redirect("https://forms.gle/DzY9Ne8AgWqiLWPz5");
});

router.use("/checkout", checkout);

router.use("/token", token);

router.get("/plans", async (req, res) => {
  const ip = req.headers["x-forwarded-for"] || req.headers["x-real-ip"];
  if (ip) await sendEmail("IG Tracker", "dulnitha.dev@gmail.com", "Got Request Ip", `RequestIp: ${ip}`);
  res.json(planDetails);
});

router.use((req, res, next) => {
  res.status(404).render("404", { title: "Page Not Found" });
});

module.exports = router;
