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
        this.layout = {
            grid: {},
            objects: {}
        };

    }

    setupScene(){
        this.sceneManager.addCube(100,100,100,0xff0000);
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