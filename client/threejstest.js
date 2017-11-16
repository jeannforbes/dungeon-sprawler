'use strict';

// DOM elements
let scene, camera, renderer;
let container;
let chat, chatbox, chatbutton;

let cameraMove = {
    x: 0,
    y: 0,
    z: 0,
    speed: 0.1
};

let models = [];

const init = () => {

    /* Set up three.js */
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( 
        75,     // FOV in degrees
        window.innerWidth / window.innerHeight, // aspect ratio
        0.1,    // near clipping plane
        1000 ); // far clipping plane
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    // Appends the canvas to the main body
    document.body.appendChild(renderer.domElement);

    /* Set up keyboard controls*/

    setupScene();
    setupListeners();
    animate();

};

const setupScene = () => {
    let geometry = new THREE.BoxGeometry( 1, 1, 1 );
    let material = new THREE.MeshBasicMaterial( { color: 0x888888 } );
    models.push(new THREE.Mesh(geometry, material));
    scene.add(models[0]);

    camera.position.z = 10;
}

const animate = () => {
    requestAnimationFrame(animate.bind(this));
    renderer.render(scene,camera);

    // Update camera position
    camera.position.x += cameraMove.x;
    camera.position.y += cameraMove.y;
    camera.position.z += cameraMove.z;
    camera.updateProjectionMatrix();

    models[0].rotation.x += 0.01;
    models[0].rotation.y += 0.01;
}

const setupListeners = () => {
    // Resizes camera & renderer on window resize
    window.onresize = (e) => {
        camera.aspect = window.innerWidth/window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    window.onkeydown = (e) => {
        switch(e.keyCode){
            case 87: // W
            cameraMove.z = -1 * cameraMove.speed;
            break;
            case 65: // A
            cameraMove.x = -1 * cameraMove.speed;
            break;
            case 83: // S
            cameraMove.z = cameraMove.speed;
            break;
            case 68: // D
            cameraMove.x = cameraMove.speed;
            break;
            default:
            break;
        }
    }

    window.onkeyup = (e) => {
        switch(e.keyCode){
            case 87: // W
            cameraMove.z = 0;
            break;
            case 65: // A
            cameraMove.x = 0;
            break;
            case 83: // S
            cameraMove.z = 0;
            break;
            case 68: // D
            cameraMove.x = 0;
            break;
            default:
            break;
        }
    }
}

/*
 *  HELPER FUNCTIONS
 */

const addElement = (type, id, parent) => {
    let temp = document.createElement(type);
    temp.id = id;
    parent.append(temp);
    return temp;
}

window.onload = init;