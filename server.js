const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const request= require("request");

//scraping tools 
// const axios = require("axios");
// const cheerio = require("cheerio");

//requiring all models
var db = require("./models")
var PORT = process.env.PORT || 3000;

//initialize Express
var app = express();

//morgan logger for logging request
app.use(logger("dev"));

//use body-parser for form submissions
app.use(bodyParser.urlencoded({
    extended: true
}));

//making "public" a static directory
app.use(express.static("public"));

//connect to mongoose db
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/nbaFantasyBasketballNews";
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI, {
    // useMongoClient: true
});

//setting handlebars
const exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({defaultLayout: "main"}));
app.set("view engine", "handlebars");

var routeHandler = require("./controllers/routes");
routeHandler(app, db);
// starts the server
app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});