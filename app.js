const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const Shopkeeper = require('./shopkeeper.js');

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
app.get('/three-objloader.min.js', (req, res) => { 
    res.sendFile('three-objloader.min.js', { root: './client/lib/' }); 
});

/* JS */
app.get('/*.js', (req, res) => {
    let uid = req.params.uid;
    let path = req.params[Object.keys(req.params)[0]] ? 
        req.params[Object.keys(req.params)[0]] : '';
    res.sendFile(path+'.js', {root: './client/'}); 
});

/* THREE objs */
/* TEXTURES */
app.get('/*.obj', (req, res) => {
    let uid = req.params.uid;
    let path = req.params[Object.keys(req.params)[0]] ? 
        req.params[Object.keys(req.params)[0]] : 'gate';
    res.sendFile(path+'.obj', {root: './media/models/'}); 
});

/* TEXTURES */
app.get('/*.jpg', (req, res) => {
    let uid = req.params.uid;
    let path = req.params[Object.keys(req.params)[0]] ? 
        req.params[Object.keys(req.params)[0]] : 'stonetile0';
    res.sendFile(path+'.jpg', {root: './media/textures/'}); 
});

let shopkeeper;
const init = () => {
    shopkeeper = new Shopkeeper();

    io.on('connection',(socket) => { 
        console.log(socket.id+' connected.');

        shopkeeper.openLedger(socket.id);
        socket.emit('joinDungeon', shopkeeper.buy(socket.id,'DUNGEON_SMALL'));

        /* CLIENT COMM. */
        socket.on('msg', (data) => {
            if(data.to && data.msg){
                io.to(data.to).emit('msg', {
                    id: socket.id,
                    msg: data.msg,
                    content: data.content,
                });
            } else if(data.msg){
                io.emit('msg', {
                    id: socket.id,
                    msg: data.msg,
                    content: data.content,
                });
            }
        });

        /* SHOPKEEPER IO */

        // Buy

        // Refund

        // ... trade?

    });
}

init();