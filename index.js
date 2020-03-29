let express = require('express');
// require('config/database');
let app = express();
const axios = require('axios');
const cheerio = require('cheerio');

//сбор артистов
app.get('/', async function(req, res){
    console.log("GET / function");
    let mysql = require('mysql');
    let connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'rocksmith'
    });
    connection.connect();

    try {
        let result = await axios.request({
            url: "http://ignition.customsforge.com/search/artists",
            method: "GET",
            headers: {
                Cookie: ""
            }
        });
        // console.log(result.data);
        let artists = [];
        let $ = await cheerio.load(result.data);
        let artistsRaw = $('#artists-column');
        let regex = new RegExp(/\s\([0-9]+\)/gm);
        artistsRaw.children().each(async function(i, el){
            let artistRaw = $(this).text();
            let artistSplitted = await artistRaw.split(regex);
            console.log(artistSplitted[0]);
            // Знал бы чем заменить escape - заменил бы
            await connection.query(`INSERT INTO artists (artist) VALUES ('`+escape(artistSplitted[0])+`')`, function(err, rows, fields){
                if(err) {
                    throw err;
                }
                console.log("successful write to base...");
            });
        });
        res.send(result.data);
    } catch (err) {
        console.log(err);
    }
    console.log("Done!");
});

//Сбор треков и ссылок на них
app.get("/tracks", function(req, res){

});

app.listen(3000, function(){
    console.log('Hello, port 3000');
});