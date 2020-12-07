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

app.post('/api', (req, res) => {
    const query = req.body['query'];
    const type = req.body['type'];
    const filter = req.body['filter'];
    const dataStructure = req.body['dataStructure'];
});


app.listen(port, () => console.log('Listening on ' + 8080));