import type { NoSerialize } from "@builder.io/qwik";
import {
  component$,
  noSerialize,
  useSignal,
  useStore,
  useVisibleTask$,
} from "@builder.io/qwik";
import * as THREE from "three";
import * as BufferGeometryUtils from "three/examples/jsm/utils/BufferGeometryUtils.js";

interface State {
  scene: NoSerialize<THREE.Scene>;
  camera: NoSerialize<THREE.PerspectiveCamera>;
  renderer: NoSerialize<THREE.WebGLRenderer>;
}

type ThreeJsSceneProps = {
  color: string;
};
export const ThreeJsScene = component$<ThreeJsSceneProps>((props) => {
  const canvas = useSignal<HTMLCanvasElement>();
  const state = useStore<State>({
    scene: noSerialize(undefined),
    camera: noSerialize(undefined),
    renderer: noSerialize(undefined),
  });

  useVisibleTask$(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      95,
      window.innerWidth / window.innerHeight,
      1,
      13
    );
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas.value,
    });
    state.scene = noSerialize(scene);
    state.camera = noSerialize(camera);
    state.renderer = noSerialize(renderer);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0.0);

    const SPHERE_RADIUS = 20;
    const LATITUDE_COUNT = 40;
    const LONGITUDE_COUNT = 80;
    const DOT_SIZE = 0.05;
    const DOT_COLOR = props.color;

    // Define an array to hold the geometries of all the dots.
    const dotGeometries = [];

    // Create a blank vector to be used by the dots.
    const vector = new THREE.Vector3();

    // Loop across the latitudes.
    for (let lat = 0; lat < LATITUDE_COUNT; lat += 1) {
      // Loop across the longitudes.
      for (let lng = 0; lng < LONGITUDE_COUNT; lng += 1) {
        // Create a geomtry for the dot.
        const dotGeometry = new THREE.CircleGeometry(DOT_SIZE, 5);
        // Defin the phi and theta angles for the dot.
        const phi = (Math.PI / LATITUDE_COUNT) * lat;
        const theta = ((2 * Math.PI) / LONGITUDE_COUNT) * lng;
        // Set the vector using the spherical coordinates generated from the sphere radius, phi and theta.
        vector.setFromSphericalCoords(SPHERE_RADIUS, phi, theta);
        // Make sure the dot is facing in the right direction.
        dotGeometry.lookAt(vector);
        // Move the dot geometry into position.
        dotGeometry.translate(vector.x, vector.y, vector.z);
        // Push the positioned geometry into the array.
        dotGeometries.push(dotGeometry);
      }
    }

    // Merge all the dot geometries together into one buffer geometry.
    const mergedDotGeometries =
      BufferGeometryUtils.mergeBufferGeometries(dotGeometries);

    // Define the material for the dots.
    const dotMaterial = new THREE.MeshBasicMaterial({
      color: DOT_COLOR,
      side: THREE.DoubleSide,
      opacity: 0.5,
    });

    // Create the dot mesh from the dot geometries and material.
    const dotMesh = new THREE.Mesh(mergedDotGeometries, dotMaterial);

    // Add the dot mesh to the scene.
    scene.add(dotMesh);
    camera.position.set(0, 0, 0);
    renderer.render(scene, camera);

    // Helpers
    // const pointLight = new THREE.PointLight(0xffffff);
    // pointLight.position.set(5, 5, 5);
    // const lightHelper = new THREE.PointLightHelper(pointLight);
    // scene.add(lightHelper);
    // const gridHelper = new THREE.GridHelper(200, 50);
    // scene.add(gridHelper);

    // Scroll Animation
    const moveCamera = () => {
      const t = document.body.getBoundingClientRect().top;
      camera.position.z = t * -0.01;
    };
    document.body.onscroll = moveCamera;
    moveCamera();

    // Animate the scene using the browser's native requestAnimationFrame method.
    const animate = (time: any) => {
      // Reduce the current timestamp to something manageable.
      time *= 0.001;
      // Update the dot mesh rotation.
      dotMesh.rotation.y = time * 0.1;
      // Update the orbit controls now that things have changed.
      // controls.update();
      // Re-render the scene and trigger another animation frame.
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    // Trigger the first animation frame.
    requestAnimationFrame(animate);

    // Establish the canvas size and call the function to render the scene.
    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight - 115);
    }
    window.addEventListener("resize", onWindowResize);
    onWindowResize();
  });

  return (
    <canvas
      class="absolute left-0 top-0 z-0 opacity-60 duration-300 animate-in fade-in zoom-in dark:opacity-20"
      ref={canvas}
      id="canvas"
    ></canvas>
  );
});
