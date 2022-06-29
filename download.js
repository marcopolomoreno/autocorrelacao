function download(dados)
{
	var finalValor = '';

	for (var i = 0; i < dados.length; i++)
	{
		var valor = dados[i];    
		for (var j = 0; j < valor.length; j++)
		{
			var innerValor = valor[j];
			var resultado = innerValor.replace(/"/g, '""');
			if (resultado.search(/("|,|\n)/g) >= 0)
				resultado = '"' + resultado + '"';
			if (j > 0)
				finalValor += ' ';
			finalValor += resultado;
		}
        finalValor += '\n';
	}

	var gravar = document.createElement('a');
	gravar.setAttribute('href', 'data:text;charset=utf-8,' + encodeURIComponent(finalValor));
	gravar.setAttribute('download', 'dados2.txt');
	gravar.click();
}