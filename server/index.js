const express = require('express');
const { Server } = require('socket.io');
const path = require('path');

const http = require('http');
const app = express();

// Statische Dateien aus dem 'public' Ordner servieren
// app.use(express.static('public'));

// Route für die Startseite (optional)
// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, '/public', 'control.html'));
// });

const server = http.createServer(app);

const io = new Server(server);

let punkte_heim = 0;
let punkte_gast = 0;
let satz_heim = 0;
let satz_gast = 0;

io.on('connection', (socket) => {
    console.log("Jemand will punkte wissen")
    socket.on('updatePunkte', (data) => {
        
        const { team, type, operation } = data;

        // Beispielhafte Logik zur Aktualisierung (passend anpassen)
        if (team === 'heim' && type === 'punkte' && operation === 'erhoehe') {
            punkte_heim++;
            updateScores();
            check_score();
        }
        if (team === 'heim' && type === 'punkte' && operation === 'verringern') {
            punkte_heim--;
            updateScores();
            check_score();
        }
        if (team === 'gast' && type === 'punkte' && operation === 'erhoehe') {
            punkte_gast++;
            updateScores();
            check_score();
        }
        if (team === 'gast' && type === 'punkte' && operation === 'verringern') {
            punkte_gast--;
            check_score();
            updateScores();
        }

        if (team === 'heim' && type === 'satz' && operation === 'erhoehe') {
            satz_heim++;
            updateScores();
            check_score();
        }
        if (team === 'heim' && type === 'satz' && operation === 'verringern') {
            satz_heim--;
            updateScores();
            check_score();
        }
        if (team === 'gast' && type === 'satz' && operation === 'erhoehe') {
            satz_gast++;
            updateScores();
            check_score();
        }
        if (team === 'gast' && type === 'satz' && operation === 'verringern') {
            satz_gast--;
            updateScores();
            check_score();
        }

        io.emit('updatePunkte', data);
    });
});

async function updateScores() {
    io.emit('updateScores', {
        punkte_heim,
        satz_heim,
        punkte_gast,
        satz_gast
    });
  }

function check_score(){
    let differenz = punkte_heim - punkte_gast;
    if (punkte_heim >= 25 && differenz >= 2){
        console.log(`Punkte Heim ${ punkte_heim} : Punkte Gast ${ punkte_gast} `)
            satz_heim++;
            punkte_heim = punkte_gast = 0;
            updateScores();
        }
    differenz = punkte_gast - punkte_heim;
    if (punkte_gast >= 25 && differenz >= 2){
            console.log(`Punkte Heim ${ punkte_heim} : Punkte Gast ${ punkte_gast} `)
            satz_gast++;
            punkte_heim = punkte_gast = 0;
            updateScores();
        }
    if (punkte_heim < 0) {
        punkte_heim = 0;
        updateScores();
    }
    if (punkte_gast < 0) {
        punkte_gast = 0;
        updateScores();
    }
    if (satz_heim < 0) {
        satz_heim = 0;
        updateScores();
    }
    if (satz_gast < 0) {
        satz_gast = 0;
        updateScores();
    }
        


        
}

server.listen(3000, () => {
    console.log(`Server listening on port 3000`);
});