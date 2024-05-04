const { client } = require("../../../bot");
const auth = require("../../middlewares/auth");

const router = require("express").Router();

router.use(auth)

router.get("/", async (req, res, next) => {
  try {
    res.status(400).json({ message: "Try again with params" });
  } catch (error) {
    res.status(error.status || 500).json(error);
  }
});

router.get("/:id", async (req, res, next) => {
  const id = req.params["id"];
  try {
    const user = await client.users.fetch(id);
    res.status(200).json(user);
  } catch (error) {
    res.status(error.status || 500).json(error);
  }
});

module.exports = router;
