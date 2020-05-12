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
		tx.executeSql('create table if not exists TTipoServico (IdTipoServico int unique, Descricao text, valorPadrao double)',
		//tx.executeSql('drop table TTipoServico ',
		[],
		function (tx) {/*alert('Tabela Tipos de Serviço Criou Certo')*/; mostrarTipoServico()},
		seDerErro);
	});
}


//TipoServico
function inserirTipoServico() {
	var descricao = document.getElementById('descricaoTipoServico');
	novoIdTipoServico();
	if (descricao.value != "") {
	
		banco.transaction(function (tx) {
			var codigo    = document.getElementById('idTipoServico').value;
			var descricao = document.getElementById('descricaoTipoServico').value;
			var valorPadrao = document.getElementById('valorPadrao').value;
			
			descricao = descricao.toUpperCase();
			tx.executeSql('insert into TTipoServico (IdTipoServico, Descricao, valorPadrao) values (?,?,?)',
			[codigo, descricao, valorPadrao],
			
			function (tx) {/*alert('Registro Inserido com sucesso'); mostrarDentistas()*/; 
				mostrarTipoServico(); 	
				
			},
			seDerErro);
		});
		
	}
	
}

function novoIdTipoServico() {
	banco.transaction(function (tx) {
		var codigo    = document.getElementById('idTipoServico');
	
	    texto = 'select MAX(IdTipoServico) Id from TTipoServico'
	
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

function mostrarTipoServico() {
	banco.transaction(function (tx) {
		tx.executeSql('select * from TTipoServico ',
		[],
		function (tx, results) {
			var tamanho = results.rows.length;
			var listaQualidade = document.getElementById('listaTipoServico');
			
			listaTipoServico.innerHTML = "";
			novoIdTipoServico();
			
			var i;
			var item = null;
			
			document.getElementById('descricaoTipoServico').value = "";
			
			var cabecalho = "";
			var linhas = "";
			var rodape = "";
			
			cabecalho = '  <table class="bordered striped highlight">                       ' +
			            ' <tr>                                  ' + 
						'	<th class="">Nº</th>         ' +
						'	<th class="">Tipo De Serviço</th>        ' +
						'	<th class="">Valor Padrão</th>        ' +
						' </tr>                                 ';
			rodape = '</table>';	
				
			for(i=0; i < tamanho; i++) {
				item = results.rows.item(i);
				
				
				//texto = ' <div class="paragrafo" onclick="alterarTipoServico('+item['IdTipoServico']+')"> <b>Nº</b> : ' + item['IdTipoServico'] + '       |     <b>Tipo Serviço :</b> ' + item['Descricao']+' </div> <br>'
				
				linhas = linhas + '<tr onclick="alterarTipoServico('+item['IdTipoServico']+')" >' +
							  '<td class="">' + item['IdTipoServico'] +' </td>    ' +
							  '<td class="">' + item['Descricao']       +' </td>    ' +
							  '<td class="">' + item['valorPadrao']       +' </td>    ' +
							  '</tr>                                                  ';
				
				
			}
			listaTipoServico.innerHTML += cabecalho + linhas + rodape; 
			},	
		seDerErro);
	});
}

function excluirTipoServico() {
	var IdTipoServico = document.getElementById('idTipoServico').value;
	banco.transaction(function (tx) {
	tx.executeSql(' delete from TTipoServico where IdTipoServico = ?', 
	[IdTipoServico], 
	function (tx, results) {
		mostrarTipoServico();
		novoIdTipoServico();
	}, 
		seDerErro);
	});
}

function atualizarTipoServico() {
	var IdTipoServico = document.getElementById('idTipoServico').value;
	var Descricao = document.getElementById('descricaoTipoServico').value;
	var valorPadrao = document.getElementById('valorPadrao').value;
	
	Descricao = Descricao.toUpperCase();
	banco.transaction(function (tx) {
	tx.executeSql(' update TTipoServico set Descricao = ?, valorPadrao = ? where IdTipoServico = ?', 
	[Descricao, valorPadrao, IdTipoServico], 
	function (tx, results) {
		mostrarTipoServico();	
	}, 
		seDerErro);
	});
}

function alterarTipoServico(IdTipoServico) {	
	banco.transaction(function (tx) {
		tx.executeSql('select * from TTipoServico where IdTipoServico = ?',
		[IdTipoServico],
		function (tx, results) {
			var item = results.rows.item(0);
			
			var codigo    = document.getElementById('idTipoServico');
			var descricao = document.getElementById('descricaoTipoServico');
			var valorPadrao = document.getElementById('valorPadrao');
			
			
			codigo.value = IdTipoServico;
			descricao.value = item['Descricao'];
			valorPadrao.value = item['valorPadrao'];
		},	
		seDerErro);
	});
	
}
//TipoServico

