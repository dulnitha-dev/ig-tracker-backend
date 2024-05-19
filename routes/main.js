const router = require("express").Router();

const checkout = require("./checkout");
const token = require("./token");
const planDetails = require("../utils/planDetails");

const getIp = (req) => {
  return (req.headers["x-forwarded-for"] || req.headers["x-real-ip"] || "").split(",")[0];
};

router.get("/", async (req, res) => {
  await logtail.info(`${getIp(req)} viewed homepage`);
  await logtail.flush();
  res.render("index", { title: "Homepage", plans: planDetails });
});

router.get("/feedback", async (req, res) => {
  await logtail.info(`${getIp(req)} uninstalled`);
  await logtail.flush();
  res.redirect("https://forms.gle/DzY9Ne8AgWqiLWPz5");
});

router.use("/checkout", checkout);

router.use("/token", token);

router.get("/plans", async (req, res) => {
  await logtail.info(`${getIp(req)} used app on account id ${req.headers["x-id"]}`);
  await logtail.flush();
  res.json(planDetails);
});

router.use((req, res, next) => {
  res.status(404).render("404", { title: "Page Not Found" });
});

module.exports = router;
