
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;
const apicontroller = require("./controllers/api")

app.post("/", apicontroller.requestEnhancer);

app.listen(PORT, () => {
  console.log('Server is running on PORT:',PORT);
});

module.exports = app;