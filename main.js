import * as THREE from "three";
import './style.css';
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import gsap from "gsap";

const textureLoader=new THREE.TextureLoader()
const cloth = textureLoader.load("textures/cloth.jpg");
const lava = textureLoader.load("textures/lava.jpg");
let texture= lava

texture.minFilter = THREE.NearestFilter;
texture.magFilter = THREE.NearestFilter;
texture.generateMipmaps = false;
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const canvas = document.querySelector(".webgl");

const scene = new THREE.Scene();

const material = new THREE.MeshStandardMaterial({
  map: texture,
  roughness: 0.1,
});
material.displacementMap = texture;
material.displacementScale = 0.1;

const mesh = new THREE.Mesh(
  new THREE.SphereGeometry(3, 64, 64),
  material
);
scene.add(mesh);

const light = new THREE.PointLight(0xffffff, 70, 100, 1.7);
light.position.set(10, 10, 10);
scene.add(light);

scene.add(light);

const camera = new THREE.PerspectiveCamera(
  45,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 10;
scene.add(camera);

const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enablePan = false;
controls.enableZoom = false;
controls.autoRotate = true;
controls.autoRotateSpeed = 2;

canvas.addEventListener(
  "wheel",
  (e) => {
    e.preventDefault();
  },
  { passive: false }
);

window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
});

const animate = () => {
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(animate);
};
animate();

const timeline = gsap.timeline({ defaults: { duration: 1 } });
timeline.fromTo(mesh.scale, { z: 0, x: 0, y: 0 }, { z: 1, x: 1, y: 1 });
timeline.fromTo("nav", { y: "-100%" }, { y: "0%" });
timeline.fromTo(".title", { opacity: 0 }, { opacity: 1 });

//color
let mouseDown = false;
let rgb = [];
window.addEventListener("mousedown", () => {
  mouseDown = true;
});
window.addEventListener("mouseup", () => {
  mouseDown = false;
});

window.addEventListener("mousemove", (event) => {
  if (mouseDown) {
    rgb = [
      Math.round((event.pageX / sizes.width) * 255),
      Math.round((event.pageY / sizes.height) * 255),
      150,
    ];

    let newColor = new THREE.Color(`rgb(${rgb.join(",")})`);
    gsap.to(mesh.material.color, {
      r: newColor.r,
      g: newColor.g,
      b: newColor.b,
    });
  }
});

window.addEventListener("keydown",(event)=>{
  if (event.key === " ") {
    if(material.wireframe == true){
      material.wireframe=false
    }else{
      material.wireframe=true
    }
    
  } 
})
window.addEventListener("keydown", function (event) {
  if (event.key === "ArrowUp") {
    material.displacementScale += 0.06;
    
  }else if (event.key === "ArrowDown"){
    material.displacementScale -= 0.06;
  }
});

document.addEventListener("keydown", function (event) {
  if (event.key === "ArrowLeft") {
    controls.autoRotateSpeed-=3
  } else if (event.key === "ArrowRight") {
    controls.autoRotateSpeed += 3;
  }
  console.log(controls.autoRotateSpeed)
});

document.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    if (texture == lava) {
      texture = cloth;
      console.log(1);
    } else {
      texture = lava;
    }
    material.map = texture;
    material.needsUpdate = true;
    renderer.render(scene, camera);
  }
});