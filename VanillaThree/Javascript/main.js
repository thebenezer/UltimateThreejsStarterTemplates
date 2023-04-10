import './style.css'
import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import popSound from '/pop.mp3';

let controls, camera, renderer, scene;

const loadingMgr = new THREE.LoadingManager(
  //onLoad
  (()=>{
  }),
  //onProgress
  ((url, loaded, total)=>{
    console.log(url,loaded,total)
  }),
  //onError
  ((url)=>{
    console.log(url)
  })
)


const listener = new THREE.AudioListener();
const loader = new THREE.AudioLoader(loadingMgr);

const pop = new THREE.Audio(listener)

init();
requestAnimationFrame(tick);

function init() {
  // Camera
  camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    10,
    300,
  );
  camera.position.set(-70, 20, 70);

  // Scene
  scene = new THREE.Scene();
  // scene.background = new THREE.Color(0x292929);

  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true,alpha:true });
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.autoUpdate = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.LinearToneMapping;
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.render(scene, camera);
  renderer.domElement.style.zIndex="1";
  renderer.domElement.style.top = "0";
  renderer.domElement.style.left = "0";
  renderer.domElement.style.width = "100%";
  renderer.domElement.style.height = "100%";
  renderer.domElement.style.position="absolute";
  document.body.appendChild(renderer.domElement);

  // Fog
  scene.fog = new THREE.FogExp2(0x94acb0, 0.009);

  setupLights();
  setupOrbitControls();
  setupEventListeners();
  setupSounds();

  // ***** setup our scene *******

  // Box
  const geometry = new THREE.BoxGeometry(10, 10, 10);
  const boxMaterial = new THREE.MeshPhongMaterial({ color: 0x049ef4,emissive:0xff0000 });

  const box = new THREE.Mesh(geometry, boxMaterial);
  box.castShadow = true;
  box.receiveShadow = true;
  scene.add(box);

  // Floor
  const floorGeometry = new THREE.CylinderGeometry(30, 30, 300, 30);
  const floorMaterial = new THREE.MeshPhongMaterial({ color: 0xf0f0f0 });

  const floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.position.set(0, -150, 0);
  floor.receiveShadow = true;
  scene.add(floor);

}

// RAF Update the screen
function tick() {
  renderer.render(scene, camera);
  controls.update();
  window.requestAnimationFrame(tick);
}

// Audio setup
function setupSounds() {
  camera.add(listener);
  audioSetup(pop,popSound,0.3)
}

function audioSetup(sound, url, volume){
  loader.load(
    url,
    // onLoad callback
    function ( audioBuffer ) {
      // set the audio object buffer to the loaded object
      sound.setBuffer( audioBuffer );
      sound.setVolume(volume)
      sound.loop=false;
    },
  );
}

function setupLights() {
  // ***** Lights ****** //
  const ambLight = new THREE.AmbientLight(0xfefefe, 0.1);
  const rectLight = new THREE.DirectionalLight(0x00fff0, 0.6);
  rectLight.position.set(20, 30, -20);
  const dirLight = new THREE.DirectionalLight(0xfefefe, 1.5);
  dirLight.castShadow = true;
  dirLight.shadow.mapSize.width = 1024;
  dirLight.shadow.mapSize.height = 1024;
  dirLight.shadow.camera.far = 100;
  dirLight.shadow.camera.near = 1;
  dirLight.shadow.camera.top = 40;
  dirLight.shadow.camera.right = 40;
  dirLight.shadow.camera.bottom = -40;
  dirLight.shadow.camera.left = -40;

  dirLight.position.set(20, 30, 20);
  scene.add(ambLight, dirLight,rectLight);
}

function setupOrbitControls() {
  // OrbitControls
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableZoom = true;
  controls.enableRotate = true;
  controls.enableDamping = true;
  controls.autoRotate = false;
  controls.rotateSpeed = 1;
  controls.dampingFactor = 0.08;
  controls.minDistance = 30;
  controls.maxDistance = 120;
  controls.target.set(0, 20, 0);
  controls.maxPolarAngle = 4*(Math.PI / 7);
  controls.minPolarAngle = 1*(Math.PI / 7);
}

function setupEventListeners() {
  // Handle `resize` events
  window.addEventListener(
    'resize',
    () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();

      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    },
    false,
  );
  // Click to play pop sound
  window.addEventListener(
    'click',
    () => {
      if(!pop.isPlaying)
        pop.play();
    },
    false,
  );
}

