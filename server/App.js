const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');
const fetch = require('node-fetch');
app.use(cors());
app.use(bodyParser.json())
const port = 8080;

app.get('/', (req, res) => {
    res.send('Hello World!');
})

app.post('/', (req, res) => {
    console.log((req.body));
    fs.writeFile('data.json', JSON.stringify(req.body), (err) => console.log(err));
    res.send(200);
})

async function getMovie(id, apiKey) {
    let movie;
    await fetch("https://api.themoviedb.org/3/movie/" + id + "?api_key=" + apiKey).then(response => response.json()).then(data => movie = data);
    return movie;
}

async function handleMovies(movies) {

}

app.post('/api', (req, res) => {

    const query = req.body['query'];
    const type = req.body['type'];
    const filter = req.body['filter'];
    const dataStructure = req.body['dataStructure'];

    const apiKey = "879743dbc28d0f7ee9a56559198a3c57";
    let URL = "https://api.themoviedb.org/3/"
    let movies;


    // Handle movies
    if (type === 'Movie') {
        URL += "search/movie?api_key=" + apiKey + "&query=" + query + "&include_adult=true";
        console.log(URL);
        let movieIDs = [];
        fetch(URL).then(response => response.json()).then(function (data) {

            data['results'].forEach(movie => {
                movieIDs.push(movie['id']);
            });

            movies = movieIDs.map((id) => getMovie(id, apiKey));

            Promise.all(movies).then(function (values) {
                // let out = JSON.stringify(values);
                // fetch('http://localhost:8080/', {
                //     method: "POST",
                //     mode: 'cors',
                //     headers: {
                //         'Content-Type': 'application/json'
                //     },
                //     body: JSON.stringify(values)
                // }).then((response) => console.log(response.status));
                console.log(values);
            });
        });
    }


    //Handle People
    if (type === 'Person') {

        //create URL for person search
        //we want the 0th index of the results array (only going to handle the first result)
        //get the ID value at that index
        //now do a get movie credits call to the api (URL example: https://api.themoviedb.org/3/person/500/movie_credits?api_key=879743dbc28d0f7ee9a56559198a3c57&language=en-US)
        //this call returns two arrays: cast and crew
        //loop through both of these arrays, store the IDs, pass to getMovie

        //first, we need to do a search call and get the 0th index
        URL += "search/person?api_key=" + apiKey + "&query=" + query + "&include_adult=true";
        //fetch the url, get the ID
        fetch(URL).then(response => response.json()).then(function (data) {


            let id = data['results'][0]['id'];

            //this is the code after we already called for the ID
            URL = "https://api.themoviedb.org/3/"
            URL += "discover/movie" + "?with_people=" + id + "&api_key=" + apiKey;
            console.log(URL);
            let movieIDs = [];
            fetch(URL).then(response => response.json()).then(function (data) {

                data['results'].forEach(movie => {
                    movieIDs.push(movie['id']);
                });

                movies = movieIDs.map((id) => getMovie(id, apiKey));

                Promise.all(movies).then(function (values) {
                    // let out = JSON.stringify(values);
                    // fetch('http://localhost:8080/', {
                    //     method: "POST",
                    //     mode: 'cors',
                    //     headers: {
                    //         'Content-Type': 'application/json'
                    //     },
                    //     body: JSON.stringify(values)
                    // }).then((response) => console.log(response.status));
                    console.log(values);
                });
            });
        });
    }

    //Handle Year
    if (type === 'Year') {

        //Example URL:https://api.themoviedb.org/3/discover/movie?primary_release_year=2010&api_key=879743dbc28d0f7ee9a56559198a3c57

        URL += "discover/movie?primary_release_year=" + query + "&api_key=" + apiKey + "&include_adult=true";
        console.log(URL);
        let movieIDs = [];
        fetch(URL).then(response => response.json()).then(function (data) {
            console.log(data);
            data['results'].forEach(movie => {
                movieIDs.push(movie['id']);
            });

            movies = movieIDs.map((id) => getMovie(id, apiKey));


            Promise.all(movies).then(function (values) {
                // let out = JSON.stringify(values);
                // fetch('http://localhost:8080/', {
                //     method: "POST",
                //     mode: 'cors',
                //     headers: {
                //         'Content-Type': 'application/json'
                //     },
                //     body: JSON.stringify(values)
                // }).then((response) => console.log(response.status));
                console.log(values);
            });
        });
    }



    //Handle Genre
    if (type === 'Genre') {

        //call /genre/movie/list, store using: https://api.themoviedb.org/3/genre/movie/list?api_key=879743dbc28d0f7ee9a56559198a3c57&language=en-US
        //loop through "genres" array, comparing "name" to the query
        //Note: query input's first letter should be capitalized for comparison's sake
        //if name = query, store the ID
        //do another call using URL += "/discover/movie?with_genres=" + query + "&api_key=" + apiKey + "&query=" + query + "&include_adult=true";
        //loop through "results" array, call getMovie, etc

        //first call to get genre list
        let genreURL = "https://api.themoviedb.org/3/genre/movie/list?api_key=879743dbc28d0f7ee9a56559198a3c57&language=en-US";
        let genreID = 0;
        fetch(genreURL).then(response => response.json()).then(function (data) {

            data['genres'].forEach(genre => {
                if (genre['name'].toLowerCase() === query.toLowerCase()) {
                    genreID = genre['id'];
                }
            });


        }).then(() => {

            //once we have the genreId:
            URL += "discover/movie?with_genres=" + genreID + "&api_key=" + apiKey + "&include_adult=true";

            console.log(URL);
            let movieIDs = [];
            fetch(URL).then(response => response.json()).then(function (data) {

                data['results'].forEach(movie => {
                    movieIDs.push(movie['id']);
                });

                movies = movieIDs.map((id) => getMovie(id, apiKey));

                Promise.all(movies).then(function (values) {
                    // let out = JSON.stringify(values);
                    // fetch('http://localhost:8080/', {
                    //     method: "POST",
                    //     mode: 'cors',
                    //     headers: {
                    //         'Content-Type': 'application/json'
                    //     },
                    //     body: JSON.stringify(values)
                    // }).then((response) => console.log(response.status));
                    console.log(values);
                });
            });
        });
    }
});



app.listen(port, () => console.log('Listening on ' + 8080));
