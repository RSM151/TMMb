const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');
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

app.post('/api', (req, res) => {

    res.send(200);
    const query = req.body['query'];
    const type = req.body['type'];
    const filter = req.body['filter'];
    const dataStructure = req.body['dataStructure'];

    const apiKey = "879743dbc28d0f7ee9a56559198a3c57";
    let URL = "https://api.themoviedb.org/3/search/"
    let movies;
    // Handle movies
    if (type === 'Movie') {
        URL += "movie?api_key=" + apiKey + "&query=" + query + "&include_adult=true";
        console.log(URL);
        let movieIDs = [];
        fetch(URL).then(response => response.json()).then(function (data) {

            data['results'].forEach(movie => {
                movieIDs.push(movie['id']);
            });

            movies = movieIDs.map((id) => getMovie(id, apiKey));

            Promise.all(movies).then(function (values) {
                let out = JSON.stringify(values);
                fetch('http://localhost:8080/', {
                    method: "POST",
                    mode: 'cors',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(values)
                }).then((response) => console.log(response.status));
                //fetch('http://rmuscapi:8080').then((response) => console.log(response));
            });

        });
    }


});


app.listen(port, () => console.log('Listening on ' + 8080));