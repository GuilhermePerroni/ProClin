var banco; //global

var preparacao; //1 normal 2 editar/excluir

function criarAbrirBanco() {
	banco = openDatabase('ProClin','1.0','Sistema de Proteses Dentarias', 2 * 1024 * 1024);
    mostrarLancamento2Dias();
	mostrarLancamento1Dias();
	mostrarLancamento0Dias();
}
	
function seDerErro(tx, error) {
	alert('Deu Erro: '+ error.message);			
}

function criarTabelas() {
	banco.transaction(function (tx) {
		//tx.executeSql('drop table TLancamento',
		tx.executeSql('create table if not exists TLancamento (IdLancamento int unique, IdDentista int, Paciente text, Cor int, Escala int, IdServico int, IdQualidade int, Obs text, Entrada date, Entrega date, Previsao date, Valor double, ValorPago Double, Concluido Text, LancamentoFechado)',
		[],
		function (tx) {/*alert('Tabela Lancamentos Criou Certo')*/; mostrarLancamento()},
		seDerErro);
	});
}


function mostrarLancamento2Dias() {
	banco.transaction(function (tx) {
		//tx.executeSql('select * from TLancamento ',
		tx.executeSql('select a.*, date("now","-2 days") as teste, b.Nome as Dentista, c.Descricao TipoServico, d.Descricao as NCor, e.Descricao as NEscala             '+
					  'from TLancamento as a LEFT JOIN TDentista    as b on (a.IdDentista = b.IdDentista)      '+
					  '                      LEFT JOIN TTipoServico as c on (a.IdServico  = c.IdTipoServico)     '+
					  '                      LEFT JOIN TCor         as d on (a.Cor        = d.IdCor)     '+
					  '                      LEFT JOIN TEscala      as e on (a.Escala     = e.IdEscala)     '+
					  'where Concluido = "N" and a.entrega = date("now","+2 days") ',
		[],
		function (tx, results) {
			var tamanho = results.rows.length;
			var listaLancamento = document.getElementById('listaLancamento');
			
			listaLancamento.innerHTML = "";
			
			var i;
			var item = null;
			
			//var dataEntrada = document.getElementById('dataEntrada');
			
			var cabecalho = "";
			var linhas = "";
			var rodape = "";
			
			var SomaTotal = 0;
			
			cabecalho = ' <table class="bordered striped highlight  teal lighten-3 ">                    ' +
			            ' <tr>                                  ' + 
						'	<th class="">Nº</th>         ' +
						'	<th class="">Dentista</th>   ' +
						'	<th class="">Paciente</th>   ' +
						'	<th class="">TipoServico</th>' +
						'	<th class="">Entrega</th>    ' +
						'	<th class="">Valor</th>      ' +
						' </tr>                                 ';
			rodape = '</table>';
			
			
						
			for(i=0; i < tamanho; i++) {
				item = results.rows.item(i);
				
				if (item['Valor']=="") { item['Valor'] =0 }
				
				
					
				
				
				
				
				item['Entrega'] = formataData(item['Entrega']);
				
				var pv = parseFloat(item['Valor']);
				
				item['Valor'] = moeda(pv,2,'.','');
				
				
			
				
				linhas = linhas + '<tr onclick="alterarLancamento('+item['IdLancamento']+')" >     ' +
							  '<td class="">' + item['IdLancamento'] +' </td>    ' +
							  '<td class="">' + item['Dentista']    +' </td>    ' +
							  '<td class="">' + item['Paciente']    +' </td>    ' +
							  '<td class="">' + item['TipoServico']    +' </td> ' +
							  '<td class="">' + item['Entrega']   +' </td>     ' +
							  '<td class="">' + item['Valor']    +' </td>       ' +
							  
							  '</tr>                                                              ';
				
			
			}
			
			
		
			listaLancamento.innerHTML += cabecalho + linhas + rodape;
			},	
		seDerErro);
	});
}


function formataData(data){
	//2017-06-15
	
	var xdata = data;
	
	var ano = xdata.substring(0, [4]);
	var mes = xdata.substring(6, [7]);
	var dia = xdata.substring(8, [10]);
	
	if (dia.length==1) {
		dia = '0'+dia;		
	}
	if (mes.length==1) {
		mes = '0'+mes;		
	}
	
	var xdata = dia+'/'+mes+'/'+ano;
	
	return xdata;

}

