var banco; //global


function criarAbrirBanco() {
	banco = openDatabase('ProClin','1.0','Sistema de Proteses Dentarias', 2 * 1024 * 1024);
	//status.innerHTML = 'Banco Banco Criado e Aberto';
	
	/*alert('ok, Banco Criado e Aberto!');*/
	
	criarTabelas();
}
	
function seDerErro(tx, error) {
	alert('Deu Erro: '+ error.message);			
}

function criarTabelas() {
	banco.transaction(function (tx) {
		tx.executeSql('create table if not exists TProtetico (IdProtetico int unique, Nome text, Ativo text)',
		[],
		function (tx) {/*alert('Tabela Protetico Criou Certo')*/; mostrarProteticos()},
		seDerErro);
	});
}

//Proteticos
function inserirProtetico() {
	var descricao = document.getElementById('nomeProtetico');
	novoIdProtetico();
	if (descricao.value != "") {
	
		banco.transaction(function (tx) {
			var codigo    = document.getElementById('idProtetico').value;
			var descricao = document.getElementById('nomeProtetico').value;
			descricao = descricao.toUpperCase();
		
			tx.executeSql('insert into TProtetico (IdProtetico, Nome) values (?,?)',
			[codigo, descricao],
			
			function (tx) {/*alert('Registro Inserido com sucesso'); mostrarProteticos()*/; 
				mostrarProteticos(); 	
				
			},
			seDerErro);
		});
		
	}
	
}

function novoIdProtetico() {
	banco.transaction(function (tx) {
		var codigo    = document.getElementById('idProtetico');
	
	    texto = 'select MAX(IdProtetico) Id from TProtetico'
	
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

function mostrarProteticos() {
	banco.transaction(function (tx) {
		tx.executeSql('select * from TProtetico ',
		[],
		function (tx, results) {
			var tamanho = results.rows.length;
			var listaProtetico = document.getElementById('listaProtetico');
			
			listaProtetico.innerHTML = "";
			 novoIdProtetico();
			
			var i;
			var item = null;
			
			document.getElementById('nomeProtetico').value = "";
			
				
			var cabecalho = "";
			var linhas = "";
			var rodape = "";
			
			cabecalho = '  <table class="bordered striped highlight">                    ' +
			            ' <tr>                                  ' + 
						'	<th class="">N</th>         ' +
						'	<th class="">Protetico</th>   ' +
						' </tr>                                 ';
			rodape = '</table>';
		
			for(i=0; i < tamanho; i++) {
				item = results.rows.item(i);
				
				
			linhas = linhas + '<tr onclick="alterarProtetico('+item['IdProtetico']+')" >' +
							  '<td class="">' + item['IdProtetico'] +' </td>    ' +
							  '<td class="">' + item['Nome']       +' </td>    ' +
							  '</tr>                                                  ';
							  
			}
			listaProtetico.innerHTML += cabecalho + linhas + rodape; 
			
			},	
		seDerErro);
	});
}

function excluirProtetico() {
	var IdProtetico = document.getElementById('idProtetico').value;
	banco.transaction(function (tx) {
	tx.executeSql(' delete from TProtetico where IdProtetico = ?', 
	[IdProtetico], 
	function (tx, results) {
		mostrarProteticos();
		novoIdProtetico();		
	}, 
		seDerErro);
	});
}

function atualizarProtetico() {
	var IdProtetico = document.getElementById('idProtetico').value;
	var Nome = document.getElementById('nomeProtetico').value;
	
	Nome = Nome.toUpperCase();
	
	banco.transaction(function (tx) {
	tx.executeSql(' update TProtetico set Nome = ? where IdProtetico = ?', 
	[Nome, IdProtetico], 
	function (tx, results) {
		mostrarProteticos();	
	}, 
		seDerErro);
	});
}

function alterarProtetico(IdProtetico) {	
	banco.transaction(function (tx) {
		tx.executeSql('select * from TProtetico where IdProtetico = ?',
		[IdProtetico],
		function (tx, results) {
			var item = results.rows.item(0);
			
			var codigo    = document.getElementById('idProtetico');
			var descricao = document.getElementById('nomeProtetico');
			
			codigo.value = IdProtetico;
			descricao.value = item['Nome'];
		},	
		seDerErro);
	});
	
}
