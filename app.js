const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);

// CONSTANTS
const PORT = process.env.PORT || 3000;

server.listen(PORT);

// HTML
app.get('/', (req, res) => { res.sendFile('index.html', { root: './client/' }); });

// CSS
app.get('/style.css', (req, res) => { res.sendFile('style.css', { root: './client/' }); });

// JS
app.get('/main.js', (req, res) => { res.sendFile('main.js', { root: './client/' }); });
app.get('/body.js', (req, res) => { res.sendFile('body.js', { root: './client/' }); });
app.get('/enemy.js', (req, res) => { res.sendFile('enemy.js', { root: './client/' }); });
app.get('/player.js', (req, res) => { res.sendFile('player.js', { root: './client/' }); });
app.get('/scenemanager.js', (req, res) => { 
    res.sendFile('sceneManager.js', { root: './client/' }); 
});
app.get('/zone.js', (req, res) => { res.sendFile('zone.js', { root: './client/' }); });

// LIBS
app.get('/three-orbitcontrols.min.js', (req, res) => { 
    res.sendFile('three-orbitcontrols.min.js', { root: './client/lib/' }); 
});

// THREE objects
app.get('/floortile0.json', (req, res) => res.json(require('./media/models/floortile0.json')));
app.get('/walltile0.json', (req, res) => res.json(require('./media/models/walltile0.json')));

io.on('connection',(socket) => { 
    console.log(socket.id+' connected.'); 

    socket.emit('joinDungeon', {});
});