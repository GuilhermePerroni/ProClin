var banco; //global
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
		function (tx) {/*alert('Tabela Lancamentos Criou Certo')*/},
		seDerErro);
	});
}


function mostrarLancamento() {
	banco.transaction(function (tx) {
		
		var where = "";
		var parametros = "" ;
		
		var pIdLancamento   = document.getElementById('idLancamento').value;
		var pIdDentista     = document.getElementById('comboDentista').selectedIndex    ;
		var pIdTipoServico  = document.getElementById('comboTipoServico').selectedIndex ;
		var pIdQualidade    = document.getElementById('comboQualidade').selectedIndex   ;
		var pIdCor          = document.getElementById('comboCor').selectedIndex         ;
		var pIdEscala       = document.getElementById('comboEscala').selectedIndex      ;
		
		var pDataEntrada    = document.getElementById('dataEntrada').value;
		var pDataEntradaFim = document.getElementById('dataEntradaFim').value;
		
		var pDataEntrega     = document.getElementById('dataEntrega').value;
		var pDataEntregaFim  = document.getElementById('dataEntregaFim').value;
		
	
		
		if (document.getElementById('comboDentista').value=="") {
			pIdDentista = "";
		}
		if (document.getElementById('comboTipoServico').value=="") {
			pIdTipoServico = "";
		}
		if (document.getElementById('comboQualidade').value=="") {
			pIdQualidade = "";
		}
		if (document.getElementById('comboCor').value=="") {
			pIdCor = "";
		}
		if (document.getElementById('comboEscala').value=="") {
			pIdEscala = "";
		}
		
		
		where = " Where a.Concluido in ('S','N') ";
		
		if (document.getElementById('concluidos').checked) {
			where = " Where a.Concluido = 'S' ";	
		}
		if (document.getElementById('emAberto').checked) {
			where = " Where a.Concluido = 'N' ";
		}
		
		if (document.getElementById('emAberto').checked && document.getElementById('concluidos').checked) {
			where = " Where a.Concluido in ('S','N') ";
		}
		
		if (document.getElementById('todos').checked) {
			where = " Where a.Concluido in ('S','N') ";
		}
		
		if (document.getElementById('taPago').checked) {
				where = " Where a.Concluido = 'S' and a.ValorPago > 0 ";
		}
		
	
		
		
		if (pIdLancamento != "") {
			
			
			where = where + "  and a.IdLancamento in ( " + pIdLancamento + " ) "; 
		
			
		} else {
			
			
			if (pDataEntrada!="") {
				
				if (pDataEntrada!="" && pDataEntradaFim!="") {
					where = where + " and a.Entrada between '"  + pDataEntrada + "' and '" + pDataEntradaFim + "'";					
					
				} else {
					where = where + " and a.Entrada = '"  + pDataEntrada + "'";					
				}
			} 
			
			if (pDataEntrega!="") {
				
				if (pDataEntrega!="" && pDataEntregaFim!="") {
					where = where + " and a.Entrega  between '"  + pDataEntrega + "' and '" + pDataEntregaFim + "'";					
					
				} else {
					where = where + " and a.Entrega = '"  + pDataEntrega + "'";						
				}
				
			}
			
			
			if (pIdDentista!="") {
			    where = where + " and a.IdDentista = '"    + pIdDentista + "'";	
				
			}
			
			if (pIdTipoServico!="") {
				where = where + " and a.IdServico = '" + pIdTipoServico + "'";
				
			}
			
			if (pIdQualidade!="") {
				where = where + " and a.IdQualidade = '"   + pIdQualidade + "'";
				
			}
			
			if (pIdCor!="") {
				where = where + " and a.Cor = '"           + pIdCor + "'";
				
			}
			
			if (pIdEscala!="") {
				where = where + " and a.Escala = '"        + pIdEscala + "'";
				
			}
	
			
			
		}
		
		tx.executeSql('select a.*,  b.Nome as Dentista, c.Descricao TipoServico, d.Descricao as NCor, e.Descricao as NEscala             '+
					  'from TLancamento as a LEFT JOIN TDentista    as b on (a.IdDentista = b.IdDentista)      '+
					  '                      LEFT JOIN TTipoServico as c on (a.IdServico  = c.IdTipoServico)     '+
					  '                      LEFT JOIN TCor         as d on (a.Cor        = d.IdCor)     '+
					  '                      LEFT JOIN TEscala      as e on (a.Escala     = e.IdEscala)     '+
					  where,
					 
		[],
		function (tx, results) {
			var tamanho = results.rows.length;
			var listaLancamento = document.getElementById('listaLancamento');
			
			listaLancamento.innerHTML = "";
			
			var i;
			var item = null;
		   
		    var cabecalho = "";
			var linhas = "";
			var rodape = "";
			
			var SomaTotal = 0;
			var SomaPagoTotal = 0;
			
			
			cabecalho = ' <table class="tg">                    ' +
			            ' <tr>                                  ' + 
						'	<th class="tg-v8f3">Nº</th>         ' +
						'	<th class="tg-yxcv">Paciente</th>   ' +
						'	<th class="tg-yxcv">Dentista</th>   ' +
						'	<th class="tg-yxcv">Serviço</th>' +
						'	<th class="tg-yxcv">Cor</th>        ' +
						'	<th class="tg-yxcv">Escala</th>     ' +
						'	<th class="tg-yxcv">Entrada</th>    ' +
						'	<th class="tg-yxcv">Entrega</th>    ' +
						'	<th class="tg-yxcv">Valor</th>      ' +
						'	<th class="tg-yxcv">Valor Pago</th> ' +
						' </tr>                                 ';
			rodape = '</table>';
			
						
			for(i=0; i < tamanho; i++) {
				item = results.rows.item(i);
				
				var pv = parseFloat(item['Valor']);
				
				item['Valor'] = moeda(pv,2,'.','');
				
				var pvp = parseFloat(item['ValorPago']);
				
				item['ValorPago'] = moeda(pvp,2,'.','');
				
				item['Entrada'] = formataData(item['Entrada']); 
				item['Entrega'] = formataData(item['Entrega']); 
				
				
				linhas = linhas +
							  '<td class="tg-vhpo">' + item['IdLancamento'] +' </td>   ' +
							  '<td class="tg-timq">' + item['Paciente']    +' </td>    ' +
							  '<td class="tg-timq">' + item['Dentista']    +' </td>    ' +
							  '<td class="tg-timq">' + item['TipoServico']    +' </td> ' +
							  '<td class="tg-timq">' + item['NCor']    +' </td>        ' +
							  '<td class="tg-timq">' + item['NEscala']    +' </td>     ' +
							  '<td class="tg-timq">' + item['Entrada']    +' </td>     ' +
							  '<td class="tg-timq">' + item['Entrega']    +' </td>     ' +
							  '<td class="tg-timq">' + item['Valor']    +' </td>       ' +
							  '<td class="tg-timq">' + item['ValorPago']    +' </td>   ' +
							  '</tr>                                                    ';
	
				SomaTotal     = SomaTotal     + parseFloat(item['Valor']); 
				SomaPagoTotal = SomaPagoTotal + parseFloat(item['ValorPago']);
			}
			
			SomaTotal     = moeda(SomaTotal,2,'.','');
			SomaPagoTotal = moeda(SomaPagoTotal,2,'.','');
			
			
			linhas = linhas + '<td class="tg-vhpo"><b> Total </b> </td> ' +
							  '<td class="tg-timq"> --- </td> ' +
							  '<td class="tg-timq"> --- </td>    ' +
							  '<td class="tg-timq"> --- </td> ' +
							  '<td class="tg-timq"> --- </td>        ' +
							  '<td class="tg-timq"> --- </td>     ' +
							  '<td class="tg-timq"> --- </td>     ' +
							  '<td class="tg-timq"> --- </td>     ' +
							  '<td class="tg-timq"><b>' +SomaTotal     +'</b> </td>       ' +
							  '<td class="tg-timq"><b>' +SomaPagoTotal +'</b> </td>   ' +
							  '</tr>                                                    ';

			
			listaLancamento.innerHTML += cabecalho + linhas + rodape;
			
			},	
		seDerErro);
	});
}



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
						'<select class="select-field" size="1" id="comboDentista" name="comboDentista"> ' + 
						' <option value="">  </option> ';
	
							
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
						'<select class="select-field" size="1" id="comboTipoServico" name="comboTipoServico"> '+
						' <option value="">  </option> ';
	
							
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
						'<select class="select-field" size="1" id="comboQualidade" name="comboQualidade"> '+
						' <option value="">  </option> ';
	
							
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
						'<select class="select-field" size="1" id="comboCor" name="comboCor"> '+
						' <option value="">  </option> ';
	
							
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
						'<select class="select-field" size="1" id="comboEscala" name="comboEscala"> '+
						' <option value="">  </option> ';
	
							
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

function esconder() {
	document.getElementById('esconde').style.display = "none";
	
	document.getElementById('form-style-3').style.width = "99%";
}

function mostrar() {
	document.getElementById('esconde').style.display = "block";
	document.getElementById('form-style-3').style.width = "80%";
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