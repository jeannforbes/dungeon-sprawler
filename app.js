const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);

// CONSTANTS
const PORT = process.env.PORT || 3000;

server.listen(PORT);

app.get('/', (req, res) => { res.sendFile('index.html', { root: './client/' }); });
app.get('/client.js', (req, res) => { res.sendFile('client.js', { root: './client/' }); });
app.get('/style.css', (req, res) => { res.sendFile('style.css', { root: './client/' }); });

this.io.on('connect') = (socket) => console.log(socket.id+' connected.');

/*
 * What is my purpose?
 *
 * You print to console.
 *
 * Oh... my... god...
 *
 */