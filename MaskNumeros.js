/*
	Clase para enmascarar n�meros en campos de formulario.
	
	- Enmascara todos los campos num�ricos encontrados en la p�gina con la clase (class) pasada por par�metro. 
	El campo original se mantiene pero oculto y la mantiene siempre en el campo original el valor sin enmascarar.
	
	- Permite para indicar n�mero decimales la entrada tanto de punto como de coma.
	
	---------------------------------------------------
	
	Uso:
		*Instanciar el objeto en la parte final del documento o en el onload:
		
		var maskNumeros = new MaskNumeros("clase", [opciones]);					
*/

/*
Constructor
	clase			Nombre de la clase (CSS class) a escanear. Los campos con esta clase que est�n dentro de un formulario 
					se procesar�n.
					
	opciones		Opcional. JSON con las opciones que son:
					forzarDecimales: por defecto 0. Indica la cantidad de decimales que forzar� la m�scara. El valor real tendr� todos los decimales usados.
					signoMiles: por defecto '.'. Indica el s�mbolo que se usar� para representar las agrupaciones de mil.
					signoDecimal: por defecto ','. Indica el s�mbolo que se usar� para separar los decimales.
					
				Se pueden especificar opciones sueltas, es decir que no es necesario indicarlas todas. Salvo si se trata de los signos, pues poner el mismo tanto para
				decimales como para miles ser�a un error.
				
*/
MaskNumeros = function(clase, opciones) {
	//opciones por defecto
	var defaults = {
		forzarDecimales : 0,
		signoMiles : '.',
		signoDecimal : ','
	};
	//combinar las opciones por defecto con las especificadas en el constructor
	var opciones = $.extend(defaults, opciones);

	//inicializaci�n de variables privadas
	this._forzarDecimales = opciones.forzarDecimales;
	this._separadorMiles = opciones.signoMiles;
	this._separadorDecimales = opciones.signoDecimal;
	this._clase = clase;
	this._longitudActual = 0;
		
	this.aplicar();
}

//Esta funci�n es la que realiza el escaneo de los campos a enmascarar y aplica las propiedades necesarias.
//Est� a parte para poder invocarla siempre que se quiera una vez construido el objeto MaskNumeros, para casos
//en que en la misma pantalla haya cambiado el HTML y se hayan a�adido nuevos campos susceptibles de ser
//enmascarados. La funci�n ya tiene en cuenta si hay campos que ya est�n enmascarados para evitar problemas.
MaskNumeros.prototype.aplicar = function(clase) {

	if (!clase)
		clase = this._clase;

	_this = this;
	var index = 0;
	
	//var inicio = new Date();
	
	//Identificar todos los campos input con la clase "numero"
	$("input." + clase).each( function(i) {		

		//saltar campos que no tengan id
		if (this.id=='')
			return true; //esto equivale a un continue dentro del each.	
		
		//Asegurar que este campo no tenga esta funcionalidad ya aplicada		
		var check = $("#" + this.id.replace("_masked","") + "_masked").get(0);				
		if (typeof(check) != 'undefined') {			
			return true; //esto equivale a un continue dentro del each.
		}
		
				
		//crear un campo hidden y ponerle el id del campo original
		var idOriginal = this.id;
		var nameOriginal = this.name;

		//Cacheamos los objetos jquery
		var thisJQ = $(this);
		
		var valorPrevio = thisJQ.val();

		thisJQ.attr("id", idOriginal + "_masked");
		//thisJQ.attr("name", nameOriginal + "_masked");
		thisJQ.removeAttr("name"); //le quitamos el atributo name para que no se env�e con el formulario
		
		//Inyectamos en el DOM el campo oculto que conservar� el valor sin enmascarar
		thisJQ.after("<input type='hidden' value='" + valorPrevio + "' id='" + idOriginal + "' name='" + nameOriginal + "' class='_masked'/>");
	
		
		//enmascarar el valor
		thisJQ.val( _this.enmascararValor( thisJQ.val() ) );
			
			
		//EVENTOS		
		//Al enfocar el campo de m�scara se copiar� el valor real.
		thisJQ.bind("focus", { __this : _this}, _this._funcionFocus	);
			
		//Si cambia el valor del campo enmascarado, debemos copiar el valor al campo oculto y luego enmascarar este campo
		thisJQ.bind("blur", { __this : _this}, _this._funcionBlur );	
				
		//Si cambia el valor del campo enmascarado, debemos copiar el valor al campo oculto.
		//Lo hacemos a nivel de keyup para asegurar que cualer evento onchange aplicado al cambio disponga del valor correcto y actualizado.
		thisJQ.bind("keyup", { __this : _this}, _this._funcionKeyup	);		
	
	
		index++;		
	});
	/*
	if (index==0) {
		alert("Posible error de programaci�n:\nLa clase MaskNumeros no ha encontrado ning�n campo en el formulario con la clase '" + clase + "'");
	}
	*/	
	/*
	var fin = new Date();
	var elapsed = new Date();
	elapsed.setTime(fin.getTime() - inicio.getTime());
	alert("Tiempo: " + elapsed.getMilliseconds() + "ms");
	*/
}




