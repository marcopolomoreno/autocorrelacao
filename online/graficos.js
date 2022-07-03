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


var tipoCorrelacao

var dados = ""
var eixoX = [], funcao = [], ACF = [];
var fMed = 0, N = 1280, norm = 0;

//Sinal padrão
var padrao = true
var tipoSinal
//gaussiana  gaussianaRuidoSenoidal  gaussianaRuidoAleatorio
//aleatorio  aleatorioRuidoSenoidal
var funcaoGaussiana = [], funcaoGaussianaRuidoSenoidal = []
var funcaoGaussianaRuidoAleatorio = [], funcaoAleatoria = []
var funcaoRuidoSenoidal = []


const src = "imagem2.jpg";
var dadosImg = "", pixel = []

//Função síncrona
function sinalEntrada(){
    setTimeout(function(){
        
    },3000);


    if (tipoCorrelacao === "radial")
        N = raio

    for (t=0; t<=N-1; t++)
    {
        eixoX[t] = t

        if (padrao === true)
        {
            funcaoGaussiana[t] = Math.exp(-0.5*Math.pow( (eixoX[t]-N/2)/100, 2 ))

            funcaoGaussianaRuidoSenoidal[t] = Math.exp(-0.5*Math.pow( (eixoX[t]-N/2)/100, 2 )) + 0.1*Math.cos(0.5*t)

            funcaoGaussianaRuidoAleatorio[t] = Math.exp(-0.5*Math.pow( (eixoX[t]-N/2)/100, 2 )) + 0.1*( Math.random()-0.5 )

            funcaoAleatoria[t] = Math.random()-0.5

            funcaoRuidoSenoidal[t] = Math.random()-0.5 + 0.02*Math.cos(0.02*t)
        }

        if (padrao === false)
        {
            funcao[t] = pixel[t]
            fMed = fMed + funcao[t]
        }
    }
}

sinalEntrada()






var m = 0, n = 0
var pontos = 1280

var posicao = [], sinal = [], autocorrelacao = []

for (var k=0; k<=pontos-1; k++)
{
    posicao[k] = ""
    sinal[k] = ""
    autocorrelacao[k] = ""
}




/* for (var k=0; k<=pontos-1; k++)
{
    posicao[k] = Number(posicao[k])
    sinal[k] = Number(sinal[k])
    autocorrelacao[k] = Number(autocorrelacao[k])
} */

//console.log(arquivo)
//console.log(posicao)


var tamanhoFonte = 16



function montarSinal()
{
    if (padrao === true)
    {
        fMed = 0
        
        for (var k=0; k<=pontos-1; k++)
        {
            posicao[k] = k

            if ( document.getElementById("gaussiana").checked )
                sinal[k] = funcaoGaussiana[k]
        
            if ( document.getElementById("gaussianaRuidoAleatorio").checked )
                sinal[k] = funcaoGaussianaRuidoAleatorio[k]
            
            if ( document.getElementById("gaussianaRuidoSenoidal").checked )
                sinal[k] = funcaoGaussianaRuidoSenoidal[k]

            if ( document.getElementById("aleatorio").checked )
                sinal[k] = funcaoAleatoria[k]

            if ( document.getElementById("aleatorioRuidoSenoidal").checked )
                sinal[k] = funcaoRuidoSenoidal[k]

            fMed = fMed + sinal[k]
        }
    }
    else
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
    if ( document.getElementById("semSubtrairMedia").checked )
        fMed = 0

    if ( document.getElementById("subtraindoMedia").checked )
        fMed = fMed/N
}


//Correlação
for(tau=0; tau<=N-1; tau++)
    autocorrelacao[tau] = 0


var norm



function calcularCorrelacao()
{
    norm = 0;

    for (t=0; t<=N-1; t++)
    {
        norm = norm + (sinal[t] - fMed) * (sinal[t] - fMed)
    }

    for (tau=0; tau<=N-1; tau++)
    {
        for (t=tau; t<=N-1; t++)
        {
            autocorrelacao[tau] = autocorrelacao[tau] + (sinal[t] - fMed) * (sinal[t-tau] - fMed)
        }

        autocorrelacao[tau] = autocorrelacao[tau]/norm
    }

    /* for (tau=0; tau<=N-1; tau++)
    {
        autocorrelacao[-tau] = autocorrelacao[tau]
    } */
}




function plotarSinal()
{
    montarSinal()

    calcularCorrelacao()

    var curvaSinal = {
        x: posicao,
        y: sinal,
        name: "Sinal",
        type: "line",
        line: {
            color: '#ff6600',
            width: 2
          }
    };

    var dataSinal = [curvaSinal];
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


    var curvaAutocorrelacao = {
        x: posicao,
        y: autocorrelacao,
        name: "Autocorrelação",
        type: "line",
        line: {
            color: '#0039e6',   //azul
            width: 2
          }
    };
    
    var dataAutocorrelacao = [curvaAutocorrelacao];
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
}

setInterval(function() {plotarSinal()}, 200);