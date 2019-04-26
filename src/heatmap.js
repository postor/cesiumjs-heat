import * as h337 from 'heatmap.js'

window.onload = function () {
  // create a heatmap instance
  var heatmapContainer = document.getElementById('heatmap');
  var heatmap = h337.create({
    container: heatmapContainer,
    maxOpacity: .6,
    radius: 50,
    blur: .90,
    // backgroundColor with alpha so you can see through it
    backgroundColor: 'rgba(0, 0, 58, 0.96)'
  });
  heatmapContainer.onmousemove = heatmapContainer.ontouchmove = function (e) {
    // we need preventDefault for the touchmove
    e.preventDefault();
    var x = e.layerX;
    var y = e.layerY;
    if (e.touches) {
      x = e.touches[0].pageX;
      y = e.touches[0].pageY;
    }

    heatmap.addData({ x: x, y: y, value: 1 });
  };
  heatmapContainer.onclick = function (e) {
    var x = e.layerX;
    var y = e.layerY;
    heatmap.addData({ x: x, y: y, value: 1 });
  };
};