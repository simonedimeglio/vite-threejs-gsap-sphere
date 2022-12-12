import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import gsap from "gsap";
import "./style.css";
// Scene
const scene = new THREE.Scene();

// Create our sphere
const geometry = new THREE.SphereGeometry(3, 64, 64);
const material = new THREE.MeshStandardMaterial({
	color: "#464646",
	roughness: 0.5,
});
const mesh = new THREE.Mesh(geometry, material); // a combination between geometry and material
scene.add(mesh);

// Sizes
const sizes = {
	width: window.innerWidth,
	height: window.innerHeight,
};

// Light
const light = new THREE.PointLight(0xffffff, 1, 100);
light.position.set(0, 10, 10); // X Y Z position
light.intensity = 1.25;
scene.add(light);

// Create our camera
const camera = new THREE.PerspectiveCamera(
	45,
	sizes.width / sizes.height,
	0.1,
	100,
); // First parameter: Field of view | Second Parameter: Aspect Ratio (800x600 in this case) | Third parameter: closest point | Fourth Parameter: Farest point
camera.position.z = 20;
scene.add(camera);

// Rendering scene on screen
const canvas = document.querySelector(".webgl");
const renderer = new THREE.WebGL1Renderer({ canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(2);
renderer.render(scene, camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enablePan = false; // Disable Pan
controls.enableZoom = false; // Disable Zoom
controls.autoRotate = true; // Autorotate
controls.autoRotateSpeed = 5; // Autorotate speed

// Resize
window.addEventListener("resize", () => {
	// Update Sizes
	sizes.width = window.innerWidth;
	sizes.height = window.innerHeight;
	// Update Camera
	camera.aspect = sizes.width / sizes.height;
	camera.updateProjectionMatrix();
	renderer.setSize(sizes.width, sizes.height);
});

const loop = () => {
	controls.update();
	renderer.render(scene, camera);
	window.requestAnimationFrame(loop);
};
loop();

// Timeline
const tl = gsap.timeline({ defaults: { duration: 1 } }); // Sync multiple animation togheter
tl.fromTo(mesh.scale, { z: 0, x: 0, y: 0 }, { z: 1, x: 1, y: 1 }); // Open animation
tl.fromTo("nav", { y: "-100%" }, { y: "0%" });
tl.fromTo(".title", { opacity: 0 }, { opacity: 1 });

// Mouse Animation Color
let mouseDown = false;
let rgb = [];
window.addEventListener("mouseup", () => (mouseDown = false));
window.addEventListener("mousedown", () => (mouseDown = true));

window.addEventListener("mousemove", (e) => {
	if (mouseDown) {
		rgb = [
			Math.round((e.pageX / sizes.width) * 255),
			Math.round((e.pageY / sizes.height) * 255),
			150,
		];

		// Animate
		let newColor = new THREE.Color(`rgb(${rgb.join(",")})`);
		gsap.to(mesh.material.color, {
			r: newColor.r,
			g: newColor.g,
			b: newColor.b,
		});
	}
});
