var banco; //global


function seDerErro(tx, error) {
	alert('Deu Erro: '+ error.message);			
}

function criarAbrirBanco() {
    banco = openDatabase('ProGuia','1.0','Sistema Para Guia', 2 * 1024 * 1024);
	MontaHome();
	
	$(".dropdown-trigger").dropdown();
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


function MontaHome(){
	var Frame = document.getElementById('FramePrincipal');
	  
    Frame.setAttribute('src','sistema/capa/Capa.html'); 
	Frame.setAttribute('width', '100%');
	Frame.setAttribute('height','750');

}


function MontaFrameCor(){
	var Frame = document.getElementById('FramePrincipal');
	  
    Frame.setAttribute('src','sistema/cor/cor.html'); 
	Frame.setAttribute('width', '100%');
	Frame.setAttribute('height','1500');
}

function MontaFrameServico(){
	var Frame = document.getElementById('FramePrincipal');
	  
    Frame.setAttribute('src','sistema/TipoServico/cadastroTipoServico.html'); 
	Frame.setAttribute('width', '100%');
	Frame.setAttribute('height','750');

}

function MontaFrameDentista(){
	var Frame = document.getElementById('FramePrincipal');
	  
    Frame.setAttribute('src','sistema/dentista/cadastroDentista.html'); 
	Frame.setAttribute('width', '100%');
	Frame.setAttribute('height','750');

}

function MontaFrameContaPagar(){
	var Frame = document.getElementById('FramePrincipal');
	  
    Frame.setAttribute('src','sistema/ContasaPagar/cadastroContasaPagar.html'); 
	Frame.setAttribute('width', '100%');
	Frame.setAttribute('height','750');

}

function MontaFrameProtetico(){
	var Frame = document.getElementById('FramePrincipal');
	  
    Frame.setAttribute('src','sistema/Protetico/cadastroProtetico.html'); 
	Frame.setAttribute('width', '100%');
	Frame.setAttribute('height','750');

}

function MontaFrameQualidade(){
	var Frame = document.getElementById('FramePrincipal');
	  
    Frame.setAttribute('src','sistema/Qualidade/cadastroQualidade.html'); 
	Frame.setAttribute('width', '100%');
	Frame.setAttribute('height','1000');

}

function MontaFrameEscala(){
	var Frame = document.getElementById('FramePrincipal');
	  
    Frame.setAttribute('src','sistema/Escala/cadastroEscala.html'); 
	Frame.setAttribute('width', '100%');
	Frame.setAttribute('height','1000');

}

function MontaFrameFechamento(){
	var Frame = document.getElementById('FramePrincipal');
	  
    Frame.setAttribute('src','sistema/fechamento/cadastroFechamento.html'); 
	Frame.setAttribute('width', '100%');
	Frame.setAttribute('height','1500');

}


function MontaFrameLancamento(){
	var Frame = document.getElementById('FramePrincipal');
	  
    Frame.setAttribute('src','sistema/lancamento/cadastroLancamento.html'); 
	Frame.setAttribute('width', '100%');
	Frame.setAttribute('height','1500');
}



function MontaFrameRelatorioLancamentos(){
	var Frame = document.getElementById('FramePrincipal');
	  
    Frame.setAttribute('src','sistema/RelatorioLancamentos/RelatorioLancamento.html'); 
	Frame.setAttribute('width', '100%');
	Frame.setAttribute('height','1500');
}

