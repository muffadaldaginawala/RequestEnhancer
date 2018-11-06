
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const routes = require("./routes/router.js");
// const UserRoute = require('./UserRoute');
routes(app);

const PORT = process.env.PORT || 3000;

// const redis = require('redis');
// const REDIS_PORT = process.env.REDIS_PORT;
// const client = redis.createClient(REDIS_PORT);
// client(app);


app.listen(PORT, () => {
  console.log('Server is running on PORT:',PORT);
});

module.exports = app;