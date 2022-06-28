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

Pi = 3.141592653589793
dados = ""





for (k=0; k<=100; k++)
{
    console.log(k)
    dados = dados + k + "\n"
}





escreverArquivo(path, dados)