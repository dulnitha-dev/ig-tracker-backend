const express = require("express");
require("dotenv").config();

const checkout = require("./routes/checkout");
const planDetails = require("./utils/planDetails");

const app = express();

app.use(express.static(__dirname + "/public"));

app.use("/checkout", checkout);

app.get("/plans", (req, res) => {
  res.json(planDetails);
});

app.listen(process.env.PORT, () => {
  console.log(`Running on http://localhost:${process.env.PORT}`);
});
