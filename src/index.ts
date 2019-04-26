require('cesium/Build/Cesium/Widgets/widgets.css');
require('./css/main.css');
require('./heatmap.js')
import * as Cesium from 'cesium';
import * as h337 from 'heatmap.js'



const viewer = new Cesium.Viewer('container');
const scene = viewer.scene;
const camera = scene.camera;

let bounds = {
  west: 147.13833844,
  east: 147.13856899,
  south: -41.43606916,
  north: -41.43582929
};

// @ts-ignore
//viewer.container = document.getElementById('container')
console.log(viewer.container)
// init heatmap
