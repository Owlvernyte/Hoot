const express = require("express");
const cors = require("cors");
const { port } = require("../config.json");
const app = express();
const PORT = process.env.PORT || port || 80;
const routes = require("./routes");

app.use(cors());

app.use("/api", routes);

app.listen(PORT, (err) => {
  if (err) return console.log(`[SERVER] ${err.message}`);
  console.log(`[SERVER] Listening on port ${PORT}`);
});
