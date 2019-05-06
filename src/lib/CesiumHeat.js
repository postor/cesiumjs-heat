import * as h337 from 'heatmap.js'
import * as Cesium from 'cesium'

class CesiumHeat {
  constructor(viewer, data = [], bbox = [-180, -90, 180, 90]
    , heatmapConfig = {
    }
    , canvasConfig = { width: 720, height: 360 }) {
    if (typeof window == 'undefined') return

    this.viewer = viewer
    this.bbox = bbox
    this.canvasConfig = canvasConfig
    this.max = 0

    let config = { ...heatmapConfig }
    if (!config.container) {
      this.mountPoint = newDiv({
        width: 0,
        height: 0,
        position: `absolute`,
        top: 0,
        left: 0,
        'z-index': -100,
        overflow: 'hidden',
      }, document.body)
      config.container = newDiv(canvasConfig, this.mountPoint)
    }
    this.heatmapConfig = config

    this.heatmap = h337.create(config)

    const [left, bottom, right, top] = bbox
    let height = top - bottom, width = right - left
    this.boxMeta = {
      top, left, height, width
    }
    let newData = data.map(x => this.convertData(x))
    let heatdata = {
      max: this.max,
      data: newData,
    }
    this.heatmap.setData(heatdata)

    this.layer = new Cesium.SingleTileImageryProvider({
      url: this.heatmap.getDataURL(),
      rectangle: Cesium.Rectangle.fromDegrees(...bbox)
    })
    this.viewer.scene.imageryLayers.addImageryProvider(this.layer)
  }

  getLayer() {
    return this.layer
  }

  convertData({ x, y, value }) {
    let [px, py] = this.gps2point([x, y])
    this.max = Math.max(value, this.max)
    return {
      x: px,
      y: py,
      value: value,
    }
  }

  gps2point(gps = []) {
    let [x1, y1] = gps
    let { top, left, height, width } = this.boxMeta
    let canvasConfig = this.canvasConfig

    let x = parseInt((x1 - left) / width * canvasConfig.width)
    let y = parseInt((top - y1) / height * canvasConfig.height)
    return [x, y]
  }
}

function newDiv(style, parent) {
  let div = document.createElement('div')
  parent && parent.append(div)
  for (let k in style) {
    if (typeof style[k] === 'number') {
      div.style[k] = style[k] + 'px'
      continue
    }
    div.style[k] = style[k]
  }
  return div
}

export default CesiumHeat