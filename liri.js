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
    case "run-batch-file":
      runTxtFile()
      break
    default:
      console.log((`ERROR -- ${operator} is not a valid command\nChoose from:
      \tconcert-this
      \tspotify-this-song
      \tmovie-this
      \trun-batch-file\n\n`))
  }
}

const logAndSave = (str) => {
  console.log(str);
  fs.appendFile('log.txt', `${str}\r\n`, function(err) {
    if (err) console.log('ERROR: ' + err)
  })
}

// ================= run batch file ===========
// reads in the 'search.bat' file and executes the commands inside
const runTxtFile = () => {
  fs.readFile('./search.bat', 'utf8', (err, data) => {
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
function searchSpotify(title) {
  
  if (title === '') {title = "The Sign"}
  const titleWithSpaces = title.replace(/\+/g,' ');
  var spotify = new Spotify(keys.spotify)
  spotify.search({
  type: 'track',
  query: title,
}, function(err, data) {
  if (err) {
    return console.log('Error: ' + err);
  }
  logAndSave(`\n\n`);
  logAndSave(`Information for ${titleWithSpaces.toUpperCase()}`);
  logAndSave(`====================================`);
  const items = data.tracks.items;
  items.forEach(item => {
    if (item.name.toLowerCase() === titleWithSpaces.toLowerCase()) {

      displaySpotifyInfo(item)
    }
  });
})
}

const displaySpotifyInfo = (track) => {
  logAndSave(`Song: ${track.name}`);
  logAndSave("Artist(s): ");
  displayArtists(track.artists);
  logAndSave(`Spotify preview link: ${track.external_urls.spotify}`);
  logAndSave(`Album:  ${track.album.name}\n`)
}

const displayArtists = (arr) => {
  for (i=0; i<arr.length; i++) {
    logAndSave(`\t ${arr[i].name}`);
  }
}

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

// Gets and displays the info about the movie with the title specified.
// Only displays data for one movie.
// ===========================  Movie This ===================================
const searchMovies = (title) => {
  if (title === '') { title = "Mr Nobody"}
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