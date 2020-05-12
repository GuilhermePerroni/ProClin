var banco; //global

var preparacao; //1 normal 2 editar/excluir

function criarAbrirBanco() {
	banco = openDatabase('ProClin','1.0','Sistema de Proteses Dentarias', 2 * 1024 * 1024);
	//status.innerHTML = 'Banco Banco Criado e Aberto';
	
	/*alert('ok, Banco Criado e Aberto!');*/
	
	criarTabelas();
	montaComboDentista();
	montaComboProtetico();
}
	
function seDerErro(tx, error) {
	alert('Deu Erro: '+ error.message);			
}

function criarTabelas() {
	banco.transaction(function (tx) {
		//tx.executeSql('drop table TLancamento ',
		tx.executeSql('create table if not exists TLancamento (IdLancamento int unique, IdDentista int, Paciente text, Cor int, Escala int, IdServico int, IdQualidade int, Obs text, Entrada date, Entrega date, Previsao date,DataPagamento date, Valor double, ValorPago Double, Concluido Text, LancamentoFechado)',
		[],
		function (tx) {/*alert('Tabela Lancamentos Criou Certo')*/; mostrarLancamento()},
		seDerErro);
	});
}


function mostrarLancamento() {
	
	var pIdDentista     = document.getElementById('comboDentista');
	var pIdProtetico     = document.getElementById('comboProtetico');
	
	if (pIdDentista==null && pIdProtetico==null) {
		
		where = ' and a.IdDentista = 1 and a.IdProtetico = 1' ;
	} else {
		
		id = pIdDentista.selectedIndex+1;
		id2 = pIdProtetico.selectedIndex+1;
		
		where = ' and a.IdDentista = ' + id + ' and a.IdProtetico = ' + id2  ;
	}
	
	
	banco.transaction(function (tx) {
		//tx.executeSql('select * from TLancamento ',
		tx.executeSql('select a.*,  b.Nome as Dentista, c.Descricao TipoServico, Pro.Nome as Protetico, d.Descricao as NCor, e.Descricao as NEscala             '+
					  'from TLancamento as a LEFT JOIN TDentista    as b on (a.IdDentista = b.IdDentista)      '+
					  '                      LEFT JOIN TTipoServico as c on (a.IdServico  = c.IdTipoServico)     '+
					  '                      LEFT JOIN TCor         as d on (a.Cor        = d.IdCor)     '+
 '                      LEFT JOIN TProtetico  as Pro on (a.IdProtetico = Pro.IdProtetico)     '+					 
					 '                      LEFT JOIN TEscala      as e on (a.Escala     = e.IdEscala)     '+
					  'where Concluido = "S" ' + where + ' order by ValorPago, IdLancamento desc' ,
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
			var SomaValorRestante = 0;
			
			cabecalho = ' <table class="bordered striped highlight">                 ' +
			            ' <tr>                                  ' + 
						'	<th class="">Nº</th>         ' +
						'	<th class="">Paciente</th>   ' +
						'	<th class="">Dentista</th>   ' +
						'	<th class="">Protetico</th>   ' +
						'	<th class="">Serviço</th>' +
						'	<th class="">Cor</th>        ' +
						'	<th class="">Escala</th>     ' +
						'	<th class="">Entrada</th>    ' +
						'	<th class="">Entrega</th>    ' +
						'	<th class="">D. Pagamento</th>    ' +
						'	<th class="">Valor</th>      ' +
						'	<th class="">Valor Pago</th> ' +
						'	<th class="">Valor Restante</th> ' +
						' </tr>                                 ';
			rodape = '</table>';
			
			
						
			for(i=0; i < tamanho; i++) {
				item = results.rows.item(i);
				
				var ValorRestante = 0;
				var Valor = 0;
				var ValorPago = 0;
				
				Valor                 = item['Valor'];
			
				ValorPago             = item['ValorPago'];
				
				ValorRestante        = parseFloat(Valor) - parseFloat(ValorPago);
				
				
			
			    item['Entrada'] = formataData(item['Entrada']); 
				item['Entrega'] = formataData(item['Entrega']); 
				item['DataPagamento'] = formataData(item['DataPagamento']); 
				
				var pvt = parseFloat(item['Valor']);
				var pvp = parseFloat(item['ValorPago']);
				
				
				
				item['Valor'] = moeda(pvt,2,'.','');
				item['ValorPago'] = moeda(pvp,2,'.','');
				ValorRestante =  moeda(ValorRestante,2,'.','');
				
				if (ValorRestante=="NaN") {
					ValorRestante= item['Valor'];				
				}
				
				if (Valor==ValorPago) {
					ValorRestante = "0.00";	
					
					linhas = linhas + '<tr class="teal lighten-3" onclick="alterarLancamento('+item['IdLancamento']+')" >     ' +
							  '<td class="">' + item['IdLancamento'] +' </td>   ' +
							  '<td class="">' + item['Paciente']    +' </td>    ' +
							  '<td class="">' + item['Dentista']    +' </td>    ' +
							  '<td class="">' + item['Protetico']    +' </td>    ' +
							  '<td class="">' + item['TipoServico']    +' </td> ' +
							  '<td class="">' + item['NCor']    +' </td>        ' +
							  '<td class="">' + item['NEscala']    +' </td>     ' +
							  '<td class="">' + item['Entrada']    +' </td>     ' +
							  '<td class="">' + item['Entrega']    +' </td>     ' +
							  '<td class="">' + item['DataPagamento']    +' </td>     ' +
							  '<td class="">' + item['Valor']    +' </td>       ' +
							  '<td class="">' + item['ValorPago']    +' </td>   ' +
							  '<td class="">' +   ValorRestante +' </td>        ' +
							  '</tr>                                                    ';
					
				} else {
					linhas = linhas + '<tr class="red lighten-4" onclick="alterarLancamento('+item['IdLancamento']+')" >     ' +
							  '<td class="">' + item['IdLancamento'] +' </td>   ' +
							  '<td class="">' + item['Paciente']    +' </td>    ' +
							  '<td class="">' + item['Dentista']    +' </td>    ' +
							  '<td class="">' + item['Protetico']    +' </td>    ' +
							  '<td class="">' + item['TipoServico']    +' </td> ' +
							  '<td class="">' + item['NCor']    +' </td>        ' +
							  '<td class="">' + item['NEscala']    +' </td>     ' +
							  '<td class="">' + item['Entrada']    +' </td>     ' +
							  '<td class="">' + item['Entrega']    +' </td>     ' +
							  '<td class="">' + item['DataPagamento']    +' </td>     ' +
							  '<td class="">' + item['Valor']    +' </td>       ' +
							  '<td class="">' + item['ValorPago']    +' </td>   ' +
							  '<td class="">' +   ValorRestante +' </td>        ' +
							  '</tr>                                                    ';
					
					
					
				}
				
				
				
							  
							  
							  
				
				
	 			SomaTotal         = SomaTotal     + parseFloat(item['Valor']); 
				SomaPagoTotal     = SomaPagoTotal + parseFloat(item['ValorPago']);
				SomaValorRestante = SomaValorRestante + parseFloat(ValorRestante);	
			}
			SomaTotal     	  = moeda(SomaTotal,2,'.','');
			SomaPagoTotal 	  = moeda(SomaPagoTotal,2,'.','');
			SomaValorRestante = moeda(SomaValorRestante,2,'.','');
			
			linhas = linhas +
							  '<td class=""><b>Total</b> </td>   ' +
							  '<td class="">--- </td>    ' +
							  '<td class="">--- </td>    ' +
							  '<td class="">--- </td> ' +
							  '<td class="">--- </td>        ' +
							  '<td class="">--- </td>     ' +
							  '<td class="">--- </td>     ' +
							  '<td class="">--- </td>     ' +
							  '<td class="">--- </td>     ' +
							  '<td class="">--- </td>     ' +
							  '<td class=""><b>' + SomaTotal         +'</b> </td>       ' +
							  '<td class=""><b>' + SomaPagoTotal     +'</b> </td>   ' +
							  '<td class=""><b>' + SomaValorRestante +'</b> </td>        ' +
							  '</tr>                                                    ';
			
			
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

function alterarLancamento(IdLancamento) {	
	banco.transaction(function (tx) {
		tx.executeSql('select * from TLancamento where IdLancamento = ?',
		[IdLancamento],
		function (tx, results) {
			var item = results.rows.item(0);
			
			var codigo    = document.getElementById('idLancamento');
			
			var IdLancamento  = document.getElementById('idLancamento');
			var Valor         = document.getElementById('valor');
			var ValorPago     = document.getElementById('valorPago');
			var ValorRestante = document.getElementById('valorRestante');
			var dataPagamento = document.getElementById('dataPagamento');
			
			
			dataPagamento.value = item['DataPagamento'];
			
			IdLancamento.value          = item['IdLancamento'];
			
			Valor.value                 = item['Valor'];
			
			ValorPago.value             = item['ValorPago'];
			
			ValorRestante.value         = parseFloat(Valor.value ) - parseFloat(ValorPago.value);
			
			if (ValorRestante.value=="NaN") {
				ValorRestante.value = item['Valor'];				
			}
			
			if (Valor.value==ValorPago.value) {
				ValorRestante.value = "0,00";				
			}
			
			
		},	
		seDerErro);
	});
	
}
//Lacamento

function pagarLancamento() {
	var IdLancamento = document.getElementById('idLancamento').value;
	var ValorPago = document.getElementById('valorPago').value;
	var dataPagamento = document.getElementById('dataPagamento').value;
	
	if (ValorPago=="") {
		ValorPago = 0;
	} else {
		ValorPago = parseFloat(ValorPago);
	}
	
	banco.transaction(function (tx) {
	tx.executeSql(' update TLancamento set ValorPago = ?, dataPagamento = ? where IdLancamento = ?', 
	[ValorPago, dataPagamento, IdLancamento], 
	function (tx, results) {
		mostrarLancamento();	
	}, 
		seDerErro);
	});
}


function cancelarConclusao() {
	var IdLancamento = document.getElementById('idLancamento').value;
	
	banco.transaction(function (tx) {
	tx.executeSql(' update TLancamento set Concluido = "N" , ValorPago = "0,00", DataPagamento = "" where IdLancamento = ?', 
	[IdLancamento], 
	function (tx, results) {
		mostrarLancamento();	
	}, 
		seDerErro);
	});
}

function formataData(data){
	//2017-06-15
	
	if (data!=null) {
	
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
	
			cabecalho = '<div class="input-field col s12">'+
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
	
			cabecalho = '<div class="input-field col s12">'+
						'<select onchange="mostrarLancamento()"  class="uppercase" id="comboProtetico" name="comboProtetico"> ';
				
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