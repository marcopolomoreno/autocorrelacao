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
            }
        }
    }
    rawFile.send(null);
}


readTextFile("correlacao.txt");


var tipoCorrelacao

var dados = ""
var eixoX = [], funcao = [], ACF = [];
var fMed = 0, N = 1000, norm = 0;

//Sinal padrão
var padrao = true
var tipoSinal
//gaussiana  gaussianaRuidoSenoidal  gaussianaRuidoAleatorio
//aleatorio  aleatorioRuidoSenoidal
var funcaoGaussiana = [], funcaoGaussianaRuidoSenoidal = []
var funcaoGaussianaRuidoAleatorio = [], funcaoAleatoria = []
var funcaoRuidoSenoidal = [], funcaoGaussianaCavada = []
var funcaoHermiteGauss = [], funcaoRuidoBrowniano = []
var distribuicaoNormal = []


//Slider
var sliderVariavel1 = document.getElementById("rangeVariavel1");
var outputVariavel1 = document.getElementById("variavel1");
outputVariavel1.innerHTML = sliderVariavel1.value;

sliderVariavel1.oninput = function() {
    outputVariavel1.innerHTML = this.value;
}

var sliderVariavel2 = document.getElementById("rangeVariavel2");
var outputVariavel2 = document.getElementById("variavel2");
outputVariavel2.innerHTML = sliderVariavel2.value;

sliderVariavel2.oninput = function() {
    outputVariavel2.innerHTML = this.value;
}


function jogarDados(p)
{
	var s, k;
    s = 0;
    for (k=1; k<=p; k++)
    	s = s + Math.floor( 100*Math.random() );
    return ( s/(99*p)-0.5 );
}

var Ndados = 40;



const src = "imagem2.jpg";
var dadosImg = "", pixel = []



function parametros()
{
    sliderVariavel1.value = document.getElementById("variavel1").innerHTML
    sliderVariavel2.value = document.getElementById("variavel2").innerHTML

    variavel1 = Number(sliderVariavel1.value);
    variavel2 = Number(sliderVariavel2.value);
}

//Função síncrona
/* function sinalEntrada(){
    setTimeout(function(){
        
    },3000); */

function sinalEntrada(){
    if (tipoCorrelacao === "radial")
        N = raio

    funcaoRuidoBrowniano[0] = 0

    for (t=0; t<=N-1; t++)
    {
        eixoX[t] = t

        if (padrao === true)
        {
            //funcaoGaussiana[t] = Math.exp(-0.5*Math.pow( (eixoX[t]-N/2)/100, 2 ))

            funcaoGaussianaRuidoSenoidal[t] = Math.exp(-0.5*Math.pow( (eixoX[t]-N/2)/100, 2 )) + 
                        0.005*variavel2*Math.cos(0.01*variavel1*t)

            funcaoGaussianaRuidoAleatorio[t] = Math.exp(-0.5*Math.pow( (eixoX[t]-N/2)/100, 2 )) + 0.02*variavel2*( Math.random()-0.5 )
            
            funcaoGaussianaCavada[t] = Math.exp(-0.5*Math.pow( (eixoX[t]-N/2)/100, 2 ))
            if (t > N/2 + variavel1 - variavel2 && t < N/2 + variavel1 + variavel2)
                funcaoGaussianaCavada[t] = 0

            if (t > 0)
                funcaoRuidoBrowniano[t] = funcaoRuidoBrowniano[t-1] + 0.001*variavel2*jogarDados(Ndados)

            distribuicaoNormal[t] = 0.01*jogarDados(Ndados)

            funcaoHermiteGauss[t] = (t - N/2)*Math.exp(-0.5*Math.pow( (eixoX[t]-N/2)/100, 2 ))

            funcaoAleatoria[t] = Math.random()-0.5

            funcaoRuidoSenoidal[t] = Math.random()-0.5 + 0.02*variavel2*Math.cos(0.01*variavel1*t)
        }

        if (padrao === false)
        {
            funcao[t] = pixel[t]
            fMed = fMed + funcao[t]
        }
    }
}




var m = 0, n = 0

var posicao = [], sinal = [], delay = [], autocorrelacao = []

for (var k=0; k<=N-1; k++)
{
    posicao[k] = ""
    sinal[k] = ""
    autocorrelacao[k] = ""
}



//console.log(arquivo)
//console.log(posicao)


var tamanhoFonte = 16


var cont = 0
function montarSinal()
{
    if (padrao === true)
    {
        fMed = 0
        
        for (var k=0; k<=N-1; k++)
        {
            posicao[k] = k
        
            if ( document.getElementById("gaussianaRuidoAleatorio").checked )
            {
                sinal[k] = funcaoGaussianaRuidoAleatorio[k]
                document.getElementById("rangeVariavel1").hidden = true
                document.getElementById("p1").hidden = true

                document.getElementById("rangeVariavel2").hidden = false
                document.getElementById("p2").hidden = false
                document.getElementById("label2").innerHTML = "Amplitude do ruído"

                cont = 0
            }
                     
            if ( document.getElementById("gaussianaRuidoSenoidal").checked )
            {
                sinal[k] = funcaoGaussianaRuidoSenoidal[k]
                document.getElementById("rangeVariavel1").hidden = false
                document.getElementById("p1").hidden = false
                document.getElementById("label1").innerHTML = "Frequência"

                document.getElementById("rangeVariavel2").hidden = false
                document.getElementById("p2").hidden = false
                document.getElementById("label2").innerHTML = "Amplitude"

                cont = 0
            }
                
            if ( document.getElementById("gaussianaRuidoBrowniano").checked && cont === 0)
            {
                sinal[k] = Math.exp(-0.5*Math.pow( (eixoX[k]-N/2)/100, 2 )) + 5*funcaoRuidoBrowniano[k]
                
                if (k === N-1)
                    cont = 1

                document.getElementById("rangeVariavel1").hidden = true
                document.getElementById("p1").hidden = true

                document.getElementById("rangeVariavel2").hidden = false
                document.getElementById("p2").hidden = false
                document.getElementById("label2").innerHTML = "Amplitude do ruído"
            }
            
            if ( document.getElementById("distribuicaoNormal").checked )
            {
                sinal[k] = distribuicaoNormal[k]
                document.getElementById("rangeVariavel1").hidden = true
                document.getElementById("p1").hidden = true

                document.getElementById("rangeVariavel2").hidden = true
                document.getElementById("p2").hidden = true

                cont = 0
            }

            if ( document.getElementById("gaussianaCavada").checked )
            {
                sinal[k] = funcaoGaussianaCavada[k]
                document.getElementById("rangeVariavel1").hidden = false
                document.getElementById("p1").hidden = false
                document.getElementById("label1").innerHTML = "Posição"

                document.getElementById("rangeVariavel2").hidden = false
                document.getElementById("p2").hidden = false
                document.getElementById("label2").innerHTML = "Largura do buraco"

                cont = 0
            }
                
            if ( document.getElementById("hermiteGauss").checked )
            {
                sinal[k] = funcaoHermiteGauss[k]
                document.getElementById("rangeVariavel1").hidden = true
                document.getElementById("p1").hidden = true

                document.getElementById("rangeVariavel2").hidden = true
                document.getElementById("p2").hidden = true

                cont = 0
            }

            if ( document.getElementById("aleatorio").checked )
            {
                sinal[k] = funcaoAleatoria[k]
                document.getElementById("rangeVariavel1").hidden = true
                document.getElementById("p1").hidden = true

                document.getElementById("rangeVariavel2").hidden = true
                document.getElementById("p2").hidden = true

                cont = 0
            }
                

            if ( document.getElementById("aleatorioRuidoSenoidal").checked )
            {
                sinal[k] = funcaoRuidoSenoidal[k]
                document.getElementById("rangeVariavel1").hidden = false
                document.getElementById("p1").hidden = false
                document.getElementById("label1").innerHTML = "Frequência"

                document.getElementById("rangeVariavel2").hidden = false
                document.getElementById("p2").hidden = false
                document.getElementById("label2").innerHTML = "Amplitude"

                cont = 0
            }
                

            if ( document.getElementById("ruidoBrowniano").checked && cont === 0 )
            {
                sinal[k] = funcaoRuidoBrowniano[k]

                if (k === N-1)
                    cont = 1

                document.getElementById("rangeVariavel1").hidden = true
                document.getElementById("p1").hidden = true

                document.getElementById("rangeVariavel2").hidden = true
                document.getElementById("p2").hidden = true
            }

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




var norm



function calcularCorrelacao()
{
    norm = 0;

    for(tau=0; tau<=N-1; tau++)
        autocorrelacao[tau] = 0

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

    for (tau=0; tau<=2*N-1; tau++)
        delay[tau] = tau - N
        
    for (tau=N; tau<=2*N-1; tau++)
    {
        autocorrelacao[tau] = autocorrelacao[tau-N]
    }

    for (tau=0; tau<=N-1; tau++)
    {
        autocorrelacao[tau] = autocorrelacao[2*N-tau]
    }
}




function plotarSinal()
{
    sinalEntrada()

    parametros()

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
        x: delay,
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
//plotarSinal()
setInterval(function() {plotarSinal()}, 500);