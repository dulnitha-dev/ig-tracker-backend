const router = require("express").Router();

const checkout = require("./checkout");
const token = require("./token");
const planDetails = require("../utils/planDetails");

const logRequest = async (req) => {
  const ip = (req.headers["x-forwarded-for"] || req.headers["x-real-ip"] || "").split(",")[0];
  await logtail.info(`Requested ${req} from: ${ip}`);
  await logtail.flush();
  console.log(`Requested ${req.path} from: ${ip}`);
};

router.get("/", (req, res) => {
  logRequest(req);
  res.render("index", { title: "Homepage", plans: planDetails });
});

router.get("/feedback", (req, res) => {
  logRequest(req);
  res.redirect("https://forms.gle/DzY9Ne8AgWqiLWPz5");
});

router.use("/checkout", checkout);

router.use("/token", token);

router.get("/plans", async (req, res) => {
  logRequest(req);
  res.json(planDetails);
});

router.use((req, res, next) => {
  res.status(404).render("404", { title: "Page Not Found" });
});

module.exports = router;
