require('cesium/Build/Cesium/Widgets/widgets.css');
require('./css/main.css');
import * as Cesium from 'cesium';
import data from './data/last-all-airbox'
import getCesiumHeat from './lib/CesiumHeat';

const CesiumHeat = getCesiumHeat(Cesium)
const viewer = new Cesium.Viewer('container');

let ge = getSlices(data.feeds.map(({ gps_lon, gps_lat, s_d0 }) => {
  return {
    x: gps_lon,
    y: gps_lat,
    value: s_d0,
  }
}))

let bbox = [120.106188593, 21.9705713974, 121.951243931, 25.2954588893]
let heat = new CesiumHeat(
  viewer,
  ge.next().value,
  bbox
)

viewer.camera.flyTo({
  destination : Cesium.Rectangle.fromDegrees(...bbox),
  duration: 0.1
});

let intval = setInterval(() => {
  let { done, value } = ge.next()
  if (done) {
    clearInterval(intval)
    return
  }
  heat.addData(value)
},1000)

setTimeout(() => {
  clearInterval(intval)
  heat.destory()
}, 10 * 60 * 1000)

function* getSlices(arr = [], limit = 100) {
  let start = 0
  while (arr.length - start > limit) {
    yield arr.slice(start, start + limit)
    start += limit
  }
  yield arr.slice(start)
}