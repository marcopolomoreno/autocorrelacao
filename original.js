const img = new Image();
img.crossOrigin = 'anonymous';
img.src = 'imagem.jpg';
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
img.onload = function() {
  ctx.drawImage(img, 0, 0);
  img.style.display = 'none';
};
const hoveredColor = document.getElementById('hovered-color');
const selectedColor = document.getElementById('selected-color');

function pick(event, destination) {
  const x = event.layerX;
  const y = event.layerY;
  const pixel = ctx.getImageData(x, y, 1, 1);
  const data = pixel.data;

    const rgba = `rgba(${data[0]}, ${data[1]}, ${data[2]}, ${data[3] / 255})`;
    destination.style.background = rgba;
    destination.textContent = rgba;

    return rgba;
}

canvas.addEventListener('mousemove', function(event) {
    pick(event, hoveredColor);
});
canvas.addEventListener('click', function(event) {
    pick(event, selectedColor);
});
