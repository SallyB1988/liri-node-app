
# liri-node-app
This is a text based knock-off of Siri which can be used to find information about songs, movies or concerts.
All returned information is displayed in the terminal window as well as in a file named *log.txt*.   **Note:  Data from new searches is appended to the log.txt file.**

Command to run this program:
`node liri.js <command> <search text>`
  
Where `<command>` is one of these four basic commands:

* concert-this
* spotify-this-song
* movie-this
* run-batch-file

and `<search text>` is the name of the song or artist. The string does not need to be enclosed in quotation marks.

## concert-this <artist or band name>
Searches the Bands in Town Artist Events API for the artist/band of your choice. It will display the following information in the terminal as well as in the *log.txt* file.
  
  - Date of the concert
  - Name of the venue
  - City and State of the concert
  
  Sample concert-this:
```
node liri.js concert-this Sam Hunt
```


## spotify-this-song
Searches the Spotify API for the song of your choice. It will display the following information in the terminal as well as in the *log.txt* file.

  - Artist(s)
  - Song title
  - Link to the Spotify preview of the song
  - Album name that the song is from
  
  If no song is entered, the information for the song "The Sign" by Ace of Base is displayed.
  
  Sample spotify-this-song:
```
node liri.js spotify-this-song Talking in your Sleep
```
  
## movie-this
Searches the OMDB API for the movie of your choice. It will display the following information in the terminal as well as in the *log.txt* file.

   * Title of the movie
   * Year the movie came out.
   * IMDB Rating of the movie.
   * Rotten Tomatoes Rating of the movie.
   * Country where the movie was produced.
   * Language of the movie.
   * Plot of the movie.
   * Actors in the movie.
   
If no movie is entered, the information for the movie "Mr. Nobody" is displayed.

Sample movie-this:
```
node liri.js movie-this 2001 A Space Odyssey
```

## run-batch-file
Executes the search commands stored in the file named *search.bat*. This file contains one or more search commands with their corresponding search string. Each line in the *search.bat* file must be in the following format: <br>
  >  `search command, search string`

Each search command and string must be on a separate line in the file. The resulting data is displayed in the terminal as well as in the *log.txt* file.

Sample search.bat file:
```
spotify-this-song, Hit me with your best shot
movie-this, Office Space
concert-this, Reba McEntire
```

# Video Showing Working Liri app

[Demo Video](https://github.com/SallyB1988/liri-node-app/blob/master/ProjectVideo.webm)


