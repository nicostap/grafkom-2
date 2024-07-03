import * as THREE from "three";
import { Clown, Victim } from "./model/character";
import { Input } from "./input";
import { MeshBVH } from "three-mesh-bvh";
import { acceleratedRaycast } from "three-mesh-bvh";
import manager, { isFinished } from "./loading";
import { GLTFObject } from "./model/gtlf";
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';


THREE.Mesh.prototype.raycast = acceleratedRaycast;

class BoundedGeometry extends THREE.BufferGeometry {
  boundsTree: any;
  constructor(bg: THREE.BufferGeometry) {
    super();
    this.copy(bg);
    this.boundsTree = new MeshBVH(this as THREE.BufferGeometry);
  }
}

function radToDeg(rad: number) {
  return rad * (180 / Math.PI);
}

function vectorAngle(x: number, y: number) {
  if (x == 0) return y > 0 ? 90 : y == 0 ? 0 : 270;
  else if (y == 0) return x >= 0 ? 0 : 180;
  let ret = radToDeg(Math.atan(y / x));
  if (x < 0 && y < 0) ret = 180 + ret;
  else if (x < 0) ret = 180 + ret;
  else if (y < 0) ret = 270 + (90 + ret);
  return ret;
}

export function renderMain() {
  // Initial Set Up
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  document.body.appendChild(renderer.domElement);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    2000
  );

  GLTFObject.scene = scene;
  GLTFObject.renderer = renderer;
  GLTFObject.camera = camera;

  // const controls = new OrbitControls(camera, renderer.domElement);
  // controls.enableDamping = false; // an animation loop is required when either damping or auto-rotation is enabled
  // controls.dampingFactor = 0.05;
  // controls.screenSpacePanning = false;
  // controls.minDistance = 200;
  // controls.maxDistance = 400;
  // controls.maxPolarAngle = Math.PI / 2;
  // controls.enableZoom = true;
  // controls.autoRotate = false;


  // Map Generation

  const maps: number[][][] = [
    [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 0],
        [0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0],
        [0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0],
        [0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0],
        [0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0],
        [0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0],
        [0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0],
        [0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ],[
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
      [0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0],
      [0, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 0],
      [0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0],
      [0, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 0],
      [0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0],
      [0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0],
      [0, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0],
      [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
      [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
      [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
      [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ],[
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
      [0, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 0],
      [0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0],
      [0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0],
      [0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0],
      [0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0],
      [0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0],
      [0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0],
      [0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
      [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
      [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
      [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ],[
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
      [0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0],
      [0, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 0],
      [0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0],
      [0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0],
      [0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0],
      [0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0],
      [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
      [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
      [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
      [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ],[
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
      [0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0],
      [0, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 0],
      [0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0],
      [0, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0],
      [0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0],
      [0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0],
      [0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0],
      [0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0],
      [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0],
      [0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0],
      [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
      [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  ]
    // Define more maps similarly
];

  // Function to select a random map
  function getRandomMap(): number[][] {
      const randomIndex = Math.floor(Math.random() * maps.length);
      return maps[randomIndex];
  }

  const map = getRandomMap();
  console.log(map);

  const wallCollisionBoxes: THREE.Box3[] = [];
  const walls: THREE.Object3D[] = [];
  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[i].length; j++) {
      if (map[i][j] == 0) {
        // Wall
        let wall = new GLTFObject(
          "./assets/Wall Modular.glb",
          new THREE.Vector3(i * 500 - 500, 250, j * 500 - 500),
          new THREE.Vector3(0, 0, 0),
          new THREE.Vector3(1, 1, 1),
          () => {
            wall.object!.scale.set(250, 250, 250);
            wallCollisionBoxes.push(new THREE.Box3().setFromObject(wall.object!));
            walls.push(wall.object!);
          }
        );
      } else if (map[i][j] == 1) {
        // Floor
        let floor = new GLTFObject(
          "./assets/Floor Tile.glb",
          new THREE.Vector3(i * 500 - 500, 0, j * 500 - 500),
          new THREE.Vector3(0, 0, 0),
          new THREE.Vector3(5, 1, 5),
          () => {
            
            floor.object!.scale.set(250, 250, 250);
          }
        );
      }
    }
  }

  // Map Scene 2
  new GLTFObject(
    "./assets/maps/street.glb",
    new THREE.Vector3(10000, 0, 0),
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(60, 60, 60)
  )

  // Map Scene 1
  new GLTFObject(
    "./assets/maps/bar_indoor.glb",
    new THREE.Vector3(0, 0, 10000),
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(60, 60, 60)
  )

  // Light
  const pLight = new THREE.PointLight(0xffffff, 100000);
  pLight.castShadow = true;
  // Set up shadow properties for the light
  pLight.shadow.mapSize.width = 1024;
  pLight.shadow.mapSize.height = 1024;
  pLight.shadow.camera.near = 0.5;
  pLight.shadow.camera.far = 450;
  scene.add(pLight);

  // Input
  const input = new Input();

  // Clown
  let clown = new Clown(scene);
  let target = new THREE.Vector3(1500, 0, 3000);

  // Victim
  let victim = new Victim(scene);

  // Animation
  let isTerminated = false;
  let cameraAngle = 0;
  let cameraDistance = 200;
  let defaultCameraDistance = 200;
  let cameraModes = { FPS: 1, TPS: 2, OVER: 3, FREEROAM: 4};
  let cameraMode = cameraModes.TPS;

  window.addEventListener("keydown", (e) => {
    if (e.key.toLowerCase() == "x") {
      if (cameraMode == cameraModes.OVER) return false;
      if (clown.object) {
        cameraMode =
          cameraMode == cameraModes.FPS ? cameraModes.TPS : cameraModes.FPS;
        if (cameraMode == cameraModes.TPS) {
          cameraAngle = victim.angle;
          victim.object!.visible = true;
        } else {
          victim.object!.visible = false;
        }
      }
    }
  });

  {
    let renderLoop = 0;
    var time_prev = 0;
    var statusGame = 1
    function animate(time: number) {
      // Time
      var dt = time - time_prev;
      dt *= 0.001;
      time_prev = time;
      renderLoop++;

      if (renderLoop >= 15) {
        if (statusGame != 3){
          // Clown
        if (clown.object) {
          // Pathfinding Logic
          let inputClown = { w: true, a: false, d: false, " ": true };
          let nposition = clown.object.position.clone();
          nposition.add(
            new THREE.Vector3(
              (dt / 0.016) * 45 * Math.sin(clown.angle),
              0,
              (dt / 0.016) * 45 * Math.cos(clown.angle)
            )
          );

          let ncollision = new THREE.Sphere(nposition, 45);
          for (let collisionTarget of wallCollisionBoxes) {
            if (ncollision.intersectsBox(collisionTarget)) {
              inputClown.w = false;
            }
          }
          if (clown.object.position.distanceTo(target) < 35)
            inputClown.w = false;
          let sightResults = clown.getDistanceToWall(walls);
          if (sightResults[0] <= 240 && sightResults[0] < sightResults[2]) {
            inputClown.d = true;
          } else if (
            sightResults[2] <= 240 &&
            sightResults[0] > sightResults[2]
          ) {
            inputClown.a = true;
          } else if (sightResults[1] <= 240) {
            if (sightResults[0] < sightResults[2]) inputClown.d = true;
            else inputClown.a = true;
          } else {
            let distVector = new THREE.Vector3();
            distVector.subVectors(target, clown.object.position).normalize();
            let distAngle = vectorAngle(distVector.z, distVector.x);
            let subAngle =
              ((distAngle % 360) - (radToDeg(clown.angle) % 360) + 360) % 360;
            if (subAngle <= 177) {
              inputClown.a = true;
            } else if (subAngle >= 183) {
              inputClown.d = true;
            }
          }

          if (cameraMode == cameraModes.OVER) inputClown.w = false;
          clown.run(dt, wallCollisionBoxes, inputClown);
        }

        // Victim
        if (victim.object) {
          target = victim.object.position.clone();
          victim.object.scale.set(1.2, 1.2, 1.2);
          victim.run(dt, wallCollisionBoxes, input.keyPressed);
          pLight.position.set(
            victim.object.position.x,
            400,
            victim.object.position.z
          );
          if (cameraMode == cameraModes.TPS) {
            if (input.keyPressed["q"]) cameraAngle += (3 * Math.PI) / 180;
            if (input.keyPressed["e"]) cameraAngle -= (3 * Math.PI) / 180;
            if (input.keyPressed["a"])
              cameraAngle += ((dt / 0.016) * 2 * Math.PI) / 180;
            if (input.keyPressed["d"])
              cameraAngle -= ((dt / 0.016) * 2 * Math.PI) / 180;
            // To Prevent Camera Clipping
            cameraDistance = defaultCameraDistance;
            let cameraClipped;
            do {
              cameraClipped = false;
              camera.position.set(
                victim.object.position.x -
                  cameraDistance * Math.sin(cameraAngle),
                150 +
                  victim.object.position.y +
                  cameraDistance * Math.sin(Math.PI / 9),
                victim.object.position.z -
                  cameraDistance * Math.cos(cameraAngle)
              );
              for (let collisionTarget of wallCollisionBoxes) {
                if (collisionTarget.containsPoint(camera.position))
                  cameraClipped = true;
              }
              cameraDistance -= 2;
            } while (cameraClipped);
            camera.lookAt(
              victim.object.position.x,
              150,
              victim.object.position.z
            );
          } else if (cameraMode == cameraModes.FPS) {
            camera.position.set(
              victim.object.position.x,
              185,
              victim.object.position.z
            );
            camera.rotation.set(0, victim.angle + Math.PI, 0);
          }
          if (cameraMode == cameraModes.TPS) {
            // controls.enabled = true;
            // camera.position.set(
            //   victim.object.position.x - cameraDistance * Math.sin(cameraAngle),
            //   150 + victim.object.position.y + cameraDistance * Math.sin(Math.PI / 9),
            //   victim.object.position.z - cameraDistance * Math.cos(cameraAngle)
            // );
            // controls.target.set(victim.object.position.x, 150, victim.object.position.z);
          } else if (cameraMode == cameraModes.FPS) {
            // controls.enabled = false;
            camera.position.set(
              victim.object.position.x,
              185,
              victim.object.position.z
            );
            camera.rotation.set(0, victim.angle + Math.PI, 0);
          }
        }

        // Gameover
        if (victim.object && clown.object) {
          if (clown.object.position.distanceTo(victim.object.position) < 200) {
            // controls.enabled = false;
            // controls.target.set(clown.object.position.x, 185, clown.object.position.z)
            camera.position.set(
              clown.object.position.x + 40 * Math.sin(clown.angle),
              185,
              clown.object.position.z + 40 * Math.cos(clown.angle)
            );
            clown.crossFade(clown.currentState, "Idle", 0.01);
            camera.lookAt(
              clown.object.position.x,
              185,
              clown.object.position.z
            );
            victim.object.visible = false;
            cameraMode = cameraModes.OVER;
          }
        }
        }
      } else {

        // camera logic
        window.addEventListener("keypress", (e) => {
          const movementSpeed = 0.1;
          const rotationSpeed = 0.02;
          
          if (input.keyPressed["q"]) cameraAngle += (3 * Math.PI) / 180;
          switch (e.key) {
              case 'w':
                  // Move forward
                  const forward = getCameraForwardVector();
                  camera.position.add(forward.multiplyScalar(movementSpeed));
                  break;
              case 's':
                  // Move backward
                  const backward = getCameraForwardVector();
                  camera.position.add(backward.multiplyScalar(-movementSpeed));
                  break;
              case 'a':
                  // Move left
                  const left = getCameraLeftVector();
                  camera.position.add(left.multiplyScalar(movementSpeed));
                  break;
              case 'd':
                  // Move right
                  const right = getCameraRightVector();
                  camera.position.add(right.multiplyScalar(movementSpeed));
                  break;
              case 'q':
                  // Move up
                  camera.position.y += movementSpeed;
                  break;
              case 'e':
                  // Move down
                  camera.position.y -= movementSpeed;
                  break;
              case 'ArrowUp':
                  // Rotate up (pitch up)
                  camera.rotateX(-rotationSpeed);
                  break;
              case 'ArrowDown':
                  // Rotate down (pitch down)
                  camera.rotateX(rotationSpeed);
                  break;
              case 'ArrowLeft':
                  // Rotate left (yaw left)
                  camera.rotateY(-rotationSpeed);
                  break;
              case 'ArrowRight':
                  // Rotate right (yaw right)
                  camera.rotateY(rotationSpeed);
                  break;
          }
      });
      
      function getCameraForwardVector() {
          const vector = new THREE.Vector3(0, 0, -1);
          vector.applyQuaternion(camera.quaternion);
          return vector;
      }
      
      function getCameraLeftVector() {
          const vector = new THREE.Vector3(-1, 0, 0);
          vector.applyQuaternion(camera.quaternion);
          return vector;
      }
      
      function getCameraRightVector() {
          const vector = new THREE.Vector3(1, 0, 0);
          vector.applyQuaternion(camera.quaternion);
          return vector;
      }
      }
      // Teleportation Logic
    window.addEventListener("keydown", (e) => {
      if (e.key === "1") {
        statusGame = 1
        // Define your teleportation destination here
        const teleportDestination = new THREE.Vector3(0, 0, 0);
        // Teleport the clown to the destination
        if (victim.object) {
          victim.object.position.copy(teleportDestination);
        }
      }
      else if (e.key === "2") {
        statusGame = 2
        // Define your teleportation destination here
        const teleportDestination = new THREE.Vector3(10000, 0, 0);
        // Teleport the clown to the destination
        if (victim.object) {
          victim.object.position.copy(teleportDestination);
        }
      }
      else if (e.key == "3") {
        statusGame = 3
        camera.position.set(0, 0, 0);
      }
    });

      // Drawing scene
      // if (controls.enabled) {
      //   controls.update(); // Update controls only if enabled
      // }
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }

    const startAnimation = () => {
      if (!isFinished) setTimeout(startAnimation, 500);
      else {
        clown.object?.position.set(3000, 0, 3000);
        victim.object?.position.set(0, 0, 0);
        requestAnimationFrame(animate);
      }
    };
    startAnimation();
  }

  return () => {
    isTerminated = true;
    input.unhookEvents();
  };
}
