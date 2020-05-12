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
		tx.executeSql('create table if not exists TEscala (IdEscala int unique, Descricao text)',
		[],
		function (tx) {/*alert('Tabela Tipos de Serviço Criou Certo')*/; mostrarEscala()},
		seDerErro);
	});
}


//TipoServico
function inserirEscala() {
	var descricao = document.getElementById('descricaoEscala');
	novoIdEscala();
	if (descricao.value != "") {
	
		banco.transaction(function (tx) {
			var codigo    = document.getElementById('idEscala').value;
			var descricao = document.getElementById('descricaoEscala').value;
			descricao = descricao.toUpperCase();
			tx.executeSql('insert into TEscala (IdEscala, Descricao) values (?,?)',
			[codigo, descricao],
			
			function (tx) {/*alert('Registro Inserido com sucesso'); mostrarDentistas()*/; 
				mostrarEscala(); 	
				
			},
			seDerErro);
		});
		
	}
	
}

function novoIdEscala() {
	banco.transaction(function (tx) {
		var codigo    = document.getElementById('idEscala');
	
	    texto = 'select MAX(IdEscala) Id from TEscala'
	
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

function mostrarEscala() {
	banco.transaction(function (tx) {
		tx.executeSql('select * from TEscala ',
		[],
		function (tx, results) {
			var tamanho = results.rows.length;
			var listaEscala = document.getElementById('listaEscala');
			
			listaEscala.innerHTML = "";
			novoIdEscala();
			
			var i;
			var item = null;
			
			document.getElementById('descricaoEscala').value = "";
			
			var cabecalho = "";
			var linhas = "";
			var rodape = "";
			
			cabecalho = ' <table class="tg">                    ' +
			            ' <tr>                                  ' + 
						'	<th class="tg-v8f3">Nº</th>         ' +
						'	<th class="tg-yxcv">Escala</th>        ' +
						' </tr>                                 ';
			rodape = '</table>';
						
						
			for(i=0; i < tamanho; i++) {
				item = results.rows.item(i);
				
				
				//texto = ' <div class="paragrafo" onclick="alterarEscala('+item['IdEscala']+')"> <b>Nº</b> : ' + item['IdEscala'] + '       |     <b>Escala :</b> ' + item['Descricao']+' </div> <br>'
				
				linhas = linhas + '<tr onclick="alterarEscala('+item['IdEscala']+')" >' +
							  '<td class="tg-vhpo">' + item['IdEscala'] +' </td>    ' +
							  '<td class="tg-timq">' + item['Descricao']       +' </td>    ' +
							  '</tr>                                                  ';
			
				
				
			}
			listaEscala.innerHTML += cabecalho + linhas + rodape; 
			
			},	
		seDerErro);
	});
}

function excluirEscala() {
	var IdEscala = document.getElementById('idEscala').value;
	banco.transaction(function (tx) {
	tx.executeSql(' delete from TEscala where IdEscala = ?', 
	[IdEscala], 
	function (tx, results) {
		mostrarEscala();
		novoIdEscala();
	}, 
		seDerErro);
	});
}

function atualizarEscala() {
	var IdEscala = document.getElementById('idEscala').value;
	var Descricao = document.getElementById('descricaoEscala').value;
	Descricao = Descricao.toUpperCase();
	
	banco.transaction(function (tx) {
	tx.executeSql(' update TEscala set Descricao = ? where IdEscala = ?', 
	[Descricao, IdEscala], 
	function (tx, results) {
		mostrarEscala();	
	}, 
		seDerErro);
	});
}

function alterarEscala(IdEscala) {	
	banco.transaction(function (tx) {
		tx.executeSql('select * from TEscala where IdEscala = ?',
		[IdEscala],
		function (tx, results) {
			var item = results.rows.item(0);
			
			var codigo    = document.getElementById('idEscala');
			var descricao = document.getElementById('descricaoEscala');
			
			codigo.value = IdEscala;
			descricao.value = item['Descricao'];
		},	
		seDerErro);
	});
	
}
//TipoServico

