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
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        let directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        this.scene.add(directionalLight);

        // EVENT LISTENERS
        window.addEventListener('resize', function(){
            if(this.camera){
                this.camera.aspect = window.innerWidth / window.innerHeight;
                this.camera.updateProjectionMatrix();
                this.renderer.setSize(window.innerWidth, window.innerHeight);
            }
        }, false);

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
        //this.objectLoader.load('floortile0.json', (text) => { _this.models['floor0'] = text; });
        //this.objectLoader.load('walltile0.json', (text) => { _this.models['floor0'] = text; });

    }

    loadMaterial(path){
        let texture = this.texLoader.load(
            // resource URL
            path,
            // Function when resource is loaded
            function ( texture ) {
                // in this example we create the material when the texture is loaded
                var material = new THREE.MeshBasicMaterial( {
                    map: texture
                 } );
            },
            // Function called when download progresses
            function ( xhr ) {
                console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
            },
            // Function called when download errors
            function ( xhr ) {
                console.error( 'An error happened' );
            }
        );
        return (new THREE.MeshBasicMaterial({map: texture}));
    }

    addCube(w, h, d, path){
        let geometry = new THREE.BoxBufferGeometry( w, h, d);
        let material = this.loadMaterial(path);
        material.wrapS = THREE.RepeatWrapping;
        material.wrapT = THREE.RepeatWrapping;
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
}