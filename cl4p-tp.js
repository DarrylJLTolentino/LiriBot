require("dotenv").config();
var inquirer = require("inquirer");
var axios = require("axios");
var moment = require('moment');
var keys = require("./keys.js");
var Spotify = require("node-spotify-api");
var fs = require("fs");

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
                        fs.appendFile("log.txt", str + "\nDate of the Event: " + moment(response.data[i].datetime).format('LLL') + "\n", function (err) {
                            if (err) {
                                console.log(err)
                            }
                        });
                    }
                    Continue();
                }
                if (response.data.length < 1) {
                    console.log("Rrrrrgh...this isn't working! There are no upcoming concerts for " + response.artist + ".");
                    fs.appendFile("Rrrrrgh...this isn't working! There are no upcoming concerts for " + response.artist + ".\n", function (err) {
                        if (err) {
                            console.log(err)
                        }
                    });
                    Continue();
                }
            }).catch(function (error) {
                if (error.response) {
                    console.log("---------------Data---------------");
                    console.log(error.response.data);
                    console.log("---------------Status---------------");
                    console.log(error.response.status);
                    console.log("---------------Status---------------");
                    console.log(error.response.headers);
                    fs.appendFile("log.txt", error.response.data + "\n" + error.response.status + "\n" + error.response.headers + "\n", function (err) {
                        if (err) {
                            console.log(err)
                        }
                    });
                } else if (error.request) {
                    console.log(error.request);
                    fs.appendFile("log.txt", error.request + "\n", function (err) {
                        if (err) {
                            console.log(err)
                        }
                    });
                } else {
                    console.log("Error", error.message);
                    fs.appendFile("log.txt", error.message + "\n", function (err) {
                        if (err) {
                            console.log(err)
                        }
                    });
                }
                console.log(error.config);
                fs.appendFile("log.txt", error.config + "\n", function (err) {
                    if (err) {
                        console.log(err)
                    }
                });
                Continue();
            });
    });
}

function SpotifyThisSong() {
    inquirer.prompt([
        {
            type: "input",
            name: "track",
            message: "Hey, check me out everybody! I'm dancin', I'm dancin'! Type in a song name:",
            default: "The Sign"
        }
    ]).then(function (response) {
        spotify.search({ type: 'track', query: response.track, market: 'US', limit: 1 }, function (err, data) {
            if (err) {
                return console.log('Error occurred: ' + err);
            }
            var dataStr = "";
            // console.log(JSON.stringify(data, null, 4));
            for (var i = 0; i < data.tracks.items.length; i++) {
                dataStr = dataStr + "Artist: " + JSON.stringify(data.tracks.items[i].album.artists[0].name);
                dataStr += "\nTrack Name: " + JSON.stringify(data.tracks.items[i].name);
                dataStr += "\nAlbum Name: " + JSON.stringify(data.tracks.items[i].album.name);
                if (data.tracks.items[i].preview_url !== null) {
                    dataStr += "\nPreview URL: " + JSON.stringify(data.tracks.items[i].preview_url);
                }
                else {
                    dataStr += "\nI'm detecting a motor unit malfunction... I can't move! I'm paralyzed with fear! \nPreview URL is unfortunately not found!";
                }
                console.log(dataStr)
            }
            fs.appendFile("log.txt", dataStr + "\n", function (err) {
                if (err) {
                    console.log(err)
                }
            });
            Continue();
        });
    })
}

