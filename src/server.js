const express = require("express");
const app = express();
const cookies = require("cookie-parser");
const path = require("path");
const port = process.env.PORT || 3000;
const apiRouter = require("./apiRoutes");
const studRouter = require("./studRoutes");
const facultyRouter = require("./facultyRoutes");
const annRouter = require("./annRoutes");
const groupRouter = require("./groupRoutes");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

app.use(cookies());
app.use(express.static(path.join(__dirname, "app")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", apiRouter);
app.use("/stud", studRouter);
app.use("/faculty", facultyRouter);
app.use("/ann", annRouter);
app.use("/group", groupRouter);

app.get("/:name", (req, res) => {
  const name = req.params.name;
  let fileName = `app/${name}.html`;
  res.sendFile(path.join(__dirname, fileName));
});

app.listen(port, (err) => {
  if (!err) {
    console.log("App has started");
  } else {
    console.error(`Err: ${err}`);
  }
});
