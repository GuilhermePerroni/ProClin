var banco; //global

var preparacao; //1 normal 2 editar/excluir

var valor = 0;
var valor1 = 0;
var valor2 = 0;
var valor3 = 0;
var valor4 = 0;

function criarAbrirBanco() {
	banco = openDatabase('ProClin','1.0','Sistema de Proteses Dentarias', 2 * 1024 * 1024);
	//status.innerHTML = 'Banco Banco Criado e Aberto';
	
	/*alert('ok, Banco Criado e Aberto!');*/
	
	criarTabelas();
	montaComboDentista();
	montaComboTipoServico();
	montaComboTipoServico1();
	montaComboTipoServico2();
	montaComboTipoServico3();
	montaComboTipoServico4();
	montaComboQualidade();
	montaComboCor();
	montaComboEscala();
	montaComboProtetico();
}
	
function seDerErro(tx, error) {
	alert('Deu Erro: '+ error.message);			
}

function criarTabelas() {
	banco.transaction(function (tx) {
		//tx.executeSql('drop table TLancamento',
		tx.executeSql('create table if not exists TLancamento (IdLancamento int unique, IdDentista int,IdProtetico int,  Paciente text, DataPagamento date, Cor int, Escala int, IdServico int, IdServico1 int, IdServico2 int, IdServico3 int, IdServico4 int, IdQualidade int, Obs text, Entrada date, Entrega date, Previsao date, Valor double, ValorPago Double, Concluido Text, LancamentoFechado)',
		[],
		function (tx) {/*alert('Tabela Lancamentos Criou Certo')*/; mostrarLancamento()},
		seDerErro);
	});
}


