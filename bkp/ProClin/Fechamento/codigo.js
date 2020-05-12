var banco; //global

var preparacao; //1 normal 2 editar/excluir

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
		tx.executeSql('create table if not exists TLancamento (IdLancamento int unique, IdDentista int, Paciente text, Cor int, Escala int, IdServico int, IdQualidade int, Obs text, Entrada date, Entrega date, Previsao date, Valor double, ValorPago Double, Concluido Text, LancamentoFechado)',
		[],
		function (tx) {/*alert('Tabela Lancamentos Criou Certo')*/; mostrarLancamento()},
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
					  'where Concluido = "S"',
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
						'	<th class="tg-yxcv">Valor Restante</th> ' +
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
				}
				
				
				linhas = linhas + '<tr onclick="alterarLancamento('+item['IdLancamento']+')" >     ' +
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
							  '<td class="tg-timq">' +   ValorRestante +' </td>        ' +
							  '</tr>                                                    ';
				
	 			SomaTotal         = SomaTotal     + parseFloat(item['Valor']); 
				SomaPagoTotal     = SomaPagoTotal + parseFloat(item['ValorPago']);
				SomaValorRestante = SomaValorRestante + parseFloat(ValorRestante);	
			}
			SomaTotal     	  = moeda(SomaTotal,2,'.','');
			SomaPagoTotal 	  = moeda(SomaPagoTotal,2,'.','');
			SomaValorRestante = moeda(SomaValorRestante,2,'.','');
			
			linhas = linhas +
							  '<td class="tg-vhpo"><b>Total</b> </td>   ' +
							  '<td class="tg-timq">--- </td>    ' +
							  '<td class="tg-timq">--- </td>    ' +
							  '<td class="tg-timq">--- </td> ' +
							  '<td class="tg-timq">--- </td>        ' +
							  '<td class="tg-timq">--- </td>     ' +
							  '<td class="tg-timq">--- </td>     ' +
							  '<td class="tg-timq">--- </td>     ' +
							  '<td class="tg-timq"><b>' + SomaTotal         +'</b> </td>       ' +
							  '<td class="tg-timq"><b>' + SomaPagoTotal     +'</b> </td>   ' +
							  '<td class="tg-timq"><b>' + SomaValorRestante +'</b> </td>        ' +
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
	
	if (ValorPago=="") {
		ValorPago = 0;
	} else {
		ValorPago = parseFloat(ValorPago);
	}
	
	banco.transaction(function (tx) {
	tx.executeSql(' update TLancamento set ValorPago = ? where IdLancamento = ?', 
	[ValorPago, IdLancamento], 
	function (tx, results) {
		mostrarLancamento();	
	}, 
		seDerErro);
	});
}


function cancelarConclusao() {
	var IdLancamento = document.getElementById('idLancamento').value;
	
	banco.transaction(function (tx) {
	tx.executeSql(' update TLancamento set Concluido = "N" , ValorPago = "0,00" where IdLancamento = ?', 
	[IdLancamento], 
	function (tx, results) {
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
