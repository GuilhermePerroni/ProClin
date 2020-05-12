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
		tx.executeSql('create table if not exists TQualidade (IdQualidade int unique, Descricao text)',
		[],
		function (tx) {/*alert('Tabela Qualidade Criou Certo')*/; mostrarQualidade()},
		seDerErro);
	});
}


//Qualidades
function inserirQualidade() {
	var descricao = document.getElementById('descricaoQualidade');
	novoIdQualidade();
	if (descricao.value != "") {
	
		banco.transaction(function (tx) {
			var codigo    = document.getElementById('idQualidade').value;
			var descricao = document.getElementById('descricaoQualidade').value;
			descricao = descricao.toUpperCase();
			tx.executeSql('insert into TQualidade (IdQualidade, Descricao) values (?,?)',
			[codigo, descricao],
			
			function (tx) {/*alert('Registro Inserido com sucesso'); mostrarDentistas()*/; 
				mostrarQualidade(); 	
				
			},
			seDerErro);
		});
		
	}
	
}

function novoIdQualidade() {
	banco.transaction(function (tx) {
		var codigo    = document.getElementById('idQualidade');
	
	    texto = 'select MAX(IdQualidade) Id from TQualidade'
	
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

function mostrarQualidade() {
	banco.transaction(function (tx) {
		tx.executeSql('select * from TQualidade ',
		[],
		function (tx, results) {
			var tamanho = results.rows.length;
			var listaQualidade = document.getElementById('listaQualidade');
			
			listaQualidade.innerHTML = "";
			novoIdQualidade();
			
			var i;
			var item = null;
			
			document.getElementById('descricaoQualidade').value = "";
			
			var cabecalho = "";
			var linhas = "";
			var rodape = "";
			
			cabecalho = ' <table class="bordered striped highlight">                 ' +
			            ' <tr>                                  ' + 
						'	<th class="">Nº</th>         ' +
						'	<th class="">Qualidade</th>        ' +
						' </tr>                                 ';
			rodape = '</table>';
			
						
			for(i=0; i < tamanho; i++) {
				item = results.rows.item(i);
				
				//texto = ' <div class="paragrafo" onclick="alterarQualidade('+item['IdQualidade']+')"> <b>Nº</b> : ' + item['IdQualidade'] + '       |     <b>Qualidade :</b> ' + item['Descricao']+' </div> <br>'
				
				linhas = linhas + '<tr onclick="alterarQualidade('+item['IdQualidade']+')" >' +
							  '<td class="">' + item['IdQualidade'] +' </td>    ' +
							  '<td class="">' + item['Descricao']       +' </td>    ' +
							  '</tr>                                                  ';
			
			
				
				
			}
			listaQualidade.innerHTML += cabecalho + linhas + rodape; 
			
			},	
		seDerErro);
	});
}

function excluirQualidade() {
	var IdQualidade = document.getElementById('idQualidade').value;
	banco.transaction(function (tx) {
	tx.executeSql(' delete from TQualidade where IdQualidade = ?', 
	[IdQualidade], 
	function (tx, results) {
		mostrarQualidade();
		novoIdQualidade();
	}, 
		seDerErro);
	});
}

function atualizarQualidade() {
	var IdQualidade = document.getElementById('idQualidade').value;
	var Descricao = document.getElementById('descricaoQualidade').value;
	Descricao = Descricao.toUpperCase();
	
	banco.transaction(function (tx) {
	tx.executeSql(' update TQualidade set Descricao = ? where IdQualidade = ?', 
	[Descricao, IdQualidade], 
	function (tx, results) {
		mostrarQualidade();	
	}, 
		seDerErro);
	});
}

function alterarQualidade(IdQualidade) {	
	banco.transaction(function (tx) {
		tx.executeSql('select * from TQualidade where IdQualidade = ?',
		[IdQualidade],
		function (tx, results) {
			var item = results.rows.item(0);
			
			var codigo    = document.getElementById('idQualidade');
			var descricao = document.getElementById('descricaoQualidade');
			
			codigo.value = IdQualidade;
			descricao.value = item['Descricao'];
		},	
		seDerErro);
	});
	
}
//Qualidades

