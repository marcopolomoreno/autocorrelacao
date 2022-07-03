//pega pixels da imagem
var getPixels = require("get-pixels")

//ler e escrever arquivos
fs = require('fs');

//gerar gráfico online
var plotly = require('plotly')("mpmoreno", "NiT1RgshVXndQKNXz6Bj")

//Chamada de funções síncronas
var deasync = require('deasync');

/* -------------------------------------------------------------*/



//leitura e escrita de arquivos
/* -------------------------------------------------------------*/

const arquivoMatriz = '/matriz.txt'
const arquivoCorrelacao = '/correlacao.txt'

const pathMatriz = __dirname + `${arquivoMatriz}`
const pathCorrelacao = __dirname + `${arquivoCorrelacao}`

function lerArquivo(caminho){
    fs.readFile(caminho, 'utf-8', function(error,data){
        if(error){
            console.log('erro de leitura: ' + error.message)
        } else {
            console.log(data)
        }

    })
}

function escreverArquivo(caminho,texto){
    fs.writeFile(caminho, texto, function(error){
        if (error){
            console.error('erro de escrita' + error.message)
        } else {
            console.log('Escrita com sucesso em '+ caminho)
        }
    })
}

//lerArquivo(path)

/* -------------------------------------------------------------*/






var dados = ""
var eixoX = [], funcao = [], ACF = [];
var fMed = 0, N = 1280, norm = 0;


//Sinal padrão
var padrao = true
var tipoSinal = "gaussianaRuidoAleatorio"
//gaussiana  gaussianaRuidoSenoidal  gaussianaRuidoAleatorio
//aleatorio  aleatorioRuidoSenoidal


//Sinal de sinalEntrada
var tipoCorrelacao = "radial"
//radial  linha

if (padrao === true)
    tipoCorrelacao = "linha"

var linha = 0.5
var raio = 250




//exportação dos pixels da imagem para matriz.txt
/* -------------------------------------------------------------*/

const src = "imagem2.jpg";
var dadosImg = "", pixel = []


getPixels(src, function(err, pixels) {
  if(err) {
    console.log("Caminho errado");
    return;
  }

    if (tipoCorrelacao === "linha")
    {
        for (let y = 0; y < pixels.shape[1]; y++) {
            for (let x = 0; x < pixels.shape[0]; x++) {

                const r = pixels.get(x, y, 0);
                dadosImg = dadosImg + r + " "

                if (y === Math.floor(linha*pixels.shape[1]))
                {
                    pixel[x] = r
                }
            
            }
            dadosImg = dadosImg + "\n"
        }
    }
        
    if (tipoCorrelacao === "radial")
    {
        const x0 = 478
        const y0 = 786
        var intRadial, intensidade, thetaRad

        for (var R = 0; R < raio; R++)
        {
            intRadial = 0
            
            for (var theta = 0; theta < 360; theta++)
            {
                thetaRad = 1*Math.PI*theta/180.0

                intensidade = pixels.get(Math.floor(x0 + R*Math.cos(thetaRad)), Math.floor(y0 + R*Math.sin(thetaRad)), 0);

                intRadial = intRadial + intensidade

                if (R === 10)
                {
                    console.log(x0 + R*Math.cos(thetaRad)), Math.floor(y0 + R*Math.sin(thetaRad))
                }
            }

            pixel[R] = intensidade/360
            //console.log(pixel[R])
        }
    }

  escreverArquivo(pathMatriz, dadosImg)
});

/* -------------------------------------------------------------*/




//Função síncrona
function sinalEntrada(){
    setTimeout(function(){
        
    },3000);
    while(pixel[6] === undefined) {
      require('deasync').sleep(100);
    }

    if (tipoCorrelacao === "radial")
        N = raio

    for (t=0; t<=N-1; t++)
    {
        eixoX[t] = t

        if (padrao === true)
        {
            if (tipoSinal === "gaussiana")
                funcao[t] = Math.exp(-0.5*Math.pow( (eixoX[t]-N/2)/100, 2 ))

            if (tipoSinal === "gaussianaRuidoSenoidal")
                funcao[t] = Math.exp(-0.5*Math.pow( (eixoX[t]-N/2)/100, 2 )) + 0.1*Math.cos(0.5*t)

            if (tipoSinal === "gaussianaRuidoAleatorio")
                funcao[t] = Math.exp(-0.5*Math.pow( (eixoX[t]-N/2)/100, 2 )) + 0.1*( Math.random()-0.5 )

            if (tipoSinal === "aleatorio")
                funcao[t] = Math.random()-0.5

            if (tipoSinal === "aleatorioRuidoSenoidal")
                funcao[t] = Math.random()-0.5 + 0.02*Math.cos(0.02*t)
        }

        if (padrao === false)
            funcao[t] = pixel[t]

        fMed = fMed + funcao[t]
    }
}

sinalEntrada()

fMed = fMed/N







for(tau=0; tau<=N-1; tau++)
    ACF[tau] = 0



//Normalização
for (t=0; t<=N-1; t++)
{
    norm = norm + (funcao[t] - fMed) * (funcao[t] - fMed)
}

//Autocorrelação
for (tau=0; tau<=N-1; tau++)
{
    for (t=tau; t<=N-1; t++)
    {
        ACF[tau] = ACF[tau] + (funcao[t] - fMed) * (funcao[t-tau] - fMed)
    }

    ACF[tau] = ACF[tau]/norm
}

var linha

for (tau=0; tau<=N-1; tau++)
{
    linha = eixoX[tau] + " " + funcao[tau] + " " + ACF[tau]
    console.log(linha)
    dados = dados + linha + "\n"
}

escreverArquivo(pathCorrelacao, dados)




//Geração de gráfico online
var trace1 = {
    x: eixoX,
    y: funcao,
    name: "Função",
    type: "line"
  };

var trace2 = {
    x: eixoX,
    y: ACF,
    name: "Autocorrelação",
    type: "line"
};


var data = [trace1, trace2];
var layout = {
    fileopt : "overwrite",
    filename : "Sinal e sua autocorrelação",
    yaxis: {title: 'Sinal'},
    yaxis2: {
        title: 'Autocorrelação',
        titlefont: {color: 'rgb(148, 103, 189)'},
        tickfont: {color: 'rgb(148, 103, 189)'},
        overlaying: 'y',
        side: 'right'
    }
};

plotly.plot(data, layout, function (err, msg) {
	//if (err) return console.log(err);
	//console.log(msg);
});