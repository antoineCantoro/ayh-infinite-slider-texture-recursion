import './style.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'lil-gui';

import vertexShader from '/src/shaders/vertex.glsl'
import fragmentShader from '/src/shaders/fragment.glsl'

class App {
  constructor() {
    this.getSizes();
    this.createRenderer();
    this.createCamera();
    this.createScene();
    this.createMesh();
    this.createGui();
    this.createControl();

    this.addEventListeners();

    this.animate();
  }

  getSizes() {
    this.sizes = {
      width: window.innerWidth,
      height: window.innerHeight
    }
  }

  /**
   * Create
   */

  createScene() {
    this.scene = new THREE.Scene();
  }

  createCamera() {
    this.camera = new THREE.PerspectiveCamera( 75, this.sizes.width / this.sizes.height, 0.1, 1000 );
    this.camera.position.z = 5;
    this.camera.updateProjectionMatrix();
  }

  createMesh() {
    this.geometry = new THREE.BoxGeometry( 1, 1, 1 );
    this.material = new THREE.ShaderMaterial({
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      // wireframe: true,
      uniforms: {
        uTime: { value: 0 },
        uProgress: { value: 0 }
      }
    })
    this.cube = new THREE.Mesh( this.geometry, this.material );
    this.scene.add( this.cube );
  }

  createRenderer() {
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize( this.sizes.width, this.sizes.height );
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    document.body.appendChild( this.renderer.domElement );
  }

  createGui() {
    const settings = {
      progress: 0
    }
    this.gui = new dat.GUI()
    this.gui.add(settings, 'progress', 0, 1, 0.05)
  }

  createControl() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    this.controls.enableDamping = true
  }

  /**
   * Events
   */

  onResize() {
    this.getSizes()
    this.camera.aspect = this.sizes.width / this.sizes.height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize( this.sizes.width, this.sizes.height );
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  }

  addEventListeners() {
    window.addEventListener('resize', this.onResize.bind(this));
  }

  animate() {
    window.requestAnimationFrame( this.animate.bind(this) );

    this.controls.update();
  
    this.cube.rotation.x += 0.005;
    this.cube.rotation.y += 0.005;
  
    this.renderer.render( this.scene, this.camera );
  }
}

const app = new App();