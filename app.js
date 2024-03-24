const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const session = require("express-session");
require("dotenv").config();

const checkout = require("./routes/checkout");
const token = require("./routes/token");
const planDetails = require("./utils/planDetails");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set("json spaces", 4);

app.use(express.static(__dirname + "/public"));

app.use(expressLayouts);
app.set("layout", "./layout");
app.set("view engine", "ejs");

app.use(
  session({
    secret: "mysecretkey",
    saveUninitialized: true,
    resave: true,
  })
);

app.get("/", (req, res) => {
  res.render("index", { title: "Homepage" });
});

app.get("/pricing", (req, res) => {
  res.render("pricing", { title: "Pricing", plans: planDetails });
});

app.use("/checkout", checkout);

app.use("/token", token);

app.get("/plans", (req, res) => {
  res.json(planDetails);
});

app.listen(process.env.PORT, () => {
  console.log(`Running on http://localhost:${process.env.PORT}`);
});
