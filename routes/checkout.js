const router = require("express").Router();

router.get("/", (req, res) => {
  res.send("Check Out");
});

router.get("/callback", (req, res) => {
  res.send("Callback");
});

module.exports = router;
