require("dotenv").config();
var Spotify = require("node-spotify-api");
var keys = require("./keys.js");
var axios = require("axios");
var moment = require("moment");
var fs = require("fs");

var args = process.argv.splice(2);
const operator = args[0];
const value = args.splice(1).join('+');

const runCommand = (operator, value) => {

  console.log('\033[2J');    //clear terminal
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

const logAndSave = (str) => {
  console.log(str);
  fs.appendFile('log.txt', `${str}\r\n`, function(err) {
    if (err) console.log('ERROR: ' + err)
  })
}

// ================= do what it says ===========
// reads in the 'random.txt' file and executes the commands inside
const runTxtFile = () => {
  fs.readFile('./random.txt', 'utf8', (err, data) => {
    if (err){
      return console.log(err)
    } 
    const dataArray = data.split('\r\n')
    dataArray.forEach((d) => {

      const elements = d.split(",")
      const operator = elements[0]
      if (operator) {   // this will ignore any blank lines

        const value = elements[1].trim().replace(/ /g,'+')
          runCommand(operator, value)
      }
    })
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
  logAndSave(`\n\n`);
  logAndSave(`Information for ${title.replace(/\+/g,' ').toUpperCase()}`);
  logAndSave(`====================================`);
  const items = data.tracks.items;
  items.forEach(item => {
    displaySpotifyInfo(item)
  });
})
}

const displaySpotifyInfo = (track) => {
  logAndSave(`Song: ${track.name}`);
  logAndSave("Artist(s): ");
  displayArtists(track.artists);
  logAndSave(`Spotify preview link: ${track.external_urls.spotify}`);
  logAndSave(`Album:  ${track.album.name}`)
}

const displayArtists = (arr) => {
  for (i=0; i<arr.length; i++) {
    logAndSave(`\t ${arr[i].name}`);
  }
}

// searchSpotify();
// searchSpotify('Killing Me Softly Roberta Flack');
// searchSpotify('The Prayer Josh Groban');
// searchSpotify('Peace on Earth/Little Drummer Boy');
// ========================= END SPOTIFY THIS ======================


// ====================== CONCERT THIS ===========================
// Find and displays the dates and locations of all of the scheduled concerts
// for the 'artist' provided
const searchConcerts = (artist) => {
  axios.get(`https://rest.bandsintown.com/artists/${artist}/events?app_id=codingbootcamp`)
  .then(function(resp) {
    logAndSave(`\n\n`);
    logAndSave(`Concerts for ${artist.replace('+',' ').toUpperCase()}`);
    logAndSave(`====================================`);
    resp.data.forEach((event) => {
      var date = moment(event.datetime).format("MM/DD/YY")
      logAndSave(`\n\tDate: ${date}`);

      logAndSave(`\t\tVenue: ${event.venue.name}`)
      logAndSave(`\t\tLocation: ${event.venue.city}, ${event.venue.region}`)
    })
  })
  .catch(function (error) {
    console.log(error);
  });
}

// searchConcerts("Reba McEntire")

// Gets and displays the info about the movie with the title specified.
// Only displays data for one movie.
// ===========================  Movie This ===================================
const searchMovies = (title) => {

  axios.get(`http://www.omdbapi.com/?t=${title}&apikey=trilogy`)
  .then((resp) => {
    // console.log(JSON.stringify(resp.data, null, 2));
    logAndSave(`\n\n`);
    logAndSave(`Information for ${title.replace(/\+/g,' ').toUpperCase()}`);
    logAndSave(`====================================`);
    var data = resp.data;
    if (data.Title === undefined) {
      return logAndSave("No Movie data found");
    } else {
      displayMovieInfo(data)
    }
  })
  
}

// Display movie information in an organized way
const displayMovieInfo = (data) => {
  logAndSave(`Title:  ${data.Title}`);
  logAndSave(`\tYear:  ${data.Year}`);
  logAndSave(`\tIMDB Rating: ${data.imdbRating}`)
  logAndSave(`\tRotten Tomatoes Rating: ${getRottenTomatoes(data.Ratings)}`)
  logAndSave(`\tCountry Where Produced: ${data.Country}`)
  logAndSave(`\tLanguage: ${data.Language}`)
  logAndSave(`\tPlot: ${data.Plot}`)
  logAndSave(`\tActors: ${data.Actors}`)
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