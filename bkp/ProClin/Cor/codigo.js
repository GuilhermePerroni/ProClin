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
		tx.executeSql('create table if not exists TCor (IdCor int unique, Descricao text)',
		[],
		function (tx) {/*alert('Tabela Tipos de Serviço Criou Certo')*/; mostrarCor()},
		seDerErro);
	});
}


//TipoServico
function inserirCor() {
	var descricao = document.getElementById('descricaoCor');
	novoIdCor();
	if (descricao.value != "") {
	
		banco.transaction(function (tx) {
			var codigo    = document.getElementById('idCor').value;
			var descricao = document.getElementById('descricaoCor').value;
		    descricao = descricao.toUpperCase();
			
			tx.executeSql('insert into TCor (IdCor, Descricao) values (?,?)',
			[codigo, descricao],
			
			function (tx) {/*alert('Registro Inserido com sucesso'); mostrarDentistas()*/; 
				mostrarCor(); 	
				
			},
			seDerErro);
		});
		
	}
	
}

function novoIdCor() {
	banco.transaction(function (tx) {
		var codigo    = document.getElementById('idCor');
	
	    texto = 'select MAX(IdCor) Id from TCor'
	
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

function mostrarCor() {
	banco.transaction(function (tx) {
		tx.executeSql('select * from TCor ',
		[],
		function (tx, results) {
			var tamanho = results.rows.length;
			var listaCor = document.getElementById('listaCor');
			
			listaCor.innerHTML = "";
			novoIdCor();
			
			var i;
			var item = null;
			
			document.getElementById('descricaoCor').value = "";
				
			var cabecalho = "";
			var linhas = "";
			var rodape = "";
			
			cabecalho = ' <table class="tg">                    ' +
			            ' <tr>                                  ' + 
						'	<th class="tg-v8f3">Nº</th>         ' +
						'	<th class="tg-yxcv">Cor</th>        ' +
						' </tr>                                 ';
			rodape = '</table>';
			
						
			for(i=0; i < tamanho; i++) {
				item = results.rows.item(i);
				
				
				//texto = ' <div class="paragrafo" onclick="alterarCor('+item['IdCor']+')"> <b>Nº</b> : ' + item['IdCor'] + '       |     <b>Cor :</b> ' + item['Descricao']+' </div> <br>'
				
				
				linhas = linhas + '<tr onclick="alterarCor('+item['IdCor']+')" >' +
							  '<td class="tg-vhpo">' + item['IdCor'] +' </td>    ' +
							  '<td class="tg-timq">' + item['Descricao']       +' </td>    ' +
							  '</tr>                                                  ';
				
			}
			
			listaCor.innerHTML += cabecalho + linhas + rodape; 
			
			},	
		seDerErro);
	});
}

function excluirCor() {
	var IdCor = document.getElementById('idCor').value;
	banco.transaction(function (tx) {
	tx.executeSql(' delete from TCor where IdCor = ?', 
	[IdCor], 
	function (tx, results) {
		mostrarCor();
		novoIdCor();
	}, 
		seDerErro);
	});
}

function atualizarCor() {
	var IdCor = document.getElementById('idCor').value;
	var Descricao = document.getElementById('descricaoCor').value;
	Descricao = Descricao.toUpperCase();
	
	banco.transaction(function (tx) {
	tx.executeSql(' update TCor set Descricao = ? where IdCor = ?', 
	[Descricao, IdCor], 
	function (tx, results) {
		mostrarCor();	
	}, 
		seDerErro);
	});
}

function alterarCor(IdCor) {	
	banco.transaction(function (tx) {
		tx.executeSql('select * from TCor where IdCor = ?',
		[IdCor],
		function (tx, results) {
			var item = results.rows.item(0);
			
			var codigo    = document.getElementById('idCor');
			var descricao = document.getElementById('descricaoCor');
			
			codigo.value = IdCor;
			descricao.value = item['Descricao'];
		},	
		seDerErro);
	});
	
}
//TipoServico