/*
Establece el valor en el campo.
A la hora de modificar program�ticamente los campos que tienen m�scara es necesario hacerlo con esta funci�n o asegurarse que se dispara el evento
'onchange' despu�s de cambiar el valor del campo. S�lo de esta manera nos aseguramos de que el campo visible con m�scara se actualiza con el nuevo valor.
*/
MaskNumeros.prototype.setValor = function(idCampo, nuevoValor) {
	
	var idOriginal;
	var idMasked;
	
	//Nos puede venir el campo efectivo o el campo masked
	if (idCampo.indexOf("_masked") > -1) {		
		idOriginal = idCampo.replace("_masked", "");
		idMasked = idCampo;
	} else {
		idOriginal = idCampo;
		idMasked = idOriginal + "_masked";
	}
	
	$('#' + idOriginal).val(nuevoValor).change();	
	$("#" + idMasked).val( this.enmascararValor(nuevoValor) );	
}

//Devuelve el valor num�rico real de un campo con m�scara (o sin ella), cuando le pasamos por par�metro el campo enmascarado
MaskNumeros.prototype.getValor = function(idCampo) {	
	var idOriginal = idCampo.replace("_masked", "");
	return $("#" + idOriginal).val();	
}

/*
	Devuelve el objeto DOM solicitado con el id especificado, teniendo en cuenta que es un campo con m�scara.
*/
MaskNumeros.prototype.getDOM = function(idCampo) {
	return $('#' + idCampo + "_masked").get(0);
}

//Evento focus de un input con m�scara
MaskNumeros.prototype._funcionFocus = function(e) {
	var _this = e.data.__this;
	//recuperamos el ID del campo original para obtener el valor
	var idOriginal = this.id.replace("_masked", "");
	$(this).val( $("#" + idOriginal).val() );
	$(this).get(0).select();
	
	_this.longitudActual = $(this).val().length;
	
	return true;
}

//Evento blur de un input con m�scara
MaskNumeros.prototype._funcionBlur = function (e) {	
	//alert("mn_blur");
	var _this = e.data.__this;
	//Primero cambiar coma por punto si el usuario ha indicado alg�n n�mero decimal con la coma.
	var valorEfectivo = _this.cambiarComasPorPunto($(this).val());			
	var idOriginal = this.id.replace("_masked", "").replace(".", "\\.");
	$("#" + idOriginal).val( valorEfectivo );
	$(this).val( _this.enmascararValor(valorEfectivo)  );
	return true;
}