function MovieThis() {
    inquirer.prompt([
        {
            type: "input",
            name: "movie",
            message: "This is just a recording of someone breathing! It's not real! It's just making me more nervous! \nType a movie name to search:",
            default: "Mr. Nobody"
        }
    ]).then(function (response) {
        axios.get("http://www.omdbapi.com/?t=" + response.movie + "&y=&plot=short&apikey=trilogy").then(
            function (response) {
                // console.log(response.data);
                var dataStr = "";
                dataStr = dataStr + "Title: " + response.data.Title;
                dataStr += "\nYear Released: " + response.data.Year;
                dataStr += "\nIMDb Rating: " + response.data.Ratings[1].Value;
                dataStr += "\nCountry(s) where movie was produced: " + response.data.Country;
                dataStr += "\nLanguage(s): " + response.data.Language;
                dataStr += "\nPlot: " + response.data.Plot;
                dataStr += "\nActors: " + response.data.Actors;
                console.log(dataStr);
                fs.appendFile("log.txt", dataStr + "\n", function (err) {
                    if (err) {
                        console.log(err)
                    }
                });
                Continue();
            }).catch(function (error) {
                if (error.response) {
                    console.log("---------------Data---------------");
                    console.log(error.response.data);
                    console.log("---------------Status---------------");
                    console.log(error.response.status);
                    console.log("---------------Status---------------");
                    console.log(error.response.headers);
                    fs.appendFile("log.txt", error.response.data + "\n" + error.response.status + "\n" + error.response.headers + "\n", function (err) {
                        if (err) {
                            console.log(err)
                        }
                    });
                } else if (error.request) {
                    console.log(error.request);
                    fs.appendFile("log.txt", error.request + "\n", function (err) {
                        if (err) {
                            console.log(err)
                        }
                    });
                } else {
                    console.log("Error", error.message);
                    fs.appendFile("log.txt", error.message + "\n", function (err) {
                        if (err) {
                            console.log(err)
                        }
                    });
                }
                console.log(error.config);
                fs.appendFile("log.txt", error.config + "\n", function (err) {
                    if (err) {
                        console.log(err)
                    }
                });
                Continue();
            });
    })
}

