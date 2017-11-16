const TILE_WIDTH = 3;

class Zone{
    constructor(io, data){
        this.io = io;
        this.sceneManager = new SceneManager();

        this.name = 'Default';
        this.width = this.height = this.depth = 5;

        this.entities = {
            players: {},
            enemies: {},
        }
        this.grid = {
            width : 5,
            depth : 5,
            height: 5,
            tileWidth: 3,
            objects: {}
        };

        this.setupScene();

    }

    setupScene(){

        // Make walls
        for(let x= -this.grid.width/2; x<this.grid.width/2; x++){
            for(let z = -this.grid.depth/2; z<this.grid.depth/2; z++){
                let p = this.sceneManager.addCube(TILE_WIDTH-0.5,1,TILE_WIDTH-0.5, 0x338855);
                p.position.set(x*TILE_WIDTH, 0, z*TILE_WIDTH);
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