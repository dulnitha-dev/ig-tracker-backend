const router = require("express").Router();

const checkout = require("./checkout");
const token = require("./token");
const planDetails = require("../utils/planDetails");

router.get("/", (req, res) => {
  res.render("index", { title: "Homepage", plans: planDetails });
});

router.get("/feedback", (req, res) => {
  res.redirect("https://forms.gle/DzY9Ne8AgWqiLWPz5");
});

router.use("/checkout", checkout);

router.use("/token", token);

router.get("/plans", async (req, res) => {
  const ip = (req.headers["x-forwarded-for"] || req.headers["x-real-ip"]).split(",")[0];
  await global.logtail.info(`Received request from: ${ip}`);
  await global.logtail.flush();
  res.json(planDetails);
});

router.use((req, res, next) => {
  res.status(404).render("404", { title: "Page Not Found" });
});

module.exports = router;