function DoWhatItSays() {
    fs.readFile("random.txt", "utf8", function (err, data) {
        if (err) {
            return console.log(err);
        }
        var dataArr = data.split("\r\n");
        var randomNum = Math.floor(Math.random() * 3);
        var doThis = dataArr[randomNum].split(",");
        console.log(doThis);
        if (doThis[0] === "concert-this") {
            axios.get("https://rest.bandsintown.com/artists/" + doThis[1] + "/events?app_id=codingbootcamp")
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
                            fs.appendFile("log.txt", str + "\nDate of the Event: " + moment(response.data[i].datetime).format('LLL') + "\n", function (err) {
                                if (err) {
                                    console.log(err)
                                }
                            });
                        }
                        Continue();
                    }
                    if (response.data.length < 1) {
                        console.log("Rrrrrgh...this isn't working! There are no upcoming concerts for " + response.artist + ".");
                        fs.appendFile("Rrrrrgh...this isn't working! There are no upcoming concerts for " + response.artist + ".\n", function (err) {
                            if (err) {
                                console.log(err)
                            }
                        });
                        Continue();
                    }
                }).catch(function (error) {
                    if (error.response) {
                        console.log("---------------Data---------------");
                        console.log(error.response.data);
                        console.log("---------------Status---------------");
                        console.log(error.response.status);
                        console.log("---------------Status---------------");
                        console.log(error.response.headers);
                        fs.appendFile("log.txt", error.response.data + "\n" + error.response.status + "\n" + error.response.headers + "\n", function (err) {
                            if (err) {
                                console.log(err)
                            }
                        });
                    } else if (error.request) {
                        console.log(error.request);
                        fs.appendFile("log.txt", error.request + "\n", function (err) {
                            if (err) {
                                console.log(err)
                            }
                        });
                    } else {
                        console.log("Error", error.message);
                        fs.appendFile("log.txt", error.message + "\n", function (err) {
                            if (err) {
                                console.log(err)
                            }
                        });
                    }
                    console.log(error.config);
                    fs.appendFile("log.txt", error.config + "\n", function (err) {
                        if (err) {
                            console.log(err)
                        }
                    });
                    Continue();
                });
        }
        if (doThis[0] === "spotify-this-song") {
            spotify.search({ type: 'track', query: doThis[1], market: 'US', limit: 1 }, function (err, data) {
                if (err) {
                    return console.log('Error occurred: ' + err);
                }
                var dataStr = "";
                // console.log(JSON.stringify(data, null, 4));
                for (var i = 0; i < data.tracks.items.length; i++) {
                    dataStr = dataStr + "Artist: " + JSON.stringify(data.tracks.items[i].album.artists[0].name);
                    dataStr += "\nTrack Name: " + JSON.stringify(data.tracks.items[i].name);
                    dataStr += "\nAlbum Name: " + JSON.stringify(data.tracks.items[i].album.name);
                    if (data.tracks.items[i].preview_url !== null) {
                        dataStr += "\nPreview URL: " + JSON.stringify(data.tracks.items[i].preview_url);
                    }
                    else {
                        dataStr += "\nI'm detecting a motor unit malfunction... I can't move! I'm paralyzed with fear! \nPreview URL is unfortunately not found!";
                    }
                    console.log(dataStr)
                }
                fs.appendFile("log.txt", dataStr + "\n", function (err) {
                    if (err) {
                        console.log(err)
                    }
                });
                Continue();
            });
        }
        if (doThis[0] === "movie-this") {
            axios.get("http://www.omdbapi.com/?t=" + doThis[1] + "&y=&plot=short&apikey=trilogy").then(
                function (response) {
                    var dataStr = "";
                    dataStr = dataStr + "Title: " + response.data.Title;
                    dataStr += "\nYear Released: " + response.data.Year;
                    dataStr += "\nIMDb Rating: " + response.data.Ratings[1].Value;
                    dataStr += "\nCountry(s) where movie was produced: " + response.data.Country;
                    dataStr += "\nLanguage(s): " + response.data.Language;
                    dataStr += "\nPlot: " + response.data.Plot;
                    dataStr += "\nActors: " + response.data.Actors;
                    console.log(dataStr);
                    fs.appendFile("log.txt", dataStr + "\n", function (err) {
                        if (err) {
                            console.log(err)
                        }
                    });
                    Continue();
                }).catch(function (error) {
                    if (error.response) {
                        console.log("---------------Data---------------");
                        console.log(error.response.data);
                        console.log("---------------Status---------------");
                        console.log(error.response.status);
                        console.log("---------------Status---------------");
                        console.log(error.response.headers);
                        fs.appendFile("log.txt", error.response.data + "\n" + error.response.status + "\n" + error.response.headers + "\n", function (err) {
                            if (err) {
                                console.log(err)
                            }
                        });
                    } else if (error.request) {
                        console.log(error.request);
                        fs.appendFile("log.txt", error.request + "\n", function (err) {
                            if (err) {
                                console.log(err)
                            }
                        });
                    } else {
                        console.log("Error", error.message);
                        fs.appendFile("log.txt", error.message + "\n", function (err) {
                            if (err) {
                                console.log(err)
                            }
                        });
                    }
                    console.log(error.config);
                    fs.appendFile("log.txt", error.config + "\n", function (err) {
                        if (err) {
                            console.log(err)
                        }
                    });
                    Continue();
                });
        }
    })
}

function Ascii() {
    fs.readFile("vault.txt", "utf8", function (err, data) {
        if (err) {
            return console.log(err);
        }
        console.log("I'll lead the way!", data, "Did you find the Vault yet, Traveller?")
        Continue();
    })
}

function Continue() {
    inquirer.prompt([
        {
            type: "confirm",
            name: "continue",
            message: "Would you like to continue, Traveller?",
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
            message: "Greetings, Traveller! What would you like to do?",
            choices: ["concert-this", "spotify-this-song", "movie-this", "do-what-it-says", "ASCII"],
            default: "concert-this"
        }
    ]).then(function (response) {
        if (response.userChoice === "concert-this") {
        ConcertThis();
    }
    else if (response.userChoice === "spotify-this-song") {
        SpotifyThisSong();
    }
    else if (response.userChoice === "movie-this") {
        MovieThis();
    }
    else if (response.userChoice === "do-what-it-says") {
        DoWhatItSays();
    }
    else {
        Ascii();
    }
});
}

QuestionTheUser();