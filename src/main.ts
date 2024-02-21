import * as OBC from "openbim-components"
import * as THREE from "three"

const viewer = new OBC.Components()

const sceneComponent = new OBC.SimpleScene(viewer);
sceneComponent.setup();
viewer.scene = sceneComponent;

const viewerContainer = document.getElementById("app") as HTMLDivElement;
const rendererComponent = new OBC.PostproductionRenderer(viewer, viewerContainer);
viewer.renderer = rendererComponent;
const postproduction = rendererComponent.postproduction;

const cameraComponent = new OBC.OrthoPerspectiveCamera(viewer);
viewer.camera = cameraComponent;

const raycasterComponent = new OBC.SimpleRaycaster(viewer);
viewer.raycaster = raycasterComponent;

await viewer.init();
postproduction.enabled = true;

const grid = new OBC.SimpleGrid(viewer, new THREE.Color(0x333333));
postproduction.customEffects.excludedMeshes.push(grid.get());

const culler = new OBC.ScreenCuller(viewer);
await culler.setup();
cameraComponent.controls.addEventListener("sleep", () => {
  culler.needsUpdate = true;
})

const ifcLoader = new OBC.FragmentIfcLoader(viewer);
await ifcLoader.setup();

const scene = sceneComponent.get();
scene.background = null;

let model: any;
async function loadIfc() {
  const fetched = await fetch("./test.ifc");
  const arrayBuffer = await fetched.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);
  model = await ifcLoader.load(buffer, "example");
  scene.add(model);
  culler.needsUpdate = true;
}

loadIfc();

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const position = urlParams.get('position');

const controls = cameraComponent.controls;
if(position === '1') {
  controls.setLookAt(
    5.44, 1.77, -11.15,6.76, 1.53, -9.17
  )
}

// controls.addEventListener('sleep', () => {
//   const vector = new THREE.Vector3();
//   controls.getPosition(vector)
//   console.log(vector.x, vector.y, vector.z);
//   controls.getTarget(vector)
//   console.log(vector.x, vector.y, vector.z);
// })