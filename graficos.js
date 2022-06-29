var arquivo;

function readTextFile(file)
{
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                arquivo = rawFile.responseText;
                //alert(arquivo);
            }
        }
    }
    rawFile.send(null);
}


readTextFile("correlacao.txt");

var m = 0, n = 0
var pontos = 1280
/* var matriz = new Array(pontos);

for (var k = 0; k < matriz.length; k++)
    matriz[k] = new Array(3);

for (var k=0; k<=pontos-1; k++)
	for (var p=0; p<3; p++)
        matriz[k][p] = '';  */

var posicao = [], sinal = [], autocorrelacao = []

for (var k=0; k<=pontos-1; k++)
{
    posicao[k] = ""
    sinal[k] = ""
    autocorrelacao[k] = ""
}

for (var k=0; k<=arquivo.length-1; k++)
{
    if (arquivo.charAt(k) === " ")
        n++

    if (n === 0)
        posicao[m] = posicao[m] + arquivo.charAt(k)

    if (n === 1)
        sinal[m] = sinal[m] + arquivo.charAt(k)

    if (n === 2)
        autocorrelacao[m] = autocorrelacao[m] + arquivo.charAt(k)

    if (arquivo.charAt(k) === "\n")
    {
        n = 0
        m++
    }
}

for (var k=0; k<=pontos-1; k++)
{
    posicao[k] = Number(posicao[k])
    sinal[k] = Number(sinal[k])
    autocorrelacao[k] = Number(autocorrelacao[k])
}

console.log(arquivo)
console.log(posicao)



var trace1 = {
    x: posicao,
    y: sinal,
    name: "Função",
    type: "line"
};

var trace2 = {
    x: posicao,
    y: autocorrelacao,
    name: "Autocorrelação",
    type: "line",
    yaxis: 'y2',
};


var data = [trace1, trace2];
var layout = {
    yaxis1: {title: 'Sinal'},
    yaxis2: {
        title: 'Autocorrelação',
        titlefont: {color: 'rgb(148, 103, 189)'},
        tickfont: {color: 'rgb(148, 103, 189)'},
        overlaying: 'y',
        side: 'right'
    }
};

//var grafico = document.getElementById('grafico');

Plotly.newPlot('grafico', data, layout, function (err, msg) {
	//if (err) return console.log(err);
	//console.log(msg);
});