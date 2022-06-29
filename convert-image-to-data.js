const img = new Image();
img.crossOrigin = 'anonymous';
img.src = 'imagem.jpg';
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

img.onload = function() {
    ctx.drawImage(img, 0, 0);
    img.style.display = 'none';
};






//download
var pontos = 1280
var matriz = new Array(pontos);

for (var k = 0; k < matriz.length; k++)
    matriz[k] = new Array(3);

for (var k=0; k<=pontos-1; k++)
	for (var p=0; p<3; p++)
        matriz[k][p] = '';

matriz[0][0] = "t";
matriz[0][1] = "f(t)";
matriz[0][2] = "";




function conversao()
{
    for (var k=0; k<=1280-1; k++)
    {
        (function (k) {
            const pixel = ctx.getImageData(k, 1024/2, 1, 1);
            const data = pixel.data
            console.log(data[0])
            matriz[k][0] = String(k)
            matriz[k][1] = String(data[0])
        })(k);
    }
}



canvas.addEventListener('click', function() {
    conversao()
});
