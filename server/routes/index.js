const fs = require("fs");
const router = require("express").Router();

const Files = fs
  .readdirSync("./server/routes")
  .filter((file) => file.endsWith(".js"));

for (const file of Files) {
  const route = require(`./${file}`);
  const path = file.split(".")[0];
  if (path === "index") continue;
  console.log(`[SERVER] Found ${path}`);
  router.use(`/${path}`, route);
}

router.get("/", (req, res, next) => {
  res.send("Its not safe here!");
});

module.exports = router;
