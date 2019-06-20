require("dotenv").config();
var inquirer = require("inquirer");
var axios = require("axios");
var moment = require('moment');
var keys = require("./keys.js");

// var spotify = new Spotify(keys.spotify);

function ConcertThis() {
    inquirer.prompt([
        {
            type: "input",
            name: "artist",
            message: "Wanna hear a new dubstep song I wrote? Wub Wub! Type an artist you want to see upcoming concerts for:",
            default: "Glitch Mob"
        }
    ]).then(function (response) {
        axios.get("https://rest.bandsintown.com/artists/" + response.artist + "/events?app_id=codingbootcamp")
            .then(function (response) {
                // console.log(response.data);
                if (response.data) {
                    for (var i = 0; i < response.data.length; i++) {
                        if (response.data[i].venue.name) {
                            console.log("Name of the venue: " + response.data[i].venue.name);
                        }
                        var str = "";
                        if (response.data[i].venue.city) {
                            str = str + "Venue location: " + response.data[i].venue.city;
                        }
                        if (response.data[i].venue.region) {
                            str += ", " + response.data[i].venue.region;
                        }
                        if (response.data[i].venue.country) {
                            str += ", " + response.data[i].venue.country;
                        }
                        console.log(str + "\nDate of the Event: " + moment(response.data[i].datetime).format('LLL'));
                    }
                    Continue();
                }
                if (response.data.length < 1) {
                    console.log("Rrrrrgh...this isn't working! There are no upcoming concerts for " + response.artist + ".");
                    Continue();
                }
            }).catch(function (error) {
                if (error.response) {
                    // The request was made and the server responded with a status code
                    // that falls out of the range of 2xx
                    console.log("---------------Data---------------");
                    console.log(error.response.data);
                    console.log("---------------Status---------------");
                    console.log(error.response.status);
                    console.log("---------------Status---------------");
                    console.log(error.response.headers);
                } else if (error.request) {
                    // The request was made but no response was received
                    // `error.request` is an object that comes back with details pertaining to the error that occurred.
                    console.log(error.request);
                } else {
                    // Something happened in setting up the request that triggered an Error
                    console.log("Error", error.message);
                }
                console.log(error.config);
                Continue();
            });
    });
}



function Continue() {
    inquirer.prompt([
        {
            type: "confirm",
            name: "continue",
            message: "Would you like to continue traveller?",
            default: true
        }
    ]).then(function (response) {
        if (response.continue) {
            QuestionTheUser();
        }
        else {
            console.log("Good luck Traveller! Turning off the optics... they can't see me...");
        }
    })
}

function QuestionTheUser() {
    inquirer.prompt([
        {
            type: "list",
            name: "userChoice",
            message: "Greetings Traveller! What would you like to do?",
            choices: ["concert-this", "spotify-this-song", "movie-this", "do-what-it-says"],
            default: "concert-this"
        }
    ]).then(function (response) {
        if (response.userChoice === "concert-this") {
            ConcertThis();
        }
    });
}

QuestionTheUser();