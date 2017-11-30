const TILE_WIDTH = 3;
const TILE_HEIGHT = 3;
const TILE_GAP = 0;
const WALL_HEIGHT = 3;

class SceneManager{
    constructor(){
        this.camera = new THREE.PerspectiveCamera(
            45,
            window.innerWidth/window.innerHeight,
            1,
            1000);
        this.controls = new THREE.OrbitControls(this.camera);
        this.camera.position.set(20,20,20);
        this.controls.update();
        this.scene = new THREE.Scene();
        this.manager = new THREE.LoadingManager();
        this.texLoader = new THREE.TextureLoader();
        this.objectLoader = new THREE.ObjectLoader(this.manager);
        this.objLoader = new THREE.OBJLoader();
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        // Add lights to scene
        let ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);
        let directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        this.scene.add(directionalLight);

        this.wallTiles = [];

        // EVENT LISTENERS
        window.onresize = function(){
            if(this.camera){
                this.camera.aspect = window.innerWidth / window.innerHeight;
                this.camera.updateProjectionMatrix();
                this.renderer.setSize(window.innerWidth, window.innerHeight);
            }
        }.bind(this);

        document.body.appendChild(this.renderer.domElement);

        this.animate();
    }
    animate(){
        requestAnimationFrame( this.animate.bind(this) );
        this.controls.update();
        this.renderer.render(this.scene, this.camera);

        // Handle wall transparency
        for(var i=0; i<this.wallTiles.length; i++){
            if(this.wallTiles[i].position.distanceTo(this.camera.position) < 30)
                this.wallTiles[i].material.opacity = 0;
            else
                this.wallTiles[i].material.opacity = 1;
        }

    }

    loadModels(){
        let _this = this;

        /* The jsons are scenes, not meshes!  Problem! */
        //this.objectLoader.load('floortile0.json', (text) => { _this.models['floor0'] = text; });
        //this.objectLoader.load('walltile0.json', (text) => { _this.models['floor0'] = text; });

    }

    loadMaterial(path){
        let texture = this.texLoader.load(
            // resource URL
            path,
            // Function when resource is loaded
            function(texture){}, 
            {}, // called while loading
            // Function called when download errors
            function(xhr){ console.error( 'An error happened' ); }
        );
        return (new THREE.MeshBasicMaterial({map: texture}));
    }

    loadOBJ(path, cb){
        let object = this.objLoader.load(
            // resource URL
            path,
            // called when resource is loaded
            function(object){ cb(object) }, 
            () => {}, // called while loading
            // called when loading has errors
            function(error){ console.log( 'An error happened' ); }
        );
    }

    addCube(w, h, d, path){
        let geometry = new THREE.BoxBufferGeometry( w, h, d);
        let material = this.loadMaterial(path);
        material.wrapS = THREE.RepeatWrapping;
        material.wrapT = THREE.RepeatWrapping;
        //material.lights = true;
        let mesh = new THREE.Mesh( geometry, material);
        this.scene.add( mesh );
        return mesh;
    }

    addPlane(w, h, color){
        var geometry = new THREE.PlaneGeometry( w, h, 32 );
        var material = new THREE.MeshBasicMaterial( {color: color, side: THREE.DoubleSide} );
        var plane = new THREE.Mesh( geometry, material );
        this.scene.add( plane );
        return plane;
    }

    addWallTile(x,z){
        for(let y=0; y<WALL_HEIGHT; y++){
            let p = this.addCube(
                TILE_WIDTH-TILE_GAP,
                TILE_HEIGHT,
                TILE_WIDTH-TILE_GAP,
                'stonetile3.jpg');
            p.material.transparent = true;
            p.position.set(x*TILE_WIDTH, TILE_HEIGHT*y + TILE_HEIGHT/2, z*TILE_WIDTH);
            this.wallTiles.push(p);
        }
    }

    addFloorTile(x,z, tex){
        let p = this.addCube(
            TILE_WIDTH-TILE_GAP,
            TILE_HEIGHT,
            TILE_WIDTH-TILE_GAP, 
            tex || 'stonetile1.jpg');
        p.position.set(x*TILE_WIDTH, TILE_HEIGHT/2, z*TILE_WIDTH);
    }

    addDoorTile(x,z,rot){
        this.loadOBJ('gate.obj', function(obj){
            let material = this.loadMaterial('rusty test.jpg');
            obj.traverse( function(child){
                if (child instanceof THREE.Mesh) child.material = material;
            });
            obj.rotation.set(0,rot,0);
            obj.scale.set(0.3,0.3,0.3);
            if(rot > 0)
                obj.position.set(x*TILE_WIDTH,TILE_HEIGHT,z*TILE_WIDTH-TILE_WIDTH/2);
            else 
                obj.position.set(x*TILE_WIDTH+TILE_WIDTH/2,TILE_HEIGHT,z*TILE_WIDTH);
            this.scene.add(obj);
        }.bind(this));
    }

    buildScene(data){
        if(!data) return;
        // We expect scene data to look something like this:
        //
        // data.xSize   (tile size of zone on x-axis)
        // data.zSize   (tile size of zone on z-axis)
        // data.tiles   (string rep. tile layout)
        // data.players (player info)

        // Build the map out of tiles
        let i=0;
        while(i < data.tiles.length){
            let z = i%(data.zSize);
            let x = Math.floor(i/data.xSize);
            switch(data.tiles[i]){
                case 'd':
                let testPos = data.tiles[i+data.xSize];
                let testNeg = data.tiles[i-data.xSize];
                let valid = 'wd';
                if(valid.includes(testPos) || valid.includes(testNeg))
                    this.addDoorTile(x-data.xSize/2,z-data.zSize/2, 0);
                else
                    this.addDoorTile(x-data.xSize/2,z-data.zSize/2, Math.PI/2);
                this.addFloorTile(x-data.xSize/2, z-data.zSize/2, 'stonetile3.jpg');
                break;
                case 'f':
                this.addFloorTile(x-data.xSize/2,z-data.zSize/2);
                break;
                case 'w':
                this.addWallTile(x-data.xSize/2,z-data.zSize/2);
                break;
                default:
                break;
            }
            i++;
        }
    }

    // This probably causes memory leaks (not disposing assoc. mats, texs, etc.)
    clearScene(){
        while(this.scene.children.length > 0) this.scene.remove(this.scene.children[0]);
    }
}