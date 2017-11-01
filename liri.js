var keys = require("./keys.js");
var twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require('request');
var fs = require("fs");
//console.log(twitterKeys);

var action = process.argv[2];
var value = process.argv[3];

switch (action) {
  case "my-tweets":
    myTweets();
    break;

  case "spotify-this-song":
    spotifyThisSong();
    break;

  case "movie-this":
    movieThis();
    break;

  case "do-what-it-says":
    doWhatItSays();
    break;
}

function myTweets() {
	var client = new twitter({
	  consumer_key: keys.consumer_key,
	  consumer_secret: keys.consumer_secret,
	  access_token_key: keys.access_token_key,
	  access_token_secret: keys.access_token_secret
	});

	var params = {screen_name: 'lio1123'};

	client.get('statuses/user_timeline', params, function(error, tweets, response) {
		for (var i = 0; i < tweets.length; i++) {
			console.log(JSON.stringify(`Tweet #${i + 1}: ${tweets[i].text}`));
			console.log(JSON.stringify(`Tweet created on: ${tweets[i].created_at}`));
		}
			
	});
} //end myTweets()

function spotifyThisSong() {
	var spotify = new Spotify({
  id: '107b86b7bc954165937d465b1763094d',
  secret: '20d77008ea7a4638a17de610264afd02'
});
	if(value != null){
		spotify.search({ type: 'track', query: value }, function(err, data) {
		  if (err) {
		    return console.log('Error occurred: ' + err);
		  }

			var info = data.tracks.items[0];
			console.log(`			Artists: ${info.artists[0].name}
			Song Name: ${info.name}
			Link: ${info.preview_url}
			Album: ${info.album.name}`); 

		})
	}else {
		spotify.search({ type: 'track', query: 'The Sign Ace of Base' }, function(err, data) {
		  if (err) {
		    return console.log('Error occurred: ' + err);
		  }

			var info = data.tracks.items[0];
			console.log(`			Artists: ${info.artists[0].name}
			Song Name: ${info.name}
			Link: ${info.preview_url}
			Album: ${info.album.name}`); 

		});
	}



} //end spotifyThisSong()

function movieThis() {

	if(value!= null){
			request(`http://www.omdbapi.com/?t=${value}&y=&plot=short&apikey=40e9cece`, function(error, response, body) {
		  // If the request is successful (i.e. if the response status code is 200)
			  if (!error && response.statusCode === 200) {

			    // Parse the body of the site and recover just the imdbRating
			    // (Note: The syntax below for parsing isn't obvious. Just spend a few moments dissecting it).
			    console.log(`Title: ${JSON.parse(body).Title}
Year: ${JSON.parse(body).Year}
IMDB Rating: ${JSON.parse(body).imdbRating}
Country: ${JSON.parse(body).Country}
Language: ${JSON.parse(body).Language}
Plot: ${JSON.parse(body).Plot}
Actors: ${JSON.parse(body).Actors}`);
			  }
			});
	} else {
					request(`http://www.omdbapi.com/?t=mr+nobody&y=&plot=short&apikey=40e9cece`, function(error, response, body) {
		  // If the request is successful (i.e. if the response status code is 200)
			  if (!error && response.statusCode === 200) {

			    // Parse the body of the site and recover just the imdbRating
			    // (Note: The syntax below for parsing isn't obvious. Just spend a few moments dissecting it).
			    console.log(`Title: ${JSON.parse(body).Title}
Year: ${JSON.parse(body).Year}
IMDB Rating: ${JSON.parse(body).imdbRating}
Country: ${JSON.parse(body).Country}
Language: ${JSON.parse(body).Language}
Plot: ${JSON.parse(body).Plot}
Actors: ${JSON.parse(body).Actors}`);
			  }
			});
	}
} //end movieThis()


function doWhatItSays() {
	
fs.readFile("random.txt", "utf8", function(error, data) {

  if (error) {
    return console.log(error);
  }
var dataArr = data.split(",");
action = dataArr[0];
value = dataArr[1];

  if(action === "spotify-this-song"){
  	// console.log("spotify-this-song"+value);
  	value = dataArr[1];
  	spotifyThisSong();
  } else if(action === "movie-this"){
   	// console.log("movie-this"+value)
   	// console.log(dataArr[0]);
  	movieThis();
  } else if(action === "my-tweets"){
  	// console.log("my-tweets"+value);
  	myTweets();
  } else{
  	console.log("I don't understand you!");
  }

});

} //end doWhatItSays()

