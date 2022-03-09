import './style.css'
import * as THREE from 'three'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'


// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Models
 */
const gltfLoader = new FBXLoader()
const textLoader = new FontLoader()

textLoader.load('./font/Hug Me Tight_Regular.json', (font)=>
{
    const geometry = new TextGeometry('Ded Frens', {
        font:font,
        size: 6,
        height: 2
    })
    geometry.center()

    const textMesh = new THREE.Mesh(geometry, [
        new THREE.MeshBasicMaterial({color: 0x010101}),
        new THREE.MeshBasicMaterial({color: 0x010101})
    ])

    scene.add(textMesh)
})

let mixer = null

gltfLoader.load(
    '/models/deadfrenz/fren.fbx',
    (fbx) =>
    {
        fbx.scale.set(0.01,0.01,0.01)
        mixer = fbx 
        mixer.position.set(-4.5, 0, 0)
        console.log(mixer)
        scene.add(mixer)
    }
)

// gui.add(debugObject, 'rotationY', 0, 10, 0.001).name('Rotation Y')

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xFF0000, 10)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xff0000, 10)
directionalLight.position.set(- 5, 5, 0)
scene.add(directionalLight)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

/**
 * Cursor
 */
 const cursor = {}
 cursor.x = 0
 cursor.y = 0
 window.addEventListener('mousemove', (event) =>
 {
    cursor.x = event.clientX / sizes.width - 0.5
    cursor.y = event.clientY / sizes.height - 0.5

 
 })
window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(0, 8, 15)
camera.lookAt(new THREE.Vector3)
scene.add(camera)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    // alpha: true,
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Fog
 */
 const fog = new THREE.Fog(0x5a5a5a, 2, 20)
 renderer.setClearColor(0x5a5a5a)
 scene.fog = fog
/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    const followY = - cursor.y
    const followX = cursor.x

    // Model animation
    if(mixer){
        mixer.position.y = Math.cos(elapsedTime -.5)
        mixer.rotation.y = Math.PI * 3.5
        mixer.rotation.y = Math.PI * 3.5
    }

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()