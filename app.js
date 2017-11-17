const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);

// CONSTANTS
const PORT = process.env.PORT || 3000;

server.listen(PORT);

/* HTML */
app.get('/', (req, res) => { res.sendFile('index.html', { root: './client/' }); });
/* CSS */
app.get('/style.css', (req, res) => { res.sendFile('style.css', { root: './client/' }); });
/* LIBS */
app.get('/three-orbitcontrols.min.js', (req, res) => { 
    res.sendFile('three-orbitcontrols.min.js', { root: './client/lib/' }); 
});

/* JS */
app.get('/*.js', (req, res) => {
    let uid = req.params.uid;
    let path = req.params[Object.keys(req.params)[0]] ? 
        req.params[Object.keys(req.params)[0]] : '';
    res.sendFile(path+'.js', {root: './client/'}); 
});

/* THREE objs */
app.get('/floortile0.json', (req, res) => res.json(require('./media/models/floortile0.json')));
app.get('/walltile0.json', (req, res) => res.json(require('./media/models/walltile0.json')));

/* TEXTURES */
app.get('/*.jpg', (req, res) => {
    let uid = req.params.uid;
    let path = req.params[Object.keys(req.params)[0]] ? 
        req.params[Object.keys(req.params)[0]] : 'stonetile0.jpg';
    res.sendFile(path+'.jpg', {root: './media/textures/'}); 
});

/*
 *    SOCKET SETUP!
 */

io.on('connection',(socket) => { 
    console.log(socket.id+' connected.');

    socket.emit('joinDungeon', {});

    socket.on('msg', (data) => {
        console.log(data);
        if(data.to && data.msg){
            io.to(data.to).emit('msg', {
                id: data.id,
                msg: data.msg,
                contents: data.contents,
            });
        } else if(data.msg){
            io.emit('msg', {
                id: data.id,
                msg: data.msg,
                contents: data.contents,
            });
        }
    });
});