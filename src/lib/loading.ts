import * as THREE from 'three';

const manager = new THREE.LoadingManager();
let isFinished = false;

manager.onStart = (url, itemsLoaded, itemsTotal) => {
    console.log('0%');
}

manager.onLoad = () => {
    console.log('Completed!');
    isFinished = true;
}

manager.onProgress = (url, itemsLoaded, itemsTotal) => {
    console.log((itemsLoaded / itemsTotal * 100) + ' %');
}

export default manager;
export {isFinished};