var banco; //global

var preparacao; //1 normal 2 editar/excluir

function criarAbrirBanco() {
	banco = openDatabase('ProClin','1.0','Sistema de Proteses Dentarias', 2 * 1024 * 1024);
	//status.innerHTML = 'Banco Banco Criado e Aberto';
	
	/*alert('ok, Banco Criado e Aberto!');*/
	
	criarTabelas();
	montaComboDentista();
	montaComboTipoServico();
	montaComboQualidade();
	montaComboCor();
	montaComboEscala();
}
	
function seDerErro(tx, error) {
	alert('Deu Erro: '+ error.message);			
}

function criarTabelas() {
	banco.transaction(function (tx) {
		tx.executeSql('create table if not exists TLancamento (IdLancamento int unique, IdDentista int, Paciente text, Cor int, Escala int, IdServico int, IdQualidade int, Obs text, Entrada date, Entrega date, Previsao date, Valor double, ValorPago Double, Concluido Text, LancamentoFechado)',
		[],
		function (tx) {/*alert('Tabela Lancamentos Criou Certo')*/; mostrarLancamento()},
		seDerErro);
	});
}

/*
        IdLancamento int unique, 
       IdDentista int, 
        Paciente text, 
       Cor text, 
		Escala text, 
      IdServico int, 
      IdQualidade int, 
       Obs text, 
		Entrada date, 
		Entrega date, 
		Previsao date, 
		Valor double)',*/


