const router = require("express").Router();
const axios = require("axios");

router.get("/:imageUrl/*", async (req, res) => {
  const imageUrl = req.url.slice(1);
  const response = await axios.get(imageUrl, { responseType: "stream" });
  response.data.pipe(res);
});

// app.get("/image", async (req, res) => {
//   request({ url: imageUrl, encoding: null }, (err, resp, buffer) => {
//     if (!err && resp.statusCode === 200) {
//       res.set("Content-Type", "image/jpeg");
//       res.send(resp.body);
//     }
//   });
// });

module.exports = router;
