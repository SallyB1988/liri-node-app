require("dotenv").config();
var Spotify = require("node-spotify-api");
var keys = require("./keys.js");
var axios = require("axios");
var moment = require("moment");
var fs = require("fs");

var args = process.argv.splice(2);
const operator = args[0];
const value = args.splice(1).join('+');

console.log(value);
const runCommand = (operator, value) => {

  switch (operator) {
    case "concert-this":
      searchConcerts(value)
      break
    case "spotify-this-song":
      searchSpotify(value)
      break
    case "movie-this":
      searchMovies(value)
      break
    case "do-what-it-says":
      runTxtFile()
      break
    default:
      console.log((`ERROR -- ${operator} is not a valid command\nChoose from:
      \tconcert-this
      \tspotify-this-song
      \tmovie-this
      \tdo-what-it-says\n\n`))
  }
}

// ================= do what it says ===========
// reads in the 'random.txt' file and executes the command inside
const runTxtFile = () => {
  fs.readFile('./random.txt', 'utf8', (err, data) => {
    if (err){
      return console.log(err)
    } 
    const elements = data.split(",")
    const operator = elements[0]
    const value = elements[1].replace(/ /g,'+')
    runCommand(operator, value)
  })
}

/**
 * Searches Spotify for the specified title
 * @param {*} title 
 */
function searchSpotify(title = "The Sign Ace of Base") {
  var spotify = new Spotify(keys.spotify)
  spotify.search({
  type: 'track',
  query: title,
}, function(err, data) {
  if (err) {
    return console.log('Error: ' + err);
  }
  console.log(JSON.stringify(data.tracks.items, null, 3)); // This shows the ENTIRE object nicely! The last number is an indentation factor
  const items = data.tracks.items;
  items.forEach(item => {
    displaySpotifyInfo(item)
  });
})
}

const displaySpotifyInfo = (track) => {
  // var track = data.items[0];
  // console.log(track);
  console.log(`Song: ${track.name}`);
  console.log("Artist(s): ");
  displayArtists(track.artists);
  console.log(`Spotify preview link: ${track.external_urls.spotify}`);
  console.log(`Album:  ${track.album.name}`)
}

const displayArtists = (arr) => {
  for (i=0; i<arr.length; i++) {
    console.log(`\t ${arr[i].name}`);
  }
}

// searchSpotify();
// searchSpotify('Killing Me Softly Roberta Flack');
// searchSpotify('The Prayer Josh Groban');
// searchSpotify('Peace on Earth/Little Drummer Boy');
// ========================= END SPOTIFY THIS ======================


// ====================== CONCERT THIS ===========================
const searchConcerts = (artist) => {
  axios.get(`https://rest.bandsintown.com/artists/${artist}/events?app_id=codingbootcamp`)
  .then(function(resp) {
    console.log(`\n\n`);
    console.log(`Concerts for ${artist.toUpperCase()}`);
    console.log(`====================================`);
    resp.data.forEach((event) => {
      var date = moment(event.datetime).format("MM/DD/YY")
      console.log(`\n\tDate: ${date}`);

      console.log(`\t\tVenue: ${event.venue.name}`)
      console.log(`\t\tLocation: ${event.venue.city}, ${event.venue.region}`)
    })
  })
  .catch(function (error) {
    console.log(error);
  });
}

// searchConcerts("Reba McEntire")

//======================= End of Concert-this ======================================

// ===========================  Movie This ===================================
const searchMovies = (title) => {

  axios.get(`http://www.omdbapi.com/?t=${title}&apikey=trilogy`)
  .then((resp) => {
    var data = resp.data;
    console.log(`Title:  ${data.Title}`);
    console.log(`Year:  ${data.Year}`);
    console.log(`IMDB Rating: ${data.imdbRating}`)
    console.log(`Rotten Tomatoes Rating: ${getRottenTomatoes(data.Ratings)}`)
    console.log(`Country Where Produced: ${data.Country}`)
    console.log(`Language: ${data.Language}`)
    console.log(`Plot: ${data.Plot}`)
    console.log(`Actors: ${data.Actors}`)
    // console.log(data)
  })
  
}
const getRottenTomatoes = (ratings) => {
  // let obj = ratings.find((rating) => {
  //   return rating.Source === 'Rotten Tomatoes';
  // })

  // This is the same...
  // let obj = ratings.find( rating => rating.Source === 'Rotten Tomatoes' )
  // return obj.Value;

  // now do on one line...
  return ratings.find( rating => rating.Source === 'Rotten Tomatoes' ).Value;
}

// searchMovies("the+grinch");

runCommand(operator, value);