fs = require('fs');

const nome_arquivo = '/dados.txt'

const path = __dirname + `${nome_arquivo}`

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
            console.log('escreve com sucesso em '+ caminho)
        }
    })
}

//lerArquivo(path)



var plotly = require('plotly')("mpmoreno", "fNau5X68Gy4IcfXJeMfS")



var dados = ""
var eixoX = [], funcao = [], ACF = [];
var fMed = 0, N = 1000;

for (t=0; t<=N; t++)
{
    eixoX[t] = t
    funcao[t] = Math.exp(-0.5*Math.pow( (eixoX[t]-N/2)/100, 2 )) + 0.1*Math.cos(0.5*t)
    //funcao[t] = Math.random()-0.5 + 0.02*Math.cos(0.02*t)
    fMed = fMed + funcao[t]
}

fMed = fMed/(N+1)

for(tau=0; tau<=N; tau++)
    ACF[tau] = 0

//ver aqui
for (tau=0; tau<=N; tau++)
{
    for (t=tau; t<=N; t++)
    {
        ACF[tau] = ACF[tau] + funcao[t] * funcao[t-tau]
    }
}

var linha

for (tau=0; tau<=N; tau++)
{
    linha = eixoX[tau] + " " + funcao[tau] + " " + ACF[tau]
    console.log(linha)
    dados = dados + linha + "\n"
}



escreverArquivo(path, dados)


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
var layout = {fileopt : "overwrite", filename : "simple-node-example"};

plotly.plot(data, layout, function (err, msg) {
	//if (err) return console.log(err);
	//console.log(msg);
});