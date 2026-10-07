const express = require("express");
const graphRoutes = require("./routes/graphRoutes");

const app = express();

app.use(express.json());
app.use(express.static("public"));
app.use(graphRoutes);

module.exports = app;
