const express = require("express");
const dotenv = require("dotenv");
const app = express();

dotenv.config({ path: "./.env" });
require("./db/conn");

const PORT = 4000 || process.env.PORT;

app.get("/", (req, res) => {
  res.send("DSA101 Home");
});

app.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});
