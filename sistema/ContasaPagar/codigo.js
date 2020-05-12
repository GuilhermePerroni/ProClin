var banco; //global


function criarAbrirBanco() {
	banco = openDatabase('ProClin','1.0','Sistema de Proteses Dentarias', 2 * 1024 * 1024);
	//status.innerHTML = 'Banco Banco Criado e Aberto';
	
	/*alert('ok, Banco Criado e Aberto!');*/
	
	criarTabelas();
	montaComboProtetico();
}
	
function seDerErro(tx, error) {
	alert('Deu Erro: '+ error.message);			
}

function criarTabelas() {
	banco.transaction(function (tx) {
		tx.executeSql('create table if not exists TContaPagar (IdContaPagar int unique, IdProtetico int, Nome text, valorPagar Double,dataPagamento date, Pago text)',
		//tx.executeSql('drop table TContaPagar ',
		[],
		function (tx) {/*alert('Tabela Dentista Criou Certo')*/; mostrarContaPagar()},
		seDerErro);
	});
	
	$(document).ready(function(){
    $('select').formSelect();
	});
}

//Dentistas
function inserirContaPagar() {
	var descricao = document.getElementById('nomeContaPagar');
	novoIdContaPagar();
	if (descricao.value != "") {
	
		banco.transaction(function (tx) {
			var codigo    = document.getElementById('idContaPagar').value;
			var descricao = document.getElementById('nomeContaPagar').value;
			var valorPagar = document.getElementById('valorPagar').value;
			var pago = document.getElementById('pago').value;
			var dataPagamento = document.getElementById('dataPagamento').value;
			var IdProtetico= document.getElementById('comboProtetico').selectedIndex + 1;
			
			
			descricao = descricao.toUpperCase();
		
			tx.executeSql('insert into TContaPagar (IdContaPagar, IdProtetico, Nome, valorPagar,dataPagamento, Pago) values (?,?,?,?,?,?)',
			[codigo, IdProtetico, descricao, valorPagar, dataPagamento, pago],
			
			function (tx) {/*alert('Registro Inserido com sucesso'); mostrarDs()*/; 
				mostrarContaPagar(); 	
				
			},
			seDerErro);
		});
		
	}
	
}

function novoIdContaPagar() {
	banco.transaction(function (tx) {
		var codigo    = document.getElementById('idContaPagar');
	
	    texto = 'select MAX(IdContaPagar) Id from TContaPagar'
	
		tx.executeSql(texto ,
		[],
		
		function (tx, results) {
			
			item = results.rows.item(0);
			
			valor = 0;
			valor = item['Id'];
			
			if (valor >=0 ) {
				codigo.value = item['Id'] + 1 ; 
			} else {
				codigo.value = 1; 	
			}
				
		},
		seDerErro);
	});
}

function mostrarContaPagar() {
	banco.transaction(function (tx) {
		tx.executeSql('select a.*, b.Nome as Protetico from TContaPagar a left join TProtetico b on (a.IdProtetico = b.IdProtetico) order by Pago asc ',
		[],
		function (tx, results) {
			var tamanho = results.rows.length;
			var listaContaPagar = document.getElementById('listaContaPagar');
			
			listaContaPagar.innerHTML = "";
			 novoIdContaPagar();
			
			var i;
			var item = null;
			
			document.getElementById('nomeContaPagar').value = "";
			
				
			var cabecalho = "";
			var linhas = "";
			var rodape = "";
			
			cabecalho = '  <table class="bordered striped highlight">                    ' +
			            ' <tr>                                  ' + 
						'	<th class="">N</th>         ' +
						'	<th class="">Descricao</th>   ' +
						'	<th class="">Protetico</th>   ' +
						'	<th class="">Data Pagamento</th>   ' +
						
						'	<th class="">Valor</th>   ' +
						'	<th class="">Pago</th>   ' +
						' </tr>                                 ';
			rodape = '</table>';
		
			for(i=0; i < tamanho; i++) {
				item = results.rows.item(i);
				
				item['dataPagamento'] = formataData(item['dataPagamento']);
				
			if (item['Pago'] == "0") { item['Pago'] = "---"}; 
			if (item['Pago'] == "1") { item['Pago'] = "NAO"};
			if (item['Pago'] == "2") { item['Pago'] = "SIM"};	

					if (item['Pago'] == "---") { 
							linhas = linhas + '<tr class="" onclick="alterarContaPagar('+item['IdContaPagar']+')" >' +
											  '<td class="">' + item['IdContaPagar'] +' </td>    ' +
											    '<td class="">' + item['Nome']       +' </td>    ' +
											  '<td class="">' + item['Protetico'] +' </td>    ' +
											'<td class="">' + item['dataPagamento'] +' </td>    ' +
											
											  '<td class="">' + item['valorPagar']       +' </td>    ' +
											  '<td class="">' + item['Pago']       +' </td>    ' +
											  '</tr>                                                  ';
					}
					
					if (item['Pago'] ==  "NAO") { 
							linhas = linhas + '<tr class="red lighten-3" onclick="alterarContaPagar('+item['IdContaPagar']+')" >' +
											  '<td class="">' + item['IdContaPagar'] +' </td>    ' +
											    '<td class="">' + item['Nome']       +' </td>    ' +
											   '<td class="">' + item['Protetico'] +' </td>    ' +
											   '<td class="">' + item['dataPagamento'] +' </td>    ' +
											 
											  '<td class="">' + item['valorPagar']       +' </td>    ' +
											  '<td class="">' + item['Pago']       +' </td>    ' +
											  '</tr>                                                  ';
					}
					
					if (item['Pago'] == "SIM") {  
							linhas = linhas + '<tr class="teal lighten-3" onclick="alterarContaPagar('+item['IdContaPagar']+')" >' +
											  '<td class="">' + item['IdContaPagar'] +' </td>    ' +
												'<td class="">' + item['Nome']       +' </td>    ' +											 
											 '<td class="">' + item['Protetico'] +' </td>    ' +
											 '<td class="">' + item['dataPagamento'] +' </td>    ' +
											  
											  '<td class="">' + item['valorPagar']       +' </td>    ' +
											  '<td class="">' + item['Pago']       +' </td>    ' +
											  '</tr>                                                  ';
					}
			
			
			}
			
			listaContaPagar.innerHTML += cabecalho + linhas + rodape; 
			
			},	
		seDerErro);
	});
}

