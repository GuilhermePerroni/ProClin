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
		tx.executeSql('create table if not exists TDentista (IdDentista int unique, Nome text, Ativo text)',
		[],
		function (tx) {/*alert('Tabela Dentista Criou Certo')*/; mostrarDentistas()},
		seDerErro);
	});
}

//Dentistas
function inserirDentista() {
	var descricao = document.getElementById('nomeDentista');
	novoIdDentista();
	if (descricao.value != "") {
	
		banco.transaction(function (tx) {
			var codigo    = document.getElementById('idDentista').value;
			var descricao = document.getElementById('nomeDentista').value;
			descricao = descricao.toUpperCase();
		
			tx.executeSql('insert into TDentista (IdDentista, Nome) values (?,?)',
			[codigo, descricao],
			
			function (tx) {/*alert('Registro Inserido com sucesso'); mostrarDentistas()*/; 
				mostrarDentistas(); 	
				
			},
			seDerErro);
		});
		
	}
	
}

function novoIdDentista() {
	banco.transaction(function (tx) {
		var codigo    = document.getElementById('idDentista');
	
	    texto = 'select MAX(IdDentista) Id from TDentista'
	
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

function mostrarDentistas() {
	banco.transaction(function (tx) {
		tx.executeSql('select * from TDentista ',
		[],
		function (tx, results) {
			var tamanho = results.rows.length;
			var listaDentista = document.getElementById('listaDentista');
			
			listaDentista.innerHTML = "";
			 novoIdDentista();
			
			var i;
			var item = null;
			
			document.getElementById('nomeDentista').value = "";
			
				
			var cabecalho = "";
			var linhas = "";
			var rodape = "";
			
			cabecalho = ' <table class="tg">                    ' +
			            ' <tr>                                  ' + 
						'	<th class="tg-v8f3">Nº</th>         ' +
						'	<th class="tg-yxcv">Dentista</th>   ' +
						' </tr>                                 ';
			rodape = '</table>';
		
			for(i=0; i < tamanho; i++) {
				item = results.rows.item(i);
				
				
			linhas = linhas + '<tr onclick="alterarDentista('+item['IdDentista']+')" >' +
							  '<td class="tg-vhpo">' + item['IdDentista'] +' </td>    ' +
							  '<td class="tg-timq">' + item['Nome']       +' </td>    ' +
							  '</tr>                                                  ';
							  
			}
			listaDentista.innerHTML += cabecalho + linhas + rodape; 
			
			},	
		seDerErro);
	});
}

function excluirDentista() {
	var IdDentista = document.getElementById('idDentista').value;
	banco.transaction(function (tx) {
	tx.executeSql(' delete from TDentista where IdDentista = ?', 
	[IdDentista], 
	function (tx, results) {
		mostrarDentistas();
		novoIdDentista();		
	}, 
		seDerErro);
	});
}

function atualizarDentista() {
	var IdDentista = document.getElementById('idDentista').value;
	var Nome = document.getElementById('nomeDentista').value;
	
	Nome = Nome.toUpperCase();
	
	banco.transaction(function (tx) {
	tx.executeSql(' update TDentista set Nome = ? where IdDentista = ?', 
	[Nome, IdDentista], 
	function (tx, results) {
		mostrarDentistas();	
	}, 
		seDerErro);
	});
}

function alterarDentista(IdDentista) {	
	banco.transaction(function (tx) {
		tx.executeSql('select * from TDentista where IdDentista = ?',
		[IdDentista],
		function (tx, results) {
			var item = results.rows.item(0);
			
			var codigo    = document.getElementById('idDentista');
			var descricao = document.getElementById('nomeDentista');
			
			codigo.value = IdDentista;
			descricao.value = item['Nome'];
		},	
		seDerErro);
	});
	
}
