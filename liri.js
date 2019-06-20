require("dotenv").config();
var inquirer = require("inquirer");
var axios = require("axios");
var moment = require('moment');
var keys = require("./keys.js");
var Spotify = require("node-spotify-api");

var spotify = new Spotify(keys.spotify);

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

function SpotifyThisSong() {
    inquirer.prompt([
        {
            type: "input",
            name: "track",
            message: "Hey, check me out everybody! I'm dancin', I'm dancin'! Type in a song name!",
            default: "The Sign"
        }
    ]).then(function (response) {
        spotify.search({ type: 'track', query: response.track, market: 'US', limit: 1 }, function (err, data) {
            if (err) {
                return console.log('Error occurred: ' + err);
            }
            console.log(JSON.stringify(data, null, 4));
            console.log("Artist: " + JSON.stringify(data.tracks.items[0].album.artists[0].name));
            console.log("Track Name: " + JSON.stringify(data.tracks.items[0].name));
            console.log("Album Name: " + JSON.stringify(data.tracks.items[0].album.name));
            if (data.tracks.items[0].preview_url !== null) {
                console.log("Preview URL: " + JSON.stringify(data.tracks.items[0].preview_url))
            }
            else{
                console.log("I'm detecting a motor unit malfunction... I can't move! I'm paralyzed with fear! \nPreview URL is unfortunately not found!");
            }
            Continue();
        });
    })
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
        else if (response.userChoice === "spotify-this-song") {
            SpotifyThisSong();
        }
    });
}

QuestionTheUser();