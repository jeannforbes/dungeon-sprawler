const TILE_WIDTH = 3;
const TILE_HEIGHT = 3;
const TILE_GAP = 0;
const WALL_HEIGHT = 3;

class Zone{
    constructor(socket, data){
        this.socket = socket;
        this.sceneManager = new SceneManager();

        this.name = 'Default';
        this.width = this.height = this.depth = 5;

        this.enemies = {};
        this.players = {};

        this.grid = {
            width : 5,
            depth : 5,
            height: 7,
            objects: {},
        };

        this.setupScene();
        //this.setupSocket();

    }

    setupScene(){
        // Make the basic dungeon layout (walls & floor)
        for(let x= -this.grid.width/2-1; x<this.grid.width/2+1; x++){
            for(let z = -this.grid.depth/2-1; z<this.grid.depth/2+1; z++){
                // Make a wall around the periphery
                if(x===-this.grid.depth/2-1 || z===-this.grid.depth/2-1){
                    for(let y=0; y<WALL_HEIGHT; y++){
                        let p = this.sceneManager.addCube(
                            TILE_WIDTH-TILE_GAP,
                            TILE_HEIGHT,
                            TILE_WIDTH-TILE_GAP,
                            'stonetile3.jpg');
                        p.position.set(x*TILE_WIDTH, TILE_HEIGHT*y + TILE_HEIGHT/2, z*TILE_WIDTH);
                    }
                }
                // Make floor tiles everywhere else
                else{
                    let p = this.sceneManager.addCube(
                        TILE_WIDTH-TILE_GAP,
                        TILE_HEIGHT,
                        TILE_WIDTH-TILE_GAP, 
                        'stonetile1.jpg');
                    p.position.set(x*TILE_WIDTH, TILE_HEIGHT/2, z*TILE_WIDTH);
                }
            }
        }
    }

    update(){
        updateEnemies();
    }

    updateEnemies(){
        loop(this.enemies, (enemy) => {
            enemy.move();
        });
    }

    setupSocket(){
        // Handle message from client
        this.socket.on('msg', (data) => {
            if(!data.msg) return;
            switch(data.msg){
                case 'playerConnect':
                    this.players[data.id] = new Player(data.id);
                break;
                case 'playerMove':
                    if(this.players[data.id]){
                        this.players[data.id].model = this.sceneManager.addCube(
                            2,2,2,'player.png');
                        this.players[data.id].position.set(5,5,5);
                    }
                break;
                default:
                    console.log(data.id, data.msg, data.contents);
                break;
            }
        });
    }
}

/* HELPER FUNCTIONS */

const loop = (map, cb) => {
    let keys = Object.keys(map);
    for(let i=0; i<keys.length; i++) cb(map[keys[i]]);
};

const requestJSON = (url, cb) => {
    let req = new XMLHttpRequest();
    req.onload = () => {
        cb(JSON.parse(req.responseText));
    }
    req.open('GET', url, true);
    req.send();
}