//Lancamentos
function inserirLancamento() {
	var descricao = document.getElementById('nomePaciente');
	novoIdLancamento();
	if (descricao.value != "") {
	
		banco.transaction(function (tx) {
			
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
		
			nomePaciente  = nomePaciente.toUpperCase();
			
			
			tx.executeSql('insert into TLancamento (IdLancamento, IdDentista, Paciente, Cor, Escala, IdServico, IdQualidade, Obs, Entrada, Entrega, Previsao, Valor, Concluido, ValorPago) values (?,?,?,?,?,?,?,?,?,?,?,?, "N", 0)',
			[IdLancamento, IdDentista, nomePaciente, IdCor, IdEscala, IdTipoServico, IdQualidade, Obs, DataEntrada, DataEntrega, DataPrevisao, Valor],
			
			
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
		//tx.executeSql('select * from TLancamento ',
		tx.executeSql('select a.*,  b.Nome as Dentista, c.Descricao TipoServico, d.Descricao as NCor, e.Descricao as NEscala             '+
					  'from TLancamento as a LEFT JOIN TDentista    as b on (a.IdDentista = b.IdDentista)      '+
					  '                      LEFT JOIN TTipoServico as c on (a.IdServico  = c.IdTipoServico)     '+
					  '                      LEFT JOIN TCor         as d on (a.Cor        = d.IdCor)     '+
					  '                      LEFT JOIN TEscala      as e on (a.Escala     = e.IdEscala)     '+
					  'where Concluido = "N"',
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
			
			cabecalho = ' <table class="tg">                    ' +
			            ' <tr>                                  ' + 
						'	<th class="tg-v8f3">Nº</th>         ' +
						'	<th class="tg-yxcv">Paciente</th>   ' +
						'	<th class="tg-yxcv">Dentista</th>   ' +
						'	<th class="tg-yxcv">TipoServico</th>' +
						'	<th class="tg-yxcv">Entrega</th>    ' +
						'	<th class="tg-yxcv">Valor</th>      ' +
						'	<th class="tg-yxcv">Exibir </th>      ' +
						'	<th class="tg-yxcv">Concluir</th>      ' +
						
						' </tr>                                 ';
			rodape = '</table>';
			
			
						
			for(i=0; i < tamanho; i++) {
				item = results.rows.item(i);
				
				if (item['Valor']=="") { item['Valor'] =0 }
				
				item['Entrega'] = formataData(item['Entrega']);
				
				var pv = parseFloat(item['Valor']);
				
				item['Valor'] = moeda(pv,2,'.','');
			
				
				linhas = linhas + '<tr onclick="alterarLancamento('+item['IdLancamento']+')" >     ' +
							  '<td class="tg-vhpo">' + item['IdLancamento'] +' </td>    ' +
							  '<td class="tg-timq">' + item['Paciente']    +' </td>    ' +
							  '<td class="tg-timq">' + item['Dentista']    +' </td>    ' +
							  '<td class="tg-timq">' + item['TipoServico']    +' </td> ' +
							  '<td class="tg-timq">' +  item['Entrega']   +' </td>     ' +
							  '<td class="tg-timq">' + item['Valor']    +' </td>       ' +
							  '<td class="tg-timq"> <a href="#abrirModal" class="modalDados" onclick="modalComDados('+item['IdLancamento']+')"> Dados </a>        </td>       ' +
							  '<td class="tg-timq"> <a href="#abrirModal" class="concluir" onclick="concluiLancamento('+item['IdLancamento']+')">Concluir</a> </td>       ' +
							  
							  '</tr>                                                              ';
				
				SomaTotal     = SomaTotal     + parseFloat(item['Valor']); 
			}
			SomaTotal     = moeda(SomaTotal,2,'.','');
			
			
			linhas = linhas + '<td class="tg-vhpo"><b> Total </b></td>    ' +
							  '<td class="tg-timq"> --- </td> ' +
							  '<td class="tg-timq"> --- </td> ' +
							  '<td class="tg-timq"> --- </td> ' +
							  '<td class="tg-timq"> --- </td> ' +
							  '<td class="tg-timq"><b> '+ SomaTotal +' </b></td> ' +
							  '<td class="tg-timq"> --- </td> ' +
							  '<td class="tg-timq"> --- </td> ' +
							  
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
	var IdTipoServico = document.getElementById('comboTipoServico').selectedIndex + 1;
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
	tx.executeSql(' update TLancamento set Paciente = ?, IdDentista = ?, IdServico = ?, IdQualidade = ?, Cor = ?, Escala = ?, Entrada = ?, Entrega = ?, Previsao = ?, Obs = ?, Valor = ?   where IdLancamento = ?', 
	[nomePaciente, IdDentista, IdTipoServico, IdQualidade, IdCor, IdEscala, DataEntrada, DataEntrega, DataPrevisao, Obs, Valor,  IdLancamento], 
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
			var IdTipoServico = document.getElementById('comboTipoServico');
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
			IdTipoServico.selectedIndex = item['IdServico']-1;
			IdQualidade.selectedIndex   = item['IdQualidade']-1;
			IdCor.selectedIndex         = item['Cor']-1;
			IdEscala.selectedIndex      = item['Escala']-1;
			DataEntrada.value           = item['Entrada'];
			DataEntrega.value           = item['Entrega'];
			DataPrevisao.value          = item['Previsao'];
			Obs.value                   = item['Obs'];
			Valor.value                 = moeda(parseFloat(item['Valor']),2,'.','');;
			
			
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
			
			listaDenstista.innerHTML = "";
			
			var corpo;
			var i;
			var item = null;
			
			cabecalho = '<label for="field1"><span>Dentista<span class="required">*</span></span>'+
						'<select class="select-field" size="1" id="comboDentista" name="comboDentista"> ';
	
							
			for(i=0; i < tamanho; i++) {
				item = results.rows.item(i);
				
				
			corpo =  corpo + ' <option value="' + item['IdDentista'] + '">' + item['Nome'] + ' </option> ';
					
			}
			
			rodape = ' </select> </label> ';
			
			listaDenstista.innerHTML += cabecalho + corpo + rodape;
			
			
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
			
			listaTipoServico.innerHTML = "";
			
			var corpo;
			var i;
			var item = null;
			
			cabecalho = '<label for="field1"><span>Tipo Ser.<span class="required">*</span></span>'+
						'<select class="select-field" size="1" id="comboTipoServico" name="comboTipoServico"> ';
	
							
			for(i=0; i < tamanho; i++) {
				item = results.rows.item(i);
				
				
			corpo =  corpo + ' <option value="' + item['IdServico'] + '">' + item['Descricao'] + ' </option> ';
					
			}
			
			rodape = ' </select> </label> ';
			
			listaTipoServico.innerHTML += cabecalho + corpo + rodape;
			
			
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
			
			listaQualidade.innerHTML = "";
			
			var corpo;
			var i;
			var item = null;
			
			cabecalho = '<label for="field1"><span>Tipo Qual.<span class="required">*</span></span>'+
						'<select class="select-field" size="1" id="comboQualidade" name="comboQualidade"> ';
	
							
			for(i=0; i < tamanho; i++) {
				item = results.rows.item(i);
				
				
			corpo =  corpo + ' <option value="' + item['IdQualidade'] + '">' + item['Descricao'] + ' </option> ';
					
			}
			
			rodape = ' </select> </label> ';
			
			listaQualidade.innerHTML += cabecalho + corpo + rodape;
			
			
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
			
			listaCor.innerHTML = "";
			
			var corpo;
			var i;
			var item = null;
			
			cabecalho = '<label for="field1"><span>Cores <span class="required">*</span></span>'+
						'<select class="select-field" size="1" id="comboCor" name="comboCor"> ';
	
							
			for(i=0; i < tamanho; i++) {
				item = results.rows.item(i);
				
				
			corpo =  corpo + ' <option value="' + item['IdCor'] + '">' + item['Descricao'] + ' </option> ';
					
			}
			
			rodape = ' </select> </label> ';
			
			listaCor.innerHTML += cabecalho + corpo + rodape;
			
			
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
