class SceneManager{
    constructor(){
        this.camera = new THREE.PerspectiveCamera(
            45,
            window.innerWidth/window.innerHeight,
            1,
            1000);
        this.controls = new THREE.OrbitControls(this.camera);
        this.camera.position.set(0,0,0);
        this.controls.update();
        this.scene = new THREE.Scene();
        this.manager = new THREE.LoadingManager();
        this.loader = new THREE.ObjectLoader(this.manager);
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        //this.loadModels();
        this.models = {};

        // EVENT LISTENERS
        window.onresize = this.onWindowResize;

        document.body.appendChild(this.renderer.domElement);

        this.animate();
    }
    animate(){
        requestAnimationFrame( this.animate.bind(this) );
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }

    loadModels(){
        let _this = this;

        /* The jsons are scenes, not meshes!  Problem! */
        //this.loader.load('floortile0.json', (text) => { _this.models['floor0'] = text; });
        //this.loader.load('walltile0.json', (text) => { _this.models['floor0'] = text; });

    }

    addFloorTile(){
        addCube(50,20,50, 0xffffff)
    }

    addCube(w, h, d, color){
        let geometry = new THREE.BoxBufferGeometry( w, h, d);
        let material = new THREE.MeshBasicMaterial( { color: color } );
        let mesh = new THREE.Mesh( geometry, material );
        this.scene.add( mesh );
        return mesh;
    }

    /* EVENT LISTENERS */

    onWindowResize() {
        if(this.camera){
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        }
    }
}