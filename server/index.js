const express = require("express");
const fileRoute = require("./routes/file");
const path = require("path");
require("./db/db");

const app = express();

app.use(express.static(path.join(__dirname, "..", "build")));
app.use(fileRoute);

app.listen(3030, () => {
  console.log("server started on port 3030");
});
