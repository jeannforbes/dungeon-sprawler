class Zone{
    constructor(socket, data){
        this.socket = socket;
        this.sceneManager = new SceneManager();

        this.name = 'Default';
        this.width = this.height = this.depth = 5;

        this.enemies = {};
        this.players = {};
        this.traps = {};
        this.doors = {};

        this.grid = {
            width : 5,
            depth : 5,
            height: 7,
            objects: {},
        };

        this.sceneManager.buildScene(data);

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