function inserirLancamento() {
	var descricao = document.getElementById('nomePaciente');
	novoIdLancamento();
	if (descricao.value != "") {
	
		banco.transaction(function (tx) {
			
			var IdLancamento  = document.getElementById('idLancamento').value;
			var nomePaciente  = document.getElementById('nomePaciente').value;
			var IdDentista    = document.getElementById('comboDentista').selectedIndex    + 1;
			var IdTipoServico = document.getElementById('comboTipoServico').selectedIndex + 1;
			
			var IdTipoServico1 = document.getElementById('comboTipoServico1').selectedIndex + 1;
			var IdTipoServico2 = document.getElementById('comboTipoServico2').selectedIndex + 1;
			var IdTipoServico3 = document.getElementById('comboTipoServico3').selectedIndex + 1;
			var IdTipoServico4 = document.getElementById('comboTipoServico4').selectedIndex + 1;
			
			
			var IdProtetico= document.getElementById('comboProtetico').selectedIndex + 1;
			
			
			var IdQualidade   = document.getElementById('comboQualidade').selectedIndex   + 1;
			var IdCor         = document.getElementById('comboCor').selectedIndex         + 1;
			var IdEscala      = document.getElementById('comboEscala').selectedIndex         + 1;
			var DataEntrada   = document.getElementById('dataEntrada').value;
			var DataEntrega   = document.getElementById('dataEntrega').value;
			var DataPrevisao  = document.getElementById('dataPrevisao').value;
			var Obs           = document.getElementById('observacao').value;
			var Valor         = document.getElementById('valor').value;
		
			nomePaciente  = nomePaciente.toUpperCase();
			
			
			tx.executeSql('insert into TLancamento (IdLancamento, IdDentista, IdProtetico, Paciente, Cor, Escala, IdServico, IdServico1, IdServico2, IdServico3, IdServico4, IdQualidade, Obs, Entrada, Entrega, Previsao, Valor, Concluido, ValorPago) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?, "N", 0)',
			[IdLancamento, IdDentista,IdProtetico, nomePaciente, IdCor, IdEscala, IdTipoServico, IdTipoServico1, IdTipoServico2, IdTipoServico3, IdTipoServico4, IdQualidade, Obs, DataEntrada, DataEntrega, DataPrevisao, Valor],
			
			
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
	
	var pIdDentista     = document.getElementById('comboDentista');
	
	if (pIdDentista==null) {
		
		where = ' and a.IdDentista = 1' ;
	} else {
		
		id = pIdDentista.selectedIndex+1;
		
		where = ' and a.IdDentista = ' + id ;
	}
	
		
	
	banco.transaction(function (tx) {
		//tx.executeSql('select * from TLancamento ',
		tx.executeSql('select a.*,  b.Nome as Dentista, c.Descricao TipoServico, Pro.Nome as Protetico,  '+

					  '             c1.Descricao  TipoServico1,                 '+
					  '             c2.Descricao  TipoServico2,                 '+
					  '             c3.Descricao  TipoServico3,                 '+
					  '             c4.Descricao  TipoServico4,                 '+

					  
					  ' d.Descricao as NCor, e.Descricao as NEscala             '+
					  'from TLancamento as a LEFT JOIN TDentista    as b on (a.IdDentista = b.IdDentista)      '+
					  '                      LEFT JOIN TTipoServico as c on (a.IdServico  = c.IdTipoServico)     '+
					  '                      LEFT JOIN TCor         as d on (a.Cor        = d.IdCor)     '+
					  '                      LEFT JOIN TEscala      as e on (a.Escala     = e.IdEscala)     '+
					 
					   '                      LEFT JOIN TProtetico  as Pro on (a.IdProtetico = Pro.IdProtetico)     '+
					 
                      '                      LEFT JOIN TTipoServico as c1 on (a.IdServico1  = c1.IdTipoServico)     '+
					  '                      LEFT JOIN TTipoServico as c2 on (a.IdServico2  = c2.IdTipoServico)     '+
					  '                      LEFT JOIN TTipoServico as c3 on (a.IdServico3  = c3.IdTipoServico)     '+
					  '                      LEFT JOIN TTipoServico as c4 on (a.IdServico4  = c4.IdTipoServico)     '+
					 // 'where Concluido = "N" ' ,
					  'where Concluido = "N" ' + where ,
		[],
		function (tx, results) {
			var tamanho = results.rows.length;
			var listaLancamento = document.getElementById('listaLancamento');
			
			listaLancamento.innerHTML = "";
			novoIdLancamento();
			
			var i;
			var item = null;
			
			document.getElementById('nomePaciente').value = "";
			
			var cabecalho = "";
			var linhas = "";
			var rodape = "";
			
			var SomaTotal = 0;
			
			cabecalho = ' <table class="bordered striped highlight">                    ' +
			            ' <tr>                                  ' + 
						'	<th class="">Nº</th>         ' +
						'	<th class="">Paciente</th>   ' +
						'	<th class="">Dentista</th>   ' +
						'	<th class="">Protetico</th>   ' +
						'	<th class="">TipoServico</th>' +
						'	<th class="">TipoServico1</th>' +
						'	<th class="">TipoServico2</th>' +
						'	<th class="">TipoServico3</th>' +
						'	<th class="">TipoServico4</th>' +
						'	<th class="">Cor</th>' +
						'	<th class="">Escala</th>' +
						'	<th class="">Entrada</th>    ' +
						'	<th class="">Previsao</th>    ' +
						'	<th class="">Entrega</th>    ' +
						'	<th class="">Valor</th>      ' +
						'	<th class="">Fechar</th>      ' +
						
						' </tr>                                 ';
			rodape = '</table>';
			
			
						
			for(i=0; i < tamanho; i++) {
				item = results.rows.item(i);
				
				if (item['Valor']=="") { item['Valor'] =0 }
				
				item['Entrega'] = formataData(item['Entrega']);
				item['Entrada'] = formataData(item['Entrada']);
				item['Previsao'] = formataData(item['Previsao']);
				
				var pv = parseFloat(item['Valor']);
				
				item['Valor'] = moeda(pv,2,'.','');
			
				
				linhas = linhas + '<tr onclick="alterarLancamento('+item['IdLancamento']+')" >     ' +
							  '<td class="">' + item['IdLancamento'] +' </td>    ' +
							  '<td class="">' + item['Paciente']    +' </td>    ' +
							  '<td class="">' + item['Dentista']    +' </td>    ' +
							  '<td class="">' + item['Protetico']    +' </td>    ' +
							  '<td class="">' + item['TipoServico']    +' </td> ' +
							  '<td class="">' + item['TipoServico1']    +' </td> ' +
							  '<td class="">' + item['TipoServico2']    +' </td> ' +
							  '<td class="">' + item['TipoServico3']    +' </td> ' +
							  '<td class="">' + item['TipoServico4']    +' </td> ' +
							  '<td class="">' + item['NCor']    +' </td> ' +
							  '<td class="">' + item['NEscala']    +' </td> ' +
							  '<td class="">' +  item['Entrada']   +' </td>     ' +
							  '<td class="">' +  item['Previsao']   +' </td>     ' +
							  '<td class="">' +  item['Entrega']   +' </td>     ' +
							  '<td class="">' + item['Valor']    +' </td>       ' +
							   '<td class="btn" onclick="concluiLancamento('+item['IdLancamento']+')" > '+ "Concluir " + ' </td>       ' +
							  //'<td class=""> <a href="" class="" onclick="concluiLancamento('+item['IdLancamento']+')">Concluir</a> </td>       ' +
							  
							  '</tr>                                                              ';
				
				SomaTotal     = SomaTotal     + parseFloat(item['Valor']); 
			}
			SomaTotal     = moeda(SomaTotal,2,'.','');
			
			
			linhas = linhas + '<td class=""><b> Total </b></td>    ' +
							  '<td class=""> --- </td> ' +
							  '<td class=""> --- </td> ' +
							  '<td class=""> --- </td> ' +
							  '<td class=""> --- </td> ' +
							  '<td class=""> --- </td> ' +
							  '<td class=""> --- </td> ' +
							  '<td class=""> --- </td> ' +
							  '<td class=""> --- </td> ' +
							  '<td class=""> --- </td> ' +
							  '<td class=""> --- </td> ' +
							  '<td class=""> --- </td> ' +
							  '<td class=""> --- </td> ' +
							   '<td class=""> --- </td> ' +
							  '<td class=""><b> '+ SomaTotal +' </b></td> ' +
							    '<td class=""> --- </td> ' +
							  
							  '</tr> '; 
			
			listaLancamento.innerHTML += cabecalho + linhas + rodape;
			},	
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
	
	var IdLancamento  = document.getElementById('idLancamento').value;
	var nomePaciente  = document.getElementById('nomePaciente').value;
	var IdDentista    = document.getElementById('comboDentista').selectedIndex    + 1;
	var IdProtetico    = document.getElementById('comboProtetico').selectedIndex    + 1;
	var IdTipoServico = document.getElementById('comboTipoServico').selectedIndex + 1;
	
			var IdTipoServico1 = document.getElementById('comboTipoServico1').selectedIndex + 1;
			var IdTipoServico2 = document.getElementById('comboTipoServico2').selectedIndex + 1;
			var IdTipoServico3 = document.getElementById('comboTipoServico3').selectedIndex + 1;
			var IdTipoServico4 = document.getElementById('comboTipoServico4').selectedIndex + 1;
	
	var IdQualidade   = document.getElementById('comboQualidade').selectedIndex   + 1;
	var IdCor         = document.getElementById('comboCor').selectedIndex         + 1;
	var IdEscala      = document.getElementById('comboEscala').selectedIndex      + 1;
	var DataEntrada   = document.getElementById('dataEntrada').value;
	var DataEntrega   = document.getElementById('dataEntrega').value;
	var DataPrevisao  = document.getElementById('dataPrevisao').value;
	var Obs           = document.getElementById('observacao').value;
	var Valor         = document.getElementById('valor').value;
	
	nomePaciente  = nomePaciente.toUpperCase();
	
	banco.transaction(function (tx) {
	tx.executeSql(' update TLancamento set Paciente = ?, IdDentista = ?, IdProtetico = ?,IdServico = ?,IdServico1 = ?, IdServico2 = ?, IdServico3 = ?, IdServico4 = ?,IdQualidade = ?, Cor = ?, Escala = ?, Entrada = ?, Entrega = ?, Previsao = ?, Obs = ?, Valor = ?   where IdLancamento = ?', 
	[nomePaciente, IdDentista,IdProtetico, IdTipoServico, IdTipoServico1, IdTipoServico2, IdTipoServico3, IdTipoServico4, IdQualidade, IdCor, IdEscala, DataEntrada, DataEntrega, DataPrevisao, Obs, Valor,  IdLancamento], 
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
			
			var IdLancamento  = document.getElementById('idLancamento');
			var nomePaciente  = document.getElementById('nomePaciente');
			var IdDentista    = document.getElementById('comboDentista');
			var IdProtetico    = document.getElementById('comboProtetico');
			var IdTipoServico = document.getElementById('comboTipoServico');
			
			var IdTipoServico1 = document.getElementById('comboTipoServico1');
			var IdTipoServico2 = document.getElementById('comboTipoServico2');
			var IdTipoServico3 = document.getElementById('comboTipoServico3');
			var IdTipoServico4 = document.getElementById('comboTipoServico4');
			
			
			var IdQualidade   = document.getElementById('comboQualidade');
			var IdCor         = document.getElementById('comboCor');
			var IdEscala      = document.getElementById('comboEscala');
			var DataEntrada   = document.getElementById('dataEntrada');
			var DataEntrega   = document.getElementById('dataEntrega');
			var DataPrevisao  = document.getElementById('dataPrevisao');
			var Obs           = document.getElementById('observacao');
			var Valor         = document.getElementById('valor');
			
			
			IdLancamento.value          = item['IdLancamento'];
			nomePaciente.value          = item['Paciente'];
			IdDentista.selectedIndex    = item['IdDentista']-1;
			IdProtetico.selectedIndex    = item['IdProtetico']-1;
			IdTipoServico.selectedIndex = item['IdServico']-1;
			
			IdTipoServico1.selectedIndex = item['IdServico1']-1;
			IdTipoServico2.selectedIndex = item['IdServico2']-1;
			IdTipoServico3.selectedIndex = item['IdServico3']-1;
			IdTipoServico4.selectedIndex = item['IdServico4']-1;
			
			
			IdQualidade.selectedIndex   = item['IdQualidade']-1;
			IdCor.selectedIndex         = item['Cor']-1;
			IdEscala.selectedIndex      = item['Escala']-1;
			DataEntrada.value           = item['Entrada'];
			DataEntrega.value           = item['Entrega'];
			DataPrevisao.value          = item['Previsao'];
			Obs.value                   = item['Obs'];
			Valor.value                 = moeda(parseFloat(item['Valor']),2,'.','');
			
			$(document).ready(function(){
				$('select').formSelect();
			});	
			
			
		},	
		seDerErro);
	});
	
}
//Lacamento

function montaComboDentista() {
	banco.transaction(function (tx) {
		tx.executeSql('select * from TDentista ',
		[],
		function (tx, results) {
			var tamanho = results.rows.length;
			var listaDenstista = document.getElementById('listaDenstista');
			
			listaDenstista.innerHTML = " ";
			
			var corpo;
			var i;
			var item = null;
	
			cabecalho = '<div class="input-field col s3">'+
						'<select onchange="mostrarLancamento()" class="uppercase" id="comboDentista" name="comboDentista"> ';
				
			for(i=0; i < tamanho; i++) {
				item = results.rows.item(i);
					
			corpo =  corpo + ' <option value="' + item['IdDentista'] + '">' + item['Nome'] + ' </option> ';
					
			}
			rodape = ' </select>  <label for="comboDentista"> Dentista </label> </div> ';
			listaDenstista.innerHTML += cabecalho + corpo + rodape;
			
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
	
			cabecalho = '<div class="input-field col s3">'+
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

function montaComboTipoServico() {
	banco.transaction(function (tx) {
		tx.executeSql('select * from TTipoServico ',
		[],
		function (tx, results) {
			var tamanho = results.rows.length;
			var listaTipoServico = document.getElementById('listaTipoServico');
			
			listaTipoServico.innerHTML = " ";
			
			var corpo;
			var i;
			var item = null;
	
			cabecalho = '<div class="input-field col s3">'+
						'<select onchange="MontaValorServico()" class="uppercase" id="comboTipoServico" name="comboTipoServico"> ';
				
			for(i=0; i < tamanho; i++) {
				item = results.rows.item(i);
					
			corpo =  corpo + ' <option value="' + item['IdServico'] + '">' + item['Descricao'] + ' </option> ';
					
			}
			rodape = ' </select>  <label for="comboTipoServico"> Tipo Serviço </label> </div> ';
			listaTipoServico.innerHTML += cabecalho + corpo + rodape;
			
			$(document).ready(function(){
				$('select').formSelect();
			});	
			
			},	
		seDerErro);
	});
}

function MontaValorServico() {
				//monta valor 0
				var IdTipoServico  = document.getElementById('comboTipoServico').selectedIndex + 1;
				var IdTipoServico1 = document.getElementById('comboTipoServico1').selectedIndex + 1;
				var IdTipoServico2 = document.getElementById('comboTipoServico2').selectedIndex + 1;
				var IdTipoServico3 = document.getElementById('comboTipoServico3').selectedIndex + 1;
				var IdTipoServico4 = document.getElementById('comboTipoServico4').selectedIndex + 1;
				
				
				var where = "";
				valor = 0;
				where = "  where IdTipoServico in (" + IdTipoServico + "," + IdTipoServico1 + "," + IdTipoServico2 + "," + IdTipoServico3 + "," + IdTipoServico4 + ")";
				where = where;
				banco.transaction(function (tx) {
					tx.executeSql('select sum(valorPadrao) as valores from TTipoServico' + where,
					[],
					function (tx, results) {
						
						var tamanho = results.rows.length;
													
						for(i=0; i < tamanho; i++) {
							item = results.rows.item(i);
								
							valor = item['valores'];
							
							var Valor         = document.getElementById('valor');
	
							Valor.value = valor;
										
						}
						
					});
				});
	
	
	
	
}

function montaComboTipoServico1() {
	banco.transaction(function (tx) {
		tx.executeSql('select * from TTipoServico ',
		[],
		function (tx, results) {
			var tamanho = results.rows.length;
			var listaTipoServico1 = document.getElementById('listaTipoServico1');
			
			listaTipoServico1.innerHTML = " ";
			
			var corpo;
			var i;
			var item = null;
	
			cabecalho = '<div class="input-field col s3">'+
						'<select onchange="MontaValorServico()" class="uppercase" id="comboTipoServico1" name="comboTipoServico1"> ';
				
			for(i=0; i < tamanho; i++) {
				item = results.rows.item(i);
					
			corpo =  corpo + ' <option value="' + item['IdServico'] + '">' + item['Descricao'] + ' </option> ';
					
			}
			rodape = ' </select>  <label for="comboTipoServico1"> Tipo Serviço </label> </div> ';
			listaTipoServico1.innerHTML += cabecalho + corpo + rodape;
			
			$(document).ready(function(){
				$('select').formSelect();
			});	
			
			},	
		seDerErro);
	});
}

function montaComboTipoServico2() {
	banco.transaction(function (tx) {
		tx.executeSql('select * from TTipoServico ',
		[],
		function (tx, results) {
			var tamanho = results.rows.length;
			var listaTipoServico2 = document.getElementById('listaTipoServico2');
			
			listaTipoServico2.innerHTML = " ";
			
			var corpo;
			var i;
			var item = null;
	
			cabecalho = '<div class="input-field col s3">'+
						'<select onchange="MontaValorServico()" class="uppercase" id="comboTipoServico2" name="comboTipoServico2"> ';
				
			for(i=0; i < tamanho; i++) {
				item = results.rows.item(i);
					
			corpo =  corpo + ' <option value="' + item['IdServico'] + '">' + item['Descricao'] + ' </option> ';
					
			}
			rodape = ' </select>  <label for="comboTipoServico2"> Tipo Serviço </label> </div> ';
			listaTipoServico2.innerHTML += cabecalho + corpo + rodape;
			
			$(document).ready(function(){
				$('select').formSelect();
			});	
			
			},	
		seDerErro);
	});
}

function montaComboTipoServico3() {
	banco.transaction(function (tx) {
		tx.executeSql('select * from TTipoServico ',
		[],
		function (tx, results) {
			var tamanho = results.rows.length;
			var listaTipoServico3 = document.getElementById('listaTipoServico3');
			
			listaTipoServico3.innerHTML = " ";
			
			var corpo;
			var i;
			var item = null;
	
			cabecalho = '<div class="input-field col s3">'+
						'<select onchange="MontaValorServico()" class="uppercase" id="comboTipoServico3" name="comboTipoServico3"> ';
				
			for(i=0; i < tamanho; i++) {
				item = results.rows.item(i);
					
			corpo =  corpo + ' <option value="' + item['IdServico'] + '">' + item['Descricao'] + ' </option> ';
					
			}
			rodape = ' </select>  <label for="comboTipoServico3"> Tipo Serviço </label> </div> ';
			listaTipoServico3.innerHTML += cabecalho + corpo + rodape;
			
			$(document).ready(function(){
				$('select').formSelect();
			});	
			
			},	
		seDerErro);
	});
}

function montaComboTipoServico4() {
	banco.transaction(function (tx) {
		tx.executeSql('select * from TTipoServico ',
		[],
		function (tx, results) {
			var tamanho = results.rows.length;
			var listaTipoServico4 = document.getElementById('listaTipoServico4');
			
			listaTipoServico4.innerHTML = " ";
			
			var corpo;
			var i;
			var item = null;
	
			cabecalho = '<div class="input-field col s3">'+
						'<select onchange="MontaValorServico()" class="uppercase" id="comboTipoServico4" name="comboTipoServico4"> ';
				
			for(i=0; i < tamanho; i++) {
				item = results.rows.item(i);
					
			corpo =  corpo + ' <option value="' + item['IdServico'] + '">' + item['Descricao'] + ' </option> ';
					
			}
			rodape = ' </select>  <label for="comboTipoServico4"> Tipo Serviço </label> </div> ';
			listaTipoServico4.innerHTML += cabecalho + corpo + rodape;
			
			$(document).ready(function(){
				$('select').formSelect();
			});	
			
			},	
		seDerErro);
	});
}


function montaComboQualidade() {
	banco.transaction(function (tx) {
		tx.executeSql('select * from TQualidade ',
		[],
		function (tx, results) {
			var tamanho = results.rows.length;
			var listaQualidade = document.getElementById('listaQualidade');
			
			listaQualidade.innerHTML = " ";
			
			var corpo;
			var i;
			var item = null;
	
			cabecalho = '<div class="input-field col s3">'+
						'<select onchange="" class="uppercase" id="comboQualidade" name="comboQualidade"> ';
				
			for(i=0; i < tamanho; i++) {
				item = results.rows.item(i);
					
			corpo =  corpo + ' <option value="' + item['IdQualidade'] + '">' + item['Descricao'] + ' </option> ';
					
			}
			rodape = ' </select>  <label for="comboQualidade"> Tipo Serviço </label> </div> ';
			listaQualidade.innerHTML += cabecalho + corpo + rodape;
			
			$(document).ready(function(){
				$('select').formSelect();
			});	
			
			},	
		seDerErro);
	});
}

function montaComboCor() {
	banco.transaction(function (tx) {
		tx.executeSql('select * from TCor ',
		[],
		function (tx, results) {
			var tamanho = results.rows.length;
			var listaCor = document.getElementById('listaCor');
			
			listaCor.innerHTML = " ";
			
			var corpo;
			var i;
			var item = null;
	
			cabecalho = '<div class="input-field col s3">'+
						'<select onchange="" class="uppercase" id="comboCor" name="comboCor"> ';
				
			for(i=0; i < tamanho; i++) {
				item = results.rows.item(i);
					
			corpo =  corpo + ' <option value="' + item['IdCor'] + '">' + item['Descricao'] + ' </option> ';
					
			}
			rodape = ' </select>  <label for="comboCor"> Cor </label> </div> ';
			listaCor.innerHTML += cabecalho + corpo + rodape;
			
			$(document).ready(function(){
				$('select').formSelect();
			});	
			
			},	
		seDerErro);
	});
}

function montaComboEscala() {
	banco.transaction(function (tx) {
		tx.executeSql('select * from TEscala ',
		[],
		function (tx, results) {
			var tamanho = results.rows.length;
			var listaEscala = document.getElementById('listaEscala');
			
			listaEscala.innerHTML = " ";
			
			var corpo;
			var i;
			var item = null;
	
			cabecalho = '<div class="input-field col s3">'+
						'<select onchange="" class="uppercase" id="comboEscala" name="comboEscala"> ';
				
			for(i=0; i < tamanho; i++) {
				item = results.rows.item(i);
					
			corpo =  corpo + ' <option value="' + item['IdEscala'] + '">' + item['Descricao'] + ' </option> ';
					
			}
			rodape = ' </select>  <label for="comboEscala"> Escala </label> </div> ';
			listaEscala.innerHTML += cabecalho + corpo + rodape;
			
			$(document).ready(function(){
				$('select').formSelect();
			});	
			
			},	
		seDerErro);
	});
}

function montaCossmboEscala() {
	banco.transaction(function (tx) {
		tx.executeSql('select * from TEscala ',
		[],
		function (tx, results) {
			var tamanho = results.rows.length;
			var listaEscala = document.getElementById('listaEscala');
			
			listaEscala.innerHTML = "";
			
			var corpo;
			var i;
			var item = null;
			
			cabecalho = '<label for="field1"><span>Escalas <span class="required">*</span></span>'+
						'<select class="select-field" size="1" id="comboEscala" name="comboEscala"> ';
	
							
			for(i=0; i < tamanho; i++) {
				item = results.rows.item(i);
				
				
			corpo =  corpo + ' <option value="' + item['IdEscala'] + '">' + item['Descricao'] + ' </option> ';
					
			}
			
			rodape = ' </select> </label> ';
			
			listaEscala.innerHTML += cabecalho + corpo + rodape;
			
			
			},	
		seDerErro);
	});
}

function montaCombo() {
	
	var IdLancamento  = document.getElementById('idLancamento').value;
	var nomePaciente  = document.getElementById('nomePaciente').value;
	var IdDentista    = document.getElementById('comboDentista').selectedIndex    + 1;
	var IdTipoServico = document.getElementById('comboTipoServico').selectedIndex + 1;
	var IdQualidade   = document.getElementById('comboQualidade').selectedIndex   + 1;
	var IdCor         = document.getElementById('comboCor').selectedIndex         + 1;
	var IdEscala      = document.getElementById('comboEscala').selectedIndex         + 1;
	var DataEntrada   = document.getElementById('dataEntrada').value;
	var DataEntrega   = document.getElementById('dataEntrega').value;
	var DataPrevisao  = document.getElementById('dataPrevisao').value;
	var Obs           = document.getElementById('observacao').value;
	var Valor         = document.getElementById('valor').value;
	
	
	banco.transaction(function (tx) {
		tx.executeSql('select Entrada da from TLancamento ',
		[],
		function (tx, results) {
			var tamanho = results.rows.length;
			
		
			var item = null;
			
			item = results.rows.item(1);
			
			alert('item ..:' + item['da']);
			
						
			},	
		seDerErro);
	});
	
	
		banco.transaction(function (tx) {
			
		
			tx.executeSql('insert into TLancamento (IdLancamento, IdDentista, Paciente, Cor, Escala, IdServico, IdQualidade, Obs, Entrada, Entrega, Previsao, Valor ) values (?,?,?,?,?,?,?,?,?,?,?,?)',
			[IdLancamento, IdDentista, nomePaciente, IdCor, IdEscala, IdTipoServico, IdQualidade, Obs, DataEntrada, DataEntrega, DataPrevisao, Valor],
			
			function (tx) {/*alert('Registro Inserido com sucesso'); mostrarDentistas()*/; 
				mostrarLancamento(); 	
				
			},
			seDerErro);
		});
		
	

}

function modalComDados(IdLancamento){
	
   var cabecalho = "";
	var corpo = "";
	var rodape = "";
	
	var teste = document.getElementById('modalLancamento');
			
			
			
	
    cabecalho = '<div id="abrirModal" class="modalDialog">'+
                '<div>'+
				'<a class="close" title="Fechar" href="#close">X</a>'+
				'<h2>Dados Completos</h2> ';

	rodape =  '<p id="conteudo" name="conteudo" >.</p>'+
              '</div>'+
              '</div>';
	
	teste.innerHTML = cabecalho + corpo + rodape;	
	
		
	banco.transaction(function (tx) {
		tx.executeSql('select a.*,  b.Nome as Dentista, c.Descricao TipoServico, d.Descricao as NCor, e.Descricao as NEscala             '+
					  'from TLancamento as a LEFT JOIN TDentista    as b on (a.IdDentista = b.IdDentista)      '+
					  '                      LEFT JOIN TTipoServico as c on (a.IdServico  = c.IdTipoServico)     '+
					  '                      LEFT JOIN TCor         as d on (a.Cor        = d.IdCor)     '+
					  '                      LEFT JOIN TEscala      as e on (a.Escala     = e.IdEscala)     '+
					  
					  'where a.IdLancamento = ?',
		
		
		
		
		
		[IdLancamento],
		function (tx, results) {
			
			var item = results.rows.item(0);
			
			var conteudo = document.getElementById('conteudo');
			
			item['Entrada'] = formataData(item['Entrada']); 
			item['Entrega'] = formataData(item['Entrega']); 
			item['Previsao']= formataData(item['Previsao']);
			
			vlr = moeda(parseFloat(item['Valor']),2,'.','');
			
			item['Valor'] = vlr;
			
			
			conteudo.innerHTML= ' <table class="tabelamodal">           ' +
								' <tr>                                  ' + 
								'	<th class="tg-v8f3">Nº</th>         ' +
								'	<th class="tg-yxcv">Paciente</th>   ' +
								'	<th class="tg-yxcv">Dentista</th>   ' +
								'	<th class="tg-yxcv">TipoServico</th>' +
								'	<th class="tg-yxcv">Cor</th>        ' +
								'	<th class="tg-yxcv">Escala</th>      ' +
								'	<th class="tg-yxcv">Entrada</th>    ' +
								'	<th class="tg-yxcv">Entrega</th>    ' +
								'	<th class="tg-yxcv">Previsao</th>   ' +
								'	<th class="tg-yxcv">OBS</th>        ' +
								'	<th class="tg-yxcv">Valor</th>      ' +
								' </tr>                                 ' +
								
								
								'<tr>                                                     ' +
								'<td class="tg-vhpo">' 	+ item['IdLancamento'] +' </td>   ' +
								'<td class="tg-timq">' 	+ item['Paciente']    +' </td>    ' +
								'<td class="tg-timq">' 	+ item['Dentista']    +' </td>    ' +
								'<td class="tg-timq">' 	+ item['TipoServico']    +' </td> ' +
								'<td class="tg-timq">' 	+ item['NCor']    +' </td>        ' +
								'<td class="tg-timq">' 	+ item['NEscala']    +' </td>     ' +
								'<td class="tg-timq">' 	+ item['Entrada']    +' </td>     ' +
								'<td class="tg-timq">' 	+ item['Entrega']    +' </td>     ' +
								'<td class="tg-timq">' 	+ item['Previsao']    +' </td>    ' +
								'<td class="tg-timq">' 	+ item['Obs']    +' </td>         ' +
								'<td class="tg-timq">' 	+ item['Valor']    +' </td>       ' +
								'</tr>                                                    ' +
								'</table>';
			
	
			
			
			
			
			/*conteudo.innerHTML =    ' <b>Nº</b>: '         + item['IdLancamento'] +'<br>'+            
									' <b>Paciente: </b> '   + item['Paciente']     +'<br>'+  
									' <b>Dentista: </b> '   + item['Dentista']     +'<br>'+  
									' <b>Serviço: </b>  '   + item['TipoServico']  +'<br>'+  
									' <b>Cor: </b>'         + item['NCor']         +'<br>'+  
									' <b>Escala: </b> '     + item['NEscala']      +'<br>'+  
									' <b>Data Entrada: </b>'+ + item['Entrada']    + '</div>'+  
									' <b>Data Entrega: </b>'+ item['Entrega']      +'<br>'+  
									' <b>Data Previsao: </b>'+ item['Previsao']    +'<br>'+  
									' <b>Obs: </b>'          + item['Obs']         +'<br>'+  		
									' <b>Valor: </b>'        + item['Valor'];*/
					

			
			});
		
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


function concluiLancamento(IdLancamento) {
	
	banco.transaction(function (tx) {
	tx.executeSql(' update TLancamento set Concluido = "S" where IdLancamento = ?', 
	[IdLancamento], 
	function (tx, results) {
		mostrarLancamento();	
	}, 
		seDerErro);
	});
}


function moeda(valor, casas, separdor_decimal, separador_milhar){ 
 //uso moeda(1234.5,2,',','.');
 var valor_total = parseInt(valor * (Math.pow(10,casas)));
 var inteiros =  parseInt(parseInt(valor * (Math.pow(10,casas))) / parseFloat(Math.pow(10,casas)));
 var centavos = parseInt(parseInt(valor * (Math.pow(10,casas))) % parseFloat(Math.pow(10,casas)));
 
  
 if(centavos%10 == 0 && centavos+"".length<2 ){
  centavos = centavos+"0";
 }else if(centavos<10){
  centavos = "0"+centavos;
 }
  
 var milhares = parseInt(inteiros/1000);
 inteiros = inteiros % 1000; 
 
 var retorno = "";
 
 if(milhares>0){
  retorno = milhares+""+separador_milhar+""+retorno
  if(inteiros == 0){
   inteiros = "000";
  } else if(inteiros < 10){
   inteiros = "00"+inteiros; 
  } else if(inteiros < 100){
   inteiros = "0"+inteiros; 
  }
 }
  retorno += inteiros+""+separdor_decimal+""+centavos;
 
 
 return retorno;
 
}
