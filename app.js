const express = require("express");
const expressLayouts = require("express-ejs-layouts");
require("dotenv").config();

const { Logtail } = require("@logtail/node");
const logtail = new Logtail("sRBk6hMoi8YQBW6CKanunY2Z");

const checkout = require("./routes/checkout");
const token = require("./routes/token");
const planDetails = require("./utils/planDetails");
const { connectDB } = require("./utils/dbActions");

const app = express();

global.baseUrl = "https://ig-tracker.fpr.net/";

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set("json spaces", 4);

app.use(expressLayouts);
app.set("layout", "./layout");

app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  res.render("index", { title: "Homepage", plans: planDetails });
});

app.get("/feedback", (req, res) => {
  res.redirect("https://forms.gle/DzY9Ne8AgWqiLWPz5");
});

app.use("/checkout", checkout);

app.use("/token", token);

app.get("/plans", (req, res) => {
  logtail.info({ reqIp: req.ip, reqIps: req.ips });
  res.json(planDetails);
});

app.use((req, res, next) => {
  res.status(404).render("404", { title: "Page Not Found" });
});

app.listen(process.env.PORT, () => {
  console.log(`Running on http://localhost:${process.env.PORT}`);
  connectDB();
});
