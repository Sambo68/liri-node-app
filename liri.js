// require Node built in fs library package for filesystem access
var fs = require('fs');

// require twitter, spotify, and request NPM libraries
// install libraries before running this app with the following commands:
// npm install twitter, npm install spotify, npm install request
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require('request');

//set up credentials object for Spotify
var spotify = new Spotify({
      id: '7cff9512b18e491c8e7aae71e8191a05',
      secret: '9da65118fc884c29b3b3a9ed929521c2'
 });


// require the keys.js file that holds the twitter keys
var keys = require('./keys');

// if the my-tweets command is received
var app = {
  "my-tweets": function() {
    var client = new Twitter(keys);
    // get the 20 most recent tweets// get the 20 most recent tweets, making sure to exclude replies and retweets
    client.get('statuses/user_timeline', {count: 20, trim_user: false, exclude_replies: true, include_rts: false}, function(error, tweetData, response) {
      if (!error) {
        // console.log(tweets);
        console.log(' ');
        console.log('================ My Tweets ================');
        tweetData.forEach(function(obj) {
          console.log('--------------------------');
          console.log('Time: ' + obj.created_at);
          console.log('Tweet: ' + obj.text);
          console.log('--------------------------');
          console.log(' ');
        });
        console.log('===========================================');
        console.log(' ');

        // log the command issued to the log.txt file
        app.logData(tweetData);
      } else {
        console.log(error);
      }
    });
    // end the myTweets function
  },
  

  // if the spotify-this-song command is received
  "spotify-this-song": function(keyword) {
    //// run a search on the Spotify API by track name for mySong
    //If no song is provided then the program will default to "The Sign" by Ace of Base.
    spotify.search({ type: 'track', query: keyword || 'The Sign Ace of Base' }, function(err, data) {
      if ( err ) {
          console.log('Error occurred: ' + err);
          return;
      }

      if(data.tracks.items.length > 0) {
        var record = data.tracks.items[0];

        // console.log(song information);
        console.log(' ');
        console.log('================ Song Info ================');
        console.log('Artist: ' + record.artists[0].name);
        console.log('Name: ' + record.name);
        console.log('Link: ' + record.preview_url);
        console.log('Album: ' + record.album.name);
        console.log('===========================================');
        console.log(' ');

        app.logData(data);
      } else {
        // log the command issued to the log.txt file
        console.log('No song data found.');
      }



    });
    // end the mySpotify function
  },

  // if the movie-this command is received
  "movie-this": function(query) {
    //Run a request to the OMDB API with the movie specified otherwise default to "Mr. Nobody"
    request('http://www.omdbapi.com/?t=' + (query || 'Mr.Nobody') +'&y=&plot=short&apikey=40e9cece', function (error, response, info) {
      // If the request is successful (i.e. if the response status code is 200)
      if (!error && response.statusCode == 200) {

        // Parse the returned data (body) and display movie info
        var movieData = JSON.parse(info);

        console.log(' ');
        console.log('================ Movie Info ================');
        console.log('Title: ' + movieData.Title);
        console.log('Year: ' + movieData.Year);
        console.log('IMDB Rating: ' + movieData.imdbRating);
        console.log('Country: ' + movieData.Country);
        console.log('Language: ' + movieData.Language);
        console.log('Plot: ' + movieData.Plot);
        console.log('Actors: ' + movieData.Actors);
        console.log('Rotten Tomatoes Rating: ' + movieData.tomatoRating);
        console.log('Rotten Tomatoes URL: ' + movieData.tomatoURL);
        console.log('===========================================');
        console.log(' ');

        // log the command issued to the log.txt file
        app.logData(movieData);
      }
      // end the request function
    });
    // end the movieThis function
  },

  // if the do-what-it-says command is received
  "do-what-it-says": function() {
    // read in the random.txt file
    fs.readFile('random.txt', 'utf8', function(err, data) {
      if(err) throw err;
      console.log(data.toString());

      // split data into an array of function name and argument
      var cmds = data.toString().split(',');

      app[cmds[0].trim()](cmds[1].trim());
    });
  },

  // logging function
  logData: function(data) {
    fs.appendFile('log.txt', JSON.stringify(data, null, 2) + '\n====================================================================================', function(err) {
      if(err) {
        console.log(err);
      }
    });
  }
};
//grab the commandArguments for index 2 & 3
app[process.argv[2]](process.argv[3]);