function excluirContaPagar() {
	var IdContaPagar = document.getElementById('idContaPagar').value;
	banco.transaction(function (tx) {
	tx.executeSql(' delete from TContaPagar where IdContaPagar = ?', 
	[IdContaPagar], 
	function (tx, results) {
		mostrarContaPagar();
		novoIdContaPagar();		
	}, 
		seDerErro);
	});
}

function atualizarContaPagar() {
	var IdContaPagar = document.getElementById('idContaPagar').value;
	var Nome = document.getElementById('nomeContaPagar').value;
	var valorPagar = document.getElementById('valorPagar').value;
	var pago = document.getElementById('pago').value;
	var dataPagamento = document.getElementById('dataPagamento').value;
	var IdProtetico    = document.getElementById('comboProtetico').selectedIndex    + 1;
	
	Nome = Nome.toUpperCase();
	
	banco.transaction(function (tx) {
	tx.executeSql(' update TContaPagar set Nome = ?, IdProtetico = ?, valorPagar = ?,dataPagamento=?, Pago = ? where IdContaPagar = ?', 
	[Nome,IdProtetico, valorPagar,dataPagamento,pago, IdContaPagar], 
	function (tx, results) {
		mostrarContaPagar();	
	}, 
		seDerErro);
	});
}

function alterarContaPagar(IdContaPagar) {	
	banco.transaction(function (tx) {
		tx.executeSql('select * from TContaPagar where IdContaPagar = ?',
		[IdContaPagar],
		function (tx, results) {
			var item = results.rows.item(0);
			
			var codigo    = document.getElementById('idContaPagar');
			var descricao = document.getElementById('nomeContaPagar');
			var valorPagar = document.getElementById('valorPagar');
			var pago        = document.getElementById('pago');
			var IdProtetico    = document.getElementById('comboProtetico');
			var dataPagamento    = document.getElementById('dataPagamento');
			codigo.value = IdContaPagar;
			descricao.value = item['Nome'];
			valorPagar.value = item['valorPagar'];
			//pago.value       = item['pago'];
			dataPagamento.value = item['dataPagamento'];
			IdProtetico.selectedIndex    = item['IdProtetico']-1;
			
			if (item['Pago'] == "0") {
				pago.selectedIndex = 0;	
			}
			
			if (item['Pago'] == "1") {
				pago.selectedIndex = 1;	
			}
			
			if (item['Pago'] == "2") {
				pago.selectedIndex = 2;	
			}
			
			$(document).ready(function(){
				$('select').formSelect();
			});
			
		},	
		seDerErro);
	});
	
}

function montaComboProtetico() {
	banco.transaction(function (tx) {
		tx.executeSql('select * from TProtetico ',
		[],
		function (tx, results) {
			var tamanho = results.rows.length;
			var listaProtetico = document.getElementById('listaProtetico');
			
			listaProtetico.innerHTML = " ";
			
			var corpo;
			var i;
			var item = null;
	
			cabecalho = '<div class="input-field col s12">'+
						'<select onchange="" class="uppercase" id="comboProtetico" name="comboProtetico"> ';
				
			for(i=0; i < tamanho; i++) {
				item = results.rows.item(i);
					
			corpo =  corpo + ' <option value="' + item['IdProtetico'] + '">' + item['Nome'] + ' </option> ';
					
			}
			rodape = ' </select>  <label for="comboProtetico"> Protetico </label> </div> ';
			listaProtetico.innerHTML += cabecalho + corpo + rodape;
			
			$(document).ready(function(){
				$('select').formSelect();
			});	
			
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