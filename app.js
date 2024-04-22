const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const { Logtail } = require("@logtail/node");
require("dotenv").config();

const router = require("./routes/main");
const { connectDB } = require("./utils/dbActions");

const app = express();

global.baseUrl = "https://ig-tracker.fpr.net/";
global.logtail = new Logtail(process.env.LOGTAIL_TOKEN);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set("json spaces", 4);

app.use(expressLayouts);
app.set("layout", "./layout");

app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

app.use(router);

app.listen(process.env.PORT, () => {
  console.log(`Running on http://localhost:${process.env.PORT}`);
  connectDB();
});
