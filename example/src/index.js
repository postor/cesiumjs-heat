require('cesium/Build/Cesium/Widgets/widgets.css')

const Cesium = require('cesium')
const viewer = new Cesium.Viewer('container')
const bbox = [120.106188593, 21.9705713974, 121.951243931, 25.2954588893]
viewer.camera.flyTo({
  destination: Cesium.Rectangle.fromDegrees(...bbox),
  duration: 0.1
})

data = require('./data.json').feeds.map(({ gps_lon, gps_lat, s_d0 }) => {
  return {
    x: gps_lon,
    y: gps_lat,
    value: s_d0,
  }
})

const getHeat = require('cesiumjs-heat').default
const CesiumHeat = getHeat(Cesium)
const heat = new CesiumHeat(
  viewer,
  data,
  bbox
)