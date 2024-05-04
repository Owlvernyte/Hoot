const numeral = require("numeral");
const { client } = require("../../../bot");

const router = require("express").Router();

router.get("/", async (req, res, next) => {
  try {
    const { uptime } = client;
    res.json({
      ms: uptime,
      string: `${numeral(uptime / 1000).format("00:00:00")}`,
    });
  } catch (error) {
    res.status(error?.status || 500).json(error || error?.message);
  }
});

module.exports = router;
