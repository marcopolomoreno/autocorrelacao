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





//exportação dos pixels da imagem para dados.txt
/* -------------------------------------------------------------*/

const src = "imagem4.jpg";
var dadosImg = "", pix = []

getPixels(src, function(err, pixels) {
  if(err) {
    console.log("Caminho errado");
    return;
  }

  for (let y = 0; y < pixels.shape[1]; y++) {
    for (let x = 0; x < pixels.shape[0]; x++) {

      const r = pixels.get(x, y, 0);
      //const g = pixels.get(x, y, 1);
      //const b = pixels.get(x, y, 2);
      //const a = pixels.get(x, y, 3);
      //const rgba = `color: rgba(${r}, ${g}, ${b}, ${a});`;
      dadosImg = dadosImg + r + " "

      if (y === Math.floor(0.5*pixels.shape[1]))
      {
        pix[x] = r
      }
        
    }
    dadosImg = dadosImg + "\n"
  }

  escreverArquivo(pathMatriz, dadosImg)
});

/* -------------------------------------------------------------*/



var dados = ""
var eixoX = [], funcao = [], ACF = [];
var fMed = 0, N = 1280, norm = 0;


//Sinal padrão
var padrao = true
var tipoSinal = "aleatorio"
//gaussiana  gaussianaRuidoSenoidal  gaussianaRuidoAleatorio
//aleatorio  aleatorioRuidoSenoidal


//Função síncrona
function sinalEntrada(){
    setTimeout(function(){
        
    },3000);
    while(pix[6] === undefined) {
      require('deasync').sleep(100);
    }

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
            funcao[t] = pix[t]

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
    norm = norm + funcao[t] * funcao[t]
}


for (tau=0; tau<=N-1; tau++)
{
    for (t=tau; t<=N-1; t++)
    {
        ACF[tau] = ACF[tau] + funcao[t] * funcao[t-tau]
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