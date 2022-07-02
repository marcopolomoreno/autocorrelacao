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

//console.log(arquivo)
//console.log(posicao)



var sinal = {
    x: posicao,
    y: sinal,
    name: "Sinal",
    type: "line",
    line: {
        color: '#ff6600',
        width: 2
      }
};

var autocorrelacao = {
    x: posicao,
    y: autocorrelacao,
    name: "Autocorrelação",
    type: "line",
    line: {
        color: '#0039e6',   //azul
        width: 2
      }
};

var tamanhoFonte = 16


var dataSinal = [sinal];
var layoutSinal = {
    title: {
        text:'Sinal',
        font: {
          size: 20
        },
        xref: 'paper',
        x: 0.5,
      },
    xaxis: {
        title: 'pixels',
        titlefont: {size: tamanhoFonte},
        tickfont:  {size: tamanhoFonte},
    },
    yaxis: {
        title: 'Sinal',
        titlefont: {size: tamanhoFonte},
        tickfont:  {size: tamanhoFonte},
    },
    legend: {
        x: 0.8,
        y: 1,
        traceorder: 'normal',
        font: {
          size: tamanhoFonte,
        },
        borderwidth: 1.5
      }
};

var dataAutocorrelacao = [autocorrelacao];
var layoutAutocorrelacao = {
    title: {
        text:'Autocorrelação',
        font: {
          size: 20
        },
        xref: 'paper',
        x: 0.5,
      },
    xaxis: {
        title: 'delay',
        titlefont: {size: tamanhoFonte},
        tickfont:  {size: tamanhoFonte},
    },
    yaxis: {
        title: 'Autocorrelação',
        titlefont: {size: tamanhoFonte},
        tickfont:  {size: tamanhoFonte},
    },
};


Plotly.newPlot('graficoSinal', dataSinal, layoutSinal, function (err, msg) {});

Plotly.newPlot('graficoAutocorrelacao', dataAutocorrelacao, layoutAutocorrelacao, function (err, msg) {});