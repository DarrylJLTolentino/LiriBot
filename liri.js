require("dotenv").config();
var inquire = require("inquire");
var axios = require("axios");
var moment = require('moment');

var keys = require("./keys.js");

var spotify = new Spotify(keys.spotify);