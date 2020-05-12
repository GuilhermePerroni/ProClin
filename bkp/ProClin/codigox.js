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
	
	banco.transaction(function (tx) {
		tx.executeSql('create table if not exists TTipoServico (IdTipoServico int unique, Descricao text)',
		[],
		function (tx) {/*alert('Tabela Tipos de Serviço Criou Certo')*/; mostrarTipoServico()},
		seDerErro);
	});
	banco.transaction(function (tx) {
		tx.executeSql('create table if not exists TQualidade (IdQualidade int unique, Descricao text)',
		[],
		function (tx) {/*alert('Tabela Qualidade Criou Certo')*/; mostrarQualidade()},
		seDerErro);
	});
	banco.transaction(function (tx) {
		tx.executeSql('create table if not exists TLancamento (IdLancamento int unique, IdDentista int, Paciente text, Cor text, Escala text, IdServico int, IdQualidade int, Obs text, Entrada date, Entrega date, Previsao date, Valor double)',
		[],
		function (tx) {/*alert('Tabela Lancamentos Criou Certo')*/; mostrarLancamento()},
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
			
						
			for(i=0; i < tamanho; i++) {
				item = results.rows.item(i);
				
				//texto = '<p> Nº Dentista : ' + item['IdDentista'] + '| Nome : ' + item['Nome']+' - <input type="button" value="Excluir" onclick="excluirDentista('+item['IdDentista']+')"> <input type="button" value="Alterar" onclick="alterarDentista('+item['IdDentista']+')"> ';
				
				//texto = '<p class="paragrafo" onclick="alterarDentista('+item['IdDentista']+')"> Nº Dentista : ' + item['IdDentista'] + '| Nome : ' + item['Nome']+' </p>'
				
				texto = ' <div class="paragrafo" onclick="alterarDentista('+item['IdDentista']+')"> <b>Nº</b> : ' + item['IdDentista'] + '       |     <b>Dentista :</b> ' + item['Nome']+' </div> <br>'
				
			
				
				listaDentista.innerHTML += texto;
			}},	
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

//Dentistas

//Qualidades
function inserirQualidade() {
	var descricao = document.getElementById('descricaoQualidade');
	novoIdQualidade();
	if (descricao.value != "") {
	
		banco.transaction(function (tx) {
			var codigo    = document.getElementById('idQualidade').value;
			var descricao = document.getElementById('descricaoQualidade').value;
		
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
			
						
			for(i=0; i < tamanho; i++) {
				item = results.rows.item(i);
				
				//texto = '<p> Nº Dentista : ' + item['IdDentista'] + '| Nome : ' + item['Nome']+' - <input type="button" value="Excluir" onclick="excluirDentista('+item['IdDentista']+')"> <input type="button" value="Alterar" onclick="alterarDentista('+item['IdDentista']+')"> ';
				
				//texto = '<p class="paragrafo" onclick="alterarDentista('+item['IdDentista']+')"> Nº Dentista : ' + item['IdDentista'] + '| Nome : ' + item['Nome']+' </p>'
				
				texto = ' <div class="paragrafo" onclick="alterarQualidade('+item['IdQualidade']+')"> <b>Nº</b> : ' + item['IdQualidade'] + '       |     <b>Qualidade :</b> ' + item['Descricao']+' </div> <br>'
				
			
				
				listaQualidade.innerHTML += texto;
			}},	
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


//TipoServico
function inserirTipoServico() {
	var descricao = document.getElementById('descricaoTipoServico');
	novoIdTipoServico();
	if (descricao.value != "") {
	
		banco.transaction(function (tx) {
			var codigo    = document.getElementById('idTipoServico').value;
			var descricao = document.getElementById('descricaoTipoServico').value;
		
			tx.executeSql('insert into TTipoServico (IdTipoServico, Descricao) values (?,?)',
			[codigo, descricao],
			
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
			
						
			for(i=0; i < tamanho; i++) {
				item = results.rows.item(i);
				
				//texto = '<p> Nº Dentista : ' + item['IdDentista'] + '| Nome : ' + item['Nome']+' - <input type="button" value="Excluir" onclick="excluirDentista('+item['IdDentista']+')"> <input type="button" value="Alterar" onclick="alterarDentista('+item['IdDentista']+')"> ';
				
				//texto = '<p class="paragrafo" onclick="alterarDentista('+item['IdDentista']+')"> Nº Dentista : ' + item['IdDentista'] + '| Nome : ' + item['Nome']+' </p>'
				
				texto = ' <div class="paragrafo" onclick="alterarTipoServico('+item['IdTipoServico']+')"> <b>Nº</b> : ' + item['IdTipoServico'] + '       |     <b>Tipo Serviço :</b> ' + item['Descricao']+' </div> <br>'
				
			
				
				listaTipoServico.innerHTML += texto;
			}},	
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
	
	banco.transaction(function (tx) {
	tx.executeSql(' update TTipoServico set Descricao = ? where IdTipoServico = ?', 
	[Descricao, IdTipoServico], 
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
			
			codigo.value = IdTipoServico;
			descricao.value = item['Descricao'];
		},	
		seDerErro);
	});
	
}
//TipoServico


//Lancamentos
function inserirLancamento() {
	var descricao = document.getElementById('nomePaciente');
	novoIdLancamento();
	if (descricao.value != "") {
	
		banco.transaction(function (tx) {
			var codigo    = document.getElementById('idLancamento').value;
			var descricao = document.getElementById('nomePaciente').value;
		
			tx.executeSql('insert into TLancamento (IdLancamento, Paciente) values (?,?)',
			[codigo, descricao],
			
			function (tx) {/*alert('Registro Inserido com sucesso'); mostrarDentistas()*/; 
				mostrarLancamento(); 	
				
			},
			seDerErro);
		});
		
	}
	
}

function novoIdLancamento() {
	banco.transaction(function (tx) {
		var codigo    = document.getElementById('idLancamento');
	
	    texto = 'select MAX(IdLancamento) Id from TLancamento'
	
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

function mostrarLancamento() {
	banco.transaction(function (tx) {
		tx.executeSql('select * from TLancamento ',
		[],
		function (tx, results) {
			var tamanho = results.rows.length;
			var listaLancamento = document.getElementById('listaLancamento');
			
			listaLancamento.innerHTML = "";
			novoIdLancamento();
			
			var i;
			var item = null;
			
			document.getElementById('nomePaciente').value = "";
			
						
			for(i=0; i < tamanho; i++) {
				item = results.rows.item(i);
				
				//texto = '<p> Nº Dentista : ' + item['IdDentista'] + '| Nome : ' + item['Nome']+' - <input type="button" value="Excluir" onclick="excluirDentista('+item['IdDentista']+')"> <input type="button" value="Alterar" onclick="alterarDentista('+item['IdDentista']+')"> ';
				
				//texto = '<p class="paragrafo" onclick="alterarDentista('+item['IdDentista']+')"> Nº Dentista : ' + item['IdDentista'] + '| Nome : ' + item['Nome']+' </p>'
				
				texto = ' <div class="paragrafo" onclick="alterarLancamento('+item['IdLancamento']+')"> <b>Nº</b> : ' + item['IdLancamento'] + '       |     <b>Lancamento :</b> ' + item['Paciente']+' </div> <br>'
				
			
				
				listaLancamento.innerHTML += texto;
			}},	
		seDerErro);
	});
}

function excluirLancamento() {
	var IdLancamento = document.getElementById('idLancamento').value;
	banco.transaction(function (tx) {
	tx.executeSql(' delete from TLancamento where IdLancamento = ?', 
	[IdLancamento], 
	function (tx, results) {
		mostrarLancamento();
		novoIdLancamento();
	}, 
		seDerErro);
	});
}

function atualizarLancamento() {
	var IdLancamento = document.getElementById('idLancamento').value;
	var Descricao = document.getElementById('nomePaciente').value;
	
	banco.transaction(function (tx) {
	tx.executeSql(' update TLancamento set Paciente = ? where IdLancamento = ?', 
	[Descricao, IdLancamento], 
	function (tx, results) {
		mostrarLancamento();	
	}, 
		seDerErro);
	});
}

function alterarLancamento(IdLancamento) {	
	banco.transaction(function (tx) {
		tx.executeSql('select * from TLancamento where IdLancamento = ?',
		[IdLancamento],
		function (tx, results) {
			var item = results.rows.item(0);
			
			var codigo    = document.getElementById('idLancamento');
			var descricao = document.getElementById('nomePaciente');
			
			codigo.value = IdLancamento;
			descricao.value = item['Paciente'];
		},	
		seDerErro);
	});
	
}
//Lacamento





