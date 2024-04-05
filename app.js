const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const session = require("express-session");
const flash = require("express-flash");
require("dotenv").config();

const checkout = require("./routes/checkout");
const token = require("./routes/token");
const planDetails = require("./utils/planDetails");
const { connectDB } = require("./utils/dbActions");

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
    secret: process.env.SECRET_KEY,
    saveUninitialized: true,
    resave: true,
  })
);
app.use(flash());

/*
Chat intergration
*/

app.get("/", (req, res) => {
  res.render("index", { title: "Homepage" });
});

app.use("/checkout", checkout);

app.use("/token", token);

app.get("/plans", (req, res) => {
  res.json(planDetails);
});

app.use((req, res, next) => {
  res.status(404).render("404", { title: "Page Not Found" });
});

app.listen(process.env.PORT, () => {
  console.log(`Running on http://localhost:${process.env.PORT}`);
  connectDB();
});