function mostrarLancamento1Dias() {
	banco.transaction(function (tx) {
		//tx.executeSql('select * from TLancamento ',
		tx.executeSql('select a.*, date("now","-2 days") as teste, b.Nome as Dentista, c.Descricao TipoServico, d.Descricao as NCor, e.Descricao as NEscala             '+
					  'from TLancamento as a LEFT JOIN TDentista    as b on (a.IdDentista = b.IdDentista)      '+
					  '                      LEFT JOIN TTipoServico as c on (a.IdServico  = c.IdTipoServico)     '+
					  '                      LEFT JOIN TCor         as d on (a.Cor        = d.IdCor)     '+
					  '                      LEFT JOIN TEscala      as e on (a.Escala     = e.IdEscala)     '+
					  'where Concluido = "N" and a.entrega = date("now","+1 days") ',
		[],
		function (tx, results) {
			var tamanho = results.rows.length;
			var listaLancamentoAmanha = document.getElementById('listaLancamentoAmanha');
			
			listaLancamentoAmanha.innerHTML = "";
			
			var i;
			var item = null;
			
			//var dataEntrada = document.getElementById('dataEntrada');
			
			var cabecalho = "";
			var linhas = "";
			var rodape = "";
			
			var SomaTotal = 0;
			
			cabecalho = ' <table class="bordered striped highlight blue lighten-3">                    ' +
			            ' <tr>                                  ' + 
						'	<th class="">Nº</th>         ' +
						'	<th class="">Dentista</th>   ' +
						'	<th class="">Paciente</th>   ' +
						'	<th class="">TipoServico</th>' +
						'	<th class="">Entrega</th>    ' +
						'	<th class="">Valor</th>      ' +
						' </tr>                                 ';
			rodape = '</table>';
			
			
						
			for(i=0; i < tamanho; i++) {
				item = results.rows.item(i);
				
				if (item['Valor']=="") { item['Valor'] =0 }
				
				
					
				
				
				
				
				item['Entrega'] = formataData(item['Entrega']);
				
				var pv = parseFloat(item['Valor']);
				
				item['Valor'] = moeda(pv,2,'.','');
				
				
			
				
				linhas = linhas + '<tr onclick="alterarLancamento('+item['IdLancamento']+')" >     ' +
							  '<td class="">' + item['IdLancamento'] +' </td>    ' +
							  '<td class="">' + item['Dentista']    +' </td>    ' +
							  '<td class="">' + item['Paciente']    +' </td>    ' +
							  '<td class="">' + item['TipoServico']    +' </td> ' +
							  '<td class="">' + item['Entrega']   +' </td>     ' +
							  '<td class="">' + item['Valor']    +' </td>       ' +
							  
							  '</tr>                                                              ';
				
			
			}
			
			
		
			listaLancamentoAmanha.innerHTML += cabecalho + linhas + rodape;
			},	
		seDerErro);
	});
}

function mostrarLancamento0Dias() {
	banco.transaction(function (tx) {
		//tx.executeSql('select * from TLancamento ',
		tx.executeSql('select a.*, date("now","-2 days") as teste, b.Nome as Dentista, c.Descricao TipoServico, d.Descricao as NCor, e.Descricao as NEscala             '+
					  'from TLancamento as a LEFT JOIN TDentista    as b on (a.IdDentista = b.IdDentista)      '+
					  '                      LEFT JOIN TTipoServico as c on (a.IdServico  = c.IdTipoServico)     '+
					  '                      LEFT JOIN TCor         as d on (a.Cor        = d.IdCor)     '+
					  '                      LEFT JOIN TEscala      as e on (a.Escala     = e.IdEscala)     '+
					  'where Concluido = "N" and a.entrega = date("now","+0 days") ',
		[],
		function (tx, results) {
			var tamanho = results.rows.length;
			var listaLancamentoHoje = document.getElementById('listaLancamentoHoje');
			
			listaLancamentoHoje.innerHTML = "";
			
			var i;
			var item = null;
			
			//var dataEntrada = document.getElementById('dataEntrada');
			
			var cabecalho = "";
			var linhas = "";
			var rodape = "";
			
			var SomaTotal = 0;
			
			cabecalho = ' <table class="bordered striped highlight red lighten-2">                    ' +
			            ' <tr>                                  ' + 
						'	<th class="">Nº</th>         ' +
						'	<th class="">Dentista</th>   ' +
						'	<th class="">Paciente</th>   ' +
						'	<th class="">TipoServico</th>' +
						'	<th class="">Entrega</th>    ' +
						'	<th class="">Valor</th>      ' +
						' </tr>                                 ';
			rodape = '</table>';
			
			
						
			for(i=0; i < tamanho; i++) {
				item = results.rows.item(i);
				
				if (item['Valor']=="") { item['Valor'] =0 }
				
				
					
				
				
				
				
				item['Entrega'] = formataData(item['Entrega']);
				
				var pv = parseFloat(item['Valor']);
				
				item['Valor'] = moeda(pv,2,'.','');
				
				
			
				
				linhas = linhas + '<tr onclick="alterarLancamento('+item['IdLancamento']+')" >     ' +
							  '<td class="">' + item['IdLancamento'] +' </td>    ' +
							  '<td class="">' + item['Dentista']    +' </td>    ' +
							  '<td class="">' + item['Paciente']    +' </td>    ' +
							  '<td class="">' + item['TipoServico']    +' </td> ' +
							  '<td class="">' + item['Entrega']   +' </td>     ' +
							  '<td class="">' + item['Valor']    +' </td>       ' +
							  
							  '</tr>                                                              ';
				
			
			}
			
			
		
			listaLancamentoHoje.innerHTML += cabecalho + linhas + rodape;
			},	
		seDerErro);
	});
}