//Evento keyup de un input con m�scara.
MaskNumeros.prototype._funcionKeyup = function (e) {	
	//alert("mn_keyup");
	var _this = e.data.__this;
	var codigo = e.which ? e.which : event.keyCode; 		
		
	//Solo dejamos que escriba n�meros, '.', ',', '-', del, o intro.
	if (
			codigo == 86 ||						//v y CTRL+V
			(codigo >= 48 && codigo <= 57) || 	//n�meros
			(codigo >= 96 && codigo <= 105) ||	//n�meros tecl. num�rico
			codigo == 109 ||					//'-'
			codigo == 110 || codigo == 190 || 	//'.'
			codigo == 188 ||					//','
			codigo == 8 ||	codigo == 46 ||		//del spr
			codigo == 13  						//intro
		) {
		//Primero cambiar coma por punto si el usuario ha indicado alg�n n�mero decimal con la coma.
		var valorEfectivo = _this.cambiarComasPorPunto($(this).val());		
		var idOriginal = this.id.replace("_masked", "");
		$("#" + idOriginal).val( valorEfectivo );
		_this.longitudActual = valorEfectivo.length;
		return true;	
	} else {	
		//Miramos que no se trate de teclas como shift, ctrl, etc....
		if ( (codigo >= 65 && codigo <= 90) || (codigo >= 106 && codigo <= 111) || (codigo >= 219 && codigo <= 222) || (codigo >= 188 && codigo <= 192)) {
			//Se trata de un car�cter no v�lido. Le quitamos el �ltimo car�cter introducido.
			if ( $(this).val().length > _this.longitudActual ) { //se lo quitamos s�lo si ha insertado un caracter
				$(this).val($(this).val().substring(0,$(this).val().length - 1));				
			}
			return false;
		}
	}

}

//Enmascara un valor num�rico.
MaskNumeros.prototype.enmascararValor = function(num) {
/*
	Algoritmo: separar la cadena que representa el n�mero en 3 partes. El signo, el n�mero entero y la parte decimal. 
	Una vez separadas las partes, darle formato a la parte central, que es el n�mero entero sin ning�n separador.  
	Finalmente devolver la parte del signo + la parte central formateada + la parte decimal.
*/
	/////////////////////
	//Algoritmo
	/////////////////////
	//   -  1 0 0 0 . 0 0
	// pi | centro | pd |
	/////////////////////

	//Determina si es un n�mero
	if (isNaN(num)) {
		return num;	
	}

	//pasar el n�mero a string
	var tmp = num + '';
	
	if (tmp=='')
		return '';
	
	//quitar posible m�scara previa (No)
	//tmp = tmp.replace(/,/g,"");		
			
	if (this._forzarDecimales > 0)
		tmp = parseFloat(tmp).toFixed(this._forzarDecimales );
    tmp = tmp + '';

	var op_i = '';
	var op_d = '';
			
	var pi = tmp.indexOf("-");	
	if (pi>=0)
		op_i = '-';
	
	var pd = tmp.indexOf(".");
	if (pd>=0) {
		op_d = tmp.substr(pd + 1);
		
		//Ponemos el signo que indica decimal
		op_d = this._separadorDecimales + op_d;	
	}
	

	
		
	//Obtener parte central (n�mero entero)
	var centro = Math.abs(parseInt(tmp));
	centro += '';
	
	//Aplicar separadores de miles al numero central
	var n = 0;
	var centroF = '';
	for (var i = centro.length-1; i>=0; i--) {
		if (n%3 == 0 && n > 0) {			
			centroF = this._separadorMiles+ centroF; 
		}
		centroF = centro.charAt(i) + centroF;
		n++;
	}

	return op_i + centroF + op_d;
}

//Cambia la coma por punto en un valor num�rico, que es como javascript acepta los n�meros decimales.
//Esto permite al usuario introducir n�meros con decimales usando la coma.
MaskNumeros.prototype.cambiarComasPorPunto = function(num) {

	//pasar el n�mero a string
	var tmp = num + '';
	
	if (tmp=='')
		return '';
	
	//reemplazar la coma por punto (que es lo v�lido en javascript para representar decimales)
	tmp = tmp.replace(/,/g,".");
	
	//Quitar todos los puntos salvo el primero
	var primer_punto = tmp.indexOf(".");
	if (primer_punto != -1 && tmp.length > primer_punto) {		
		tmp = tmp.substring(0, primer_punto + 1) + tmp.substring(primer_punto + 1).replace(/\./g,"");
	}
	
	return tmp;
}


/////