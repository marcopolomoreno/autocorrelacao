/* var arquivo;

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

readTextFile("correlacao.txt"); */



const img = new Image();
img.crossOrigin = 'anonymous';
img.src = 'imagem2.jpg';
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

var escala = 1  //0.25

var Lx = 1280*escala, Ly = 1024*escala

var rt = document.querySelector(':root')
rt.style.setProperty('--Lx', Lx + 'px')
rt.style.setProperty('--Ly', Ly + 'px')

canvas.width = Lx
canvas.height = Ly

img.onload = function() {
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    img.style.display = 'none';
};

ctx.scale(1, 1);

var m = 0, n = 0

var posicao = [], sinal = [], delay = [], autocorrelacao = []
var sinal1 = [], sinal2 = [], correlacao = []


//download
var pontos = 1000
var matriz = new Array(pontos);

for (var k = 0; k < matriz.length; k++)
    matriz[k] = new Array(3);

for (var k=0; k<=pontos-1; k++)
	for (var p=0; p<3; p++)
        matriz[k][p] = '';


var xx, yy = 100

function conversao(event)
{
    for (var k=0; k<=pontos-1; k++)
    {
        (function (k) {
            const pixel = ctx.getImageData(k, yy, 1, 1);
            const data = pixel.data
            //console.log(data[0])
            //matriz[k][0] = String(k)
            matriz[k][1] = String(data[0])
        })(k);
    }
}

conversao()


canvas.addEventListener('click', function(event) {

    xx = event.offsetX;
    yy = event.offsetY;

    console.log(xx + ", " + yy)

    conversao()
    sinalEntrada()
    rePlots()
    update()
});




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

//Correlação
var funcaoGaussiana1 = [], funcaoHermiteGauss1 = []
var funcaoGaussiana2 = [], funcaoHermiteGauss2 = []
var funcaoGaussianaCavada1 = [], funcaoGaussianaCavada2 = []

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

//Correlação
var sliderVariavel1a = document.getElementById("rangeVariavel1a");
var outputVariavel1a = document.getElementById("variavel1a");
outputVariavel1a.innerHTML = sliderVariavel1a.value;

sliderVariavel1a.oninput = function() {
    outputVariavel1a.innerHTML = this.value;
}

var sliderVariavel2a = document.getElementById("rangeVariavel2a");
var outputVariavel2a = document.getElementById("variavel2a");
outputVariavel2a.innerHTML = sliderVariavel2a.value;

sliderVariavel2a.oninput = function() {
    outputVariavel2a.innerHTML = this.value;
}

var sliderVariavel1b = document.getElementById("rangeVariavel1b");
var outputVariavel1b = document.getElementById("variavel1b");
outputVariavel1b.innerHTML = sliderVariavel1b.value;

sliderVariavel1b.oninput = function() {
    outputVariavel1b.innerHTML = this.value;
}

var sliderVariavel2b = document.getElementById("rangeVariavel2b");
var outputVariavel2b = document.getElementById("variavel2b");
outputVariavel2b.innerHTML = sliderVariavel2b.value;

sliderVariavel2b.oninput = function() {
    outputVariavel2b.innerHTML = this.value;
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

    sliderVariavel1a.value = document.getElementById("variavel1a").innerHTML
    sliderVariavel2a.value = document.getElementById("variavel2a").innerHTML

    variavel1a = Number(sliderVariavel1a.value);
    variavel2a = Number(sliderVariavel2a.value);

    sliderVariavel1b.value = document.getElementById("variavel1b").innerHTML
    sliderVariavel2b.value = document.getElementById("variavel2b").innerHTML

    variavel1b = Number(sliderVariavel1b.value);
    variavel2b = Number(sliderVariavel2b.value);
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

            //correlacao
            funcaoGaussiana1[t] = Math.exp(-0.5*Math.pow( (eixoX[t]-N/2)/(2*variavel1a), 2 )) + 
                                    0.02*variavel1b*( Math.random()-0.5 )

            funcaoGaussiana2[t] = Math.exp(-0.5*Math.pow( (eixoX[t]-N/2)/(2*variavel2a), 2 )) + 
                                    0.02*variavel2b*( Math.random()-0.5 )

            funcaoHermiteGauss1[t] = (t - N/2)/(0.02*N) * Math.exp(-0.5*Math.pow( (eixoX[t]-N/2)/variavel1a, 2 )) + 
                                    0.02*variavel1b*( Math.random()-0.5 )

            funcaoHermiteGauss2[t] = (t - N/2)/(0.02*N) * Math.exp(-0.5*Math.pow( (eixoX[t]-N/2)/variavel2a, 2 )) + 
                                    0.02*variavel2b*( Math.random()-0.5 )

            funcaoGaussianaCavada1[t] = Math.exp(-0.5*Math.pow( (eixoX[t]-N/2)/100, 2 ))
            if (t > N/2 + variavel1a - variavel1b && t < N/2 + variavel1a + variavel1b)
                funcaoGaussianaCavada1[t] = 0

            funcaoGaussianaCavada2[t] = Math.exp(-0.5*Math.pow( (eixoX[t]-N/2)/100, 2 ))
            if (t > N/2 + variavel2a - variavel2b && t < N/2 + variavel2a + variavel2b)
                funcaoGaussianaCavada2[t] = 0
                
        }

        if (padrao === false)
        {
            funcao[t] = pixel[t]
            fMed = fMed + funcao[t]
        }
    }
}




