import * as h337 from 'heatmap.js'

export default (Cesium) => class CesiumHeat {
  constructor(viewer, data = [], bbox = [-180, -90, 180, 90]
    , heatmapConfig = {}, autoRadiusConfig = {
      enabled: true,
      min: 6375000,
      max: 10000000,
      maxRadius: 20 * 2,
      minRadius: 5 * 2,
    }, canvasConfig = { 
      totalArea: 360 * 2 * 720 * 2, 
      autoResize: true, 
    }) {

    if (typeof window == 'undefined') return

    this.viewer = viewer
    this.bbox = bbox
    this.autoRadiusConfig = autoRadiusConfig
    this.max = 0

    // bbox计算基础信息
    const [left, bottom, right, top] = bbox
    let height = top - bottom, width = right - left
    this.boxMeta = {
      top, left, height, width
    }

    // 计算画布大小
    if (canvasConfig.autoResize) {
      if (!canvasConfig.totalArea) {
        throw 'specify totalArea if auto resize'
      }
      // w*h = totalArea
      // w:h = width/height
      const h = Math.floor(Math.sqrt(height * canvasConfig.totalArea))
      const w = Math.floor(h * width / height)
      this.canvasConfig = {
        ...canvasConfig,
        width: w,
        height: h,
      }
    } else {
      if (!canvasConfig.width || !canvasConfig.height) {
        throw 'specify width and height if not auto resize'
      }
      this.canvasConfig = canvasConfig
    }



    let config = { ...heatmapConfig }
    if (!config.container) {
      this.mountPoint = newDiv({
        position: `absolute`,
        top: 0,
        left: 0,
        'z-index': -100,
        overflow: 'hidden',
        width: 0,
        height: 0,
      }, document.body)

      config.container = newDiv({
        width: this.canvasConfig.width,
        height: this.canvasConfig.height
      }, this.mountPoint)
    }
    this.heatmapConfig = config

    this.heatmap = h337.create(config)

    let newData = data.map(x => this.convertData(x))
    this.data = newData
    let heatdata = {
      max: this.max,
      data: newData,
    }
    this.heatmap.setData(heatdata)
    window.heatmap = this.heatmap
    this.updateCesium(autoRadiusConfig.enabled)
    this.cameraMoveEnd = () => this.updateCesium(true)
    autoRadiusConfig.enabled && this.viewer.camera.moveEnd.addEventListener(this.cameraMoveEnd)
  }

  /**
   * 按当前的相机高度调整点的辐射（越高，越大）
   */
  updateHeatmap() {
    let h = this.viewer.camera.getMagnitude()
    const { min, max, minRadius, maxRadius } = this.autoRadiusConfig
    let newRadius = parseInt(minRadius + (maxRadius - minRadius) * (h - min) / (max - min))
    
    this.heatmap.setData({
      max: this.max,
      data: this.data.map(({ x, y, value }) => {
        return {
          x, y, value, radius: newRadius,
        }
      })
    })
  }

  updateCesium(updateHeat) {
    if (this.layer) {
      this.viewer.scene.imageryLayers.remove(this.layer)
    }
    updateHeat && this.updateHeatmap()
    
    let provider = new Cesium.SingleTileImageryProvider({
      url: this.heatmap.getDataURL(),
      rectangle: Cesium.Rectangle.fromDegrees(...this.bbox)
    })
    this.layer = this.viewer.scene.imageryLayers.addImageryProvider(provider)
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

  destory(){
    this.viewer.camera.moveEnd.removeEventListener(this.cameraMoveEnd)
    if (this.layer) {
      this.viewer.scene.imageryLayers.remove(this.layer)
    }
    if(this.mountPoint){
      this.mountPoint.remove()
    }
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