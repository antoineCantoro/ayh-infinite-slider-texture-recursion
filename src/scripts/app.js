import '../styles/main.css'
import * as THREE from 'three'
import * as dat from 'lil-gui'

import { lerp } from './utils'

import img1 from '/src/images/1.jpg'
import img2 from '/src/images/2.jpg'
import img3 from '/src/images/3.jpg'
import img4 from '/src/images/4.jpg'
import img5 from '/src/images/5.jpg'
import img6 from '/src/images/6.jpg'

import dist1 from '/src/images/dist1.jpg'
import dist2 from '/src/images/dist2.jpg'

import vertexShader from '/src/shaders/vertex.glsl'
import fragmentShader from '/src/shaders/fragment.glsl'

class App {
  constructor() {

    this.scroll = {
      scroll: 0,
      current: 0,
      target: 0,
    }

    this.getSizes()

    this.renderTarget = new THREE.WebGLRenderTarget(this.sizes.width, this.sizes.height, {
      format: THREE.RGBAFormat,
      magFilter: THREE.NearestFilter,
      minFilter: THREE.NearestFilter,
    })

    this.renderTarget1 = new THREE.WebGLRenderTarget(this.sizes.width, this.sizes.height, {
      format: THREE.RGBAFormat,
      magFilter: THREE.NearestFilter,
      minFilter: THREE.NearestFilter,
    })

    this.createRenderer()
    this.createCamera()
    this.createScene()
    this.createTextureLoader()
    this.createMeshes()
    this.createGui()
 

    
    this.backgroundQuad = new THREE.Mesh(
      new THREE.PlaneGeometry(3 * this.aspect, 3),
      this.materialQuad
    )
    // this.backgroundQuad.position.y = 0.5
    this.backgroundQuad.position.z = -0.5
    this.scene.add(this.backgroundQuad)

    this.initQuad()

    this.addEventListeners()

    this.animate()
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
    this.scene = new THREE.Scene()
  }

  createCamera() {
    const frustrumSize = 3
    this.aspect = this.sizes.width / this.sizes.height
    this.camera = new THREE.OrthographicCamera(
      frustrumSize * this.aspect / -2, 
      frustrumSize * this.aspect / 2, 
      frustrumSize / 2, 
      frustrumSize / -2, 
      -1000, 
      1000
    )

    this.camera.position.set(0,0,2)
  }

  createMeshes() {
    this.meshesLength = this.images.length
    this.margin = 0.1
    this.meshWidth = 1 + 0.1
    this.meshes = []

    this.geometry = new THREE.PlaneGeometry(1, 1, 1, 1)

    for (let i = 0; i < this.meshesLength; i++) {
      const material = new THREE.MeshBasicMaterial({ map: this.textures[i] })
      const mesh = new THREE.Mesh( this.geometry, material )
      mesh.position.x = this.meshWidth * i 
      this.scene.add(mesh)
      this.meshes.push(mesh)
    }
  }

  createRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true
    })
    this.renderer.setSize( this.sizes.width, this.sizes.height )
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.renderer.outputEncoding = THREE.sRGBEncoding
    document.body.appendChild( this.renderer.domElement )
  }

  createGui() {
    const settings = {
      progress: 0
    }
    this.gui = new dat.GUI()
    this.gui.add(settings, 'progress', 0, 1, 0.05)
  }

  createTextureLoader() {
    this.textureLoader = new THREE.TextureLoader()
    this.images = [img1, img2, img3, img4, img5, img6]
    this.textures = this.images.map(image => this.textureLoader.load(image))
  }

  initQuad() {
    this.sceneQuad = new THREE.Scene()

    this.materialQuad = new THREE.ShaderMaterial({
      extensions: {
        derivatives: '#extension GL_OES_standard_derivatives : enable'
      },
      side: THREE.DoubleSide,
      // color: 0xff0000,
      transparent: true,
      uniforms: {
        uTime: { value: 0 },
        uTexture: { value: null },
        uSpeed: { value: 0 },
        uDirection: { value: 0 },
        uDisp: { value: this.textureLoader.load(dist1) },
        uResolution: { value: new THREE.Vector4() },
      },
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
    })

    this.quad = new THREE.Mesh(
      new THREE.PlaneGeometry(3 * this.aspect, 3),
      this.materialQuad
    )

    this.sceneQuad.add(this.quad)
  }


  /**
   * Update
   */

  updateMeshes() { 
    this.wholeWidth = this.meshesLength * this.meshWidth
    this.meshes.forEach((mesh, i) => {
      mesh.position.x = 
        ((this.meshWidth * i + (this.scroll.current * 0.005) + 42069 * this.wholeWidth ) 
        % this.wholeWidth - 2 / this.meshWidth)
        - 1
    })
  }

  /**
   * Events
   */

  onResize() {
    this.getSizes()
    this.camera.aspect = this.sizes.width / this.sizes.height
    this.camera.updateProjectionMatrix()
    this.renderer.setSize( this.sizes.width, this.sizes.height )
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  }

  onMouseWheel(event) {
    this.scroll.target += event.wheelDelta * 0.1
  }

  addEventListeners() {
    window.addEventListener('resize', this.onResize.bind(this))
    document.addEventListener('wheel', this.onMouseWheel.bind(this))
  }

  animate() {
    this.scroll.current = lerp(this.scroll.current, this.scroll.target, 0.1)
    this.updateMeshes()

    window.requestAnimationFrame( this.animate.bind(this) )

    // Default texture
    this.renderer.setRenderTarget(this.renderTarget)
    this.renderer.render(this.scene, this.camera)

    // Render distorted texture
    this.renderer.setRenderTarget(this.renderTarget1)
    // this.renderer.setRenderTarget(null)
    this.materialQuad.uniforms.uTexture.value = this.renderTarget.texture 
    this.materialQuad.uniforms.uSpeed.value = Math.min(1, Math.abs((this.scroll.target - this.scroll.current) * 0.005))
    console.log((this.scroll.target - this.scroll.current) * 0.005);
    this.materialQuad.uniforms.uDirection.value = Math.sign(this.scroll.target - this.scroll.current) 
    this.renderer.render(this.sceneQuad, this.camera)

    // Final Scene
    this.renderer.setRenderTarget(null)
    this.backgroundQuad.material.map = this.renderTarget1.texture
    this.renderer.render(this.scene, this.camera)
  }
}

const app = new App()