for (var k=0; k<=N-1; k++)
{
    posicao[k] = ""
    sinal[k] = ""
    autocorrelacao[k] = ""

    sinal1[k] = ""
    sinal2[k] = ""
    correlacao[k] = ""
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

            //Correlacao ************************************************

            if ( document.getElementById("gaussiana1").checked )
            {
                sinal1[k] = funcaoGaussiana1[k]
                document.getElementById("rangeVariavel1a").hidden = false
                document.getElementById("p1a").hidden = false
                document.getElementById("label1a").innerHTML = "Largura"

                document.getElementById("rangeVariavel1b").hidden = false
                document.getElementById("p1b").hidden = false
                document.getElementById("label1b").innerHTML = "Amplitude do ruído"

                //cont = 0
            }

            if ( document.getElementById("gaussiana2").checked )
            {
                sinal2[k] = funcaoGaussiana2[k]
                document.getElementById("rangeVariavel2a").hidden = false
                document.getElementById("p2a").hidden = false
                document.getElementById("label2a").innerHTML = "Largura"

                document.getElementById("rangeVariavel2b").hidden = false
                document.getElementById("p2b").hidden = false
                document.getElementById("label2b").innerHTML = "Amplitude do ruído"

                //cont = 0
            }

            if ( document.getElementById("hermiteGauss1").checked )
            {
                sinal1[k] = funcaoHermiteGauss1[k]
                document.getElementById("rangeVariavel1a").hidden = false
                document.getElementById("p1a").hidden = false
                document.getElementById("label1a").innerHTML = "Largura"

                document.getElementById("rangeVariavel1b").hidden = false
                document.getElementById("p1b").hidden = false
                document.getElementById("label1b").innerHTML = "Amplitude do ruído"

                //cont = 0
            }

            if ( document.getElementById("hermiteGauss2").checked )
            {
                sinal2[k] = funcaoHermiteGauss2[k]
                document.getElementById("rangeVariavel2a").hidden = false
                document.getElementById("p2a").hidden = false
                document.getElementById("label2a").innerHTML = "Largura"

                document.getElementById("rangeVariavel2b").hidden = false
                document.getElementById("p2b").hidden = false
                document.getElementById("label2b").innerHTML = "Amplitude do ruído"

                //cont = 0
            }

            if ( document.getElementById("gaussianaCavada1").checked )
            {
                sinal1[k] = funcaoGaussianaCavada1[k]
                document.getElementById("rangeVariavel1a").hidden = false
                document.getElementById("p1a").hidden = false
                document.getElementById("label1a").innerHTML = "Posição do buraco"

                document.getElementById("rangeVariavel1b").hidden = false
                document.getElementById("p1b").hidden = false
                document.getElementById("label1b").innerHTML = "Largura do buraco"

                //cont = 0
            }

            if ( document.getElementById("gaussianaCavada2").checked )
            {
                sinal2[k] = funcaoGaussianaCavada2[k]
                document.getElementById("rangeVariavel2a").hidden = false
                document.getElementById("p2a").hidden = false
                document.getElementById("label2a").innerHTML = "Posição do buraco"

                document.getElementById("rangeVariavel2b").hidden = false
                document.getElementById("p2b").hidden = false
                document.getElementById("label2b").innerHTML = "Largura do buraco"

                //cont = 0
            }

            if (document.getElementById("tabUpload").ariaSelected === "true")
                sinal[k] = matriz[k][1]
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




var norm, norm1, norm2



function calcularAutocorrelacao()
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


function calcularCorrelacao()
{
    norm1 = 0, norm2 = 0

    for(tau=0; tau<=2*N-1; tau++)
        correlacao[tau] = 0

    for (t=0; t<=N-1; t++)
    {
        norm1 = norm1 + (sinal1[t] - fMed) * (sinal1[t] - fMed)
        norm2 = norm2 + (sinal2[t] - fMed) * (sinal2[t] - fMed)
    }

    for (tau=-N+1; tau<=N-1; tau++)
    {
        var indice = tau + N

        if (tau < 0)
            for (t=0; t<=N-1+tau; t++)
            {
                correlacao[indice] = correlacao[indice] + (sinal1[t] - fMed) * (sinal2[t-tau] - fMed)
            }
        
        if (tau >= 0)
            for (t=tau; t<=N-1; t++)
            {
                correlacao[indice] = correlacao[indice] + (sinal1[t] - fMed) * (sinal2[t-tau] - fMed)
            }

        correlacao[indice] = correlacao[indice]/Math.sqrt(norm1*norm2)
    }

    for (tau=0; tau<=2*N-1; tau++)
        delay[tau] = tau - N

    for (tau=0; tau<=2*N-1; tau++)
        delay[tau] = tau - N
}



var dataSinal
var layoutSinal
var dataAutocorrelacao
var layoutAutocorrelacao

var dataSinal12
var layoutSinal12
var dataCorrelacao
var layoutCorrelacao


function configGraficoAutocorrelacao()
{
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

    dataSinal = [curvaSinal];
    layoutSinal = {
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
        //range: [0, 1000*escala]
    },
    yaxis: {
        title: 'Sinal',
        titlefont: {size: tamanhoFonte},
        tickfont:  {size: tamanhoFonte},
        //range: [range0, range1],
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
    
    dataAutocorrelacao = [curvaAutocorrelacao];
    layoutAutocorrelacao = {
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
}


function configGraficoCorrelacao()
{
    var curvaSinal1 = {
        x: posicao,
        y: sinal1,
        name: "Sinal 1",
        type: "line",
        line: {
            color: '#ff6600',
            width: 2
          }
    };

    var curvaSinal2 = {
        x: posicao,
        y: sinal2,
        name: "Sinal 2",
        type: "line",
        line: {
            color: '#00cc66',
            width: 2
          }
    };

    dataSinal12 = [curvaSinal1, curvaSinal2];
    layoutSinal12 = {
    title: {
        text:'Sinais',
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
        title: 'Sinais',
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

    var curvaCorrelacao = {
        x: delay,
        y: correlacao,
        name: "Correlação",
        type: "line",
        line: {
            color: '#0039e6',   //azul
            width: 2
          }
    };
    
    dataCorrelacao = [curvaCorrelacao];
    layoutCorrelacao = {
        title: {
            text:'Correlação',
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
            title: 'Correlação',
            titlefont: {size: tamanhoFonte},
            tickfont:  {size: tamanhoFonte},
        },
    };
}



function calculosConfigFuncao()
{
    sinalEntrada()

    parametros()

    montarSinal()

    if (document.getElementById("autocorrelacao-tab").ariaSelected === "true")
    {
        calcularAutocorrelacao()
        configGraficoAutocorrelacao()
    }

    //if (document.getElementById("correlacao-tab").ariaSelected === "true")
    {
        calcularCorrelacao()
        configGraficoCorrelacao()
    }
}


calculosConfigFuncao()

var chave = true, chave12 = true

document.getElementById('botoes').onclick = function() {
    cont = 0
    chave = true
};

document.getElementById('sliders').onclick = function() {
    chave = true
    cont = 0
};

document.getElementById('botoes12').onclick = function() {
    cont = 0
    chave12 = true
};

document.getElementById('sliders12').onclick = function() {
    chave12 = true
    cont = 0
};

function rePlots()
{
    Plotly.newPlot('graficoSinal', dataSinal, layoutSinal, function (err, msg) {});

    Plotly.newPlot('graficoAutocorrelacao', dataAutocorrelacao, layoutAutocorrelacao, function (err, msg) {});
}

function rePlots12()
{
    Plotly.newPlot('graficoSinal12', dataSinal12, layoutSinal12, function (err, msg) {});

    Plotly.newPlot('graficoCorrelacao', dataCorrelacao, layoutCorrelacao, function (err, msg) {});
}

rePlots()
rePlots12()



function update()
{
    calculosConfigFuncao()

    if (chave === true)
    {
        rePlots()
        chave = false
    }

    if (chave12 === true)
    {
        rePlots12()
        chave12 = false
    }

    if (document.getElementById("autocorrelacao-tab").ariaSelected === "true")
    {
        Plotly.animate('graficoSinal', dataSinal, layoutSinal, {
            transition: {
            duration: 200,
            },
            frame: {
            duration: 200,
            redraw: false,
            }
        });

        Plotly.animate('graficoAutocorrelacao', dataAutocorrelacao, layoutAutocorrelacao, {
            transition: {
            duration: 200,
            },
            frame: {
            duration: 200,
            redraw: false,
            }
        });
    }

    if (document.getElementById("correlacao-tab").ariaSelected === "true")
    {
        Plotly.animate('graficoSinal12', dataSinal, layoutSinal, {
            transition: {
            duration: 200,
            },
            frame: {
            duration: 200,
            redraw: false,
            }
        });

        Plotly.animate('graficoCorrelacao', dataAutocorrelacao, layoutAutocorrelacao, {
            transition: {
            duration: 200,
            },
            frame: {
            duration: 200,
            redraw: false,
            }
        });
    }

    if ( document.getElementById("tabSinais").ariaSelected === "true" || document.getElementById("correlacao-tab").ariaSelected === "true" )
        requestAnimationFrame(update);
}

if ( document.getElementById("tabSinais").ariaSelected === "true" || document.getElementById("correlacao-tab").ariaSelected === "true" )
    requestAnimationFrame(update);