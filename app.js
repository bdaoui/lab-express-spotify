require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node'); // require spotify-web-api-node package here
const PORT = 3000;

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:

app.get("/", (req, res) => {
    res.render("index")
})


// Get Artist 

app.get("/artist-search", (req, res) =>{
    const {artist} = req.query
    
    spotifyApi
    .searchArtists(artist)
    .then(data => {

    const {items} = data.body.artists;

    // console.log('The received data from the API: ', data.body.artists);
    // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    // const image = items[0].images[0].url;

    res.render("artist-search-result" ,{items});})

    .catch(err => console.log('The error while searching artists occurred: ', err));

}
)

// Get Album

app.get("/album/:artistId", (req, res) => {
    const {artistId} = req.params;
    // console.log(artistId);
    
    spotifyApi
    .getArtistAlbums(artistId)
    .then( data => {

        const albumList = data.body;

        res.render("album", {albumList}); 
        // console.log(albumList);
        
    },


        
    function(err) {
          console.error(err);
        }
      );
})

// Get Tracks

app.get("/tracks/:trackId", (req, res) =>{
    const {trackId} = req.params;

    spotifyApi
    .getAlbumTracks( trackId, { limit : 5, offset : 1 })
    .then(data =>{
    
        const playList = data.body;


        res.render("tracks", {playList})
        // console.log(data.body);
    
    }, 
    
    
    function(err) {
      console.log('Something went wrong!', err);
    });
})





app.listen(PORT, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
