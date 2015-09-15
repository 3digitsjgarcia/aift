/**
* IMPORTANTE:
* 
* Requiere jQuery 1.3.1 o superior.
* Incluir antes el fichero ValidacionMensajes.js antes que Validacion.js.
* 
* 
* Validacion: clase que permite realizar la validaciÃ³n de campos de un formulario.
* 
* Requisitos de XHTML:
* Para que la clase funcione correctamente debe editarse el formulario mediante etiquetas y atributos XHTML adecuados.
* Las etiquetas necesarias para que la clase funcione correctamente son:
* - label: especifica una etiqueta de nombre para un campo. Todos los campos del formulario deben estar asociados con una etiqueta label.
* - En caso de no existir un label se tomarÃ¡ como nombre del campo el atribute 'title' del campo.
* 
* Los atributos necesarios para que la clase funcione correctamente son:
* - for: la etiqueta label debe acompaÃ±arse con el atributo for, que contiene el valor del atributo id del campo del formulario con el cual esta etiqueta estÃ¡ relacionada.
* - id: todos los elementos de formulario (input, select, textarea) deben contener el atributo id, que debe ser igual al atributo name.
* - title: en caso que no se disponga de label se tomarÃ¡ como etiqueta del campo el valor de este atributo.
* 
* Modo de uso:
* La clase necesita que se le indique de alguna manera quÃ© campos hay que validar y quÃ© tipo de validaciones hay que realizar sobre cada uno de los campos.
* Para especificar las reglas de validaciÃ³n se usarÃ¡ la nomenclatura JSON (http://json.org/).
* La sintaxis de las reglas de validaciÃ³n debe ser la siguiente:
* 		{
* 		'campoA' : [ 'validaciÃ³nA1', 'validaciÃ³nA2', ... 'validaciÃ³nAN' ],
* 		'campoB' : [ 'validaciÃ³nB1', 'validaciÃ³nB2', ... 'validaciÃ³nBN' ],
* 		...
* 		'campoZ' : [ 'validaciÃ³nZ1', 'validaciÃ³nZ2', ... 'validaciÃ³nZN' ]
* 		}
* 
* 
* Por ejemplo, una variable que contenga reglas de validaciÃ³n correctas serÃ­a la siguiente (ver cÃ³digos de validaciÃ³n mÃ¡s adelante):
* 		var campos = {
* 			'campoA' : [ 'obligatorio', 'numeroEntero' ],
* 			'campoB' : [ 'obligatorio', 'email' ]
* 		};
* 
* 
* TambiÃ©n es correcto eliminar los corchetes cuando sÃ³lo pongamos un cÃ³digo de validaciÃ³n y poner comas en lugar de corchetes, PERO se
* aconseja (por rendimiento) usar siempre corchetes, aunque sÃ³lo tenga una regla de validaciÃ³n.
* 		var campos = {
* 			'campoA' :  'obligatorio' ,
* 			'campoB' :  ['obligatorio,email']
* 		};
* 
* AdemÃ¡s, para las validaciones sobre grupos de campos y Ãºnicamente en el caso de esta validaciones grupales, 
* los campos deben indicarse separados por comas:
* 		var campos = { 
* 			'campoA,campoB' : ['obligatorio1DeN']
* 		};
* 
* 
* En lugar de usar JSON, tambiÃ©n es posible especificar las reglas de validaciÃ³n mediante el mÃ©todo setReglaDeValidacion(campo, reglaDeValidacion):
*		validacion.setReglaDeValidacion('campoA', 'numeroEntero');
* 
* SÃ³lo deben aÃ±adirse reglas de validaciÃ³n para los elementos sobre los que sea necesario hacer algÃºn tipo de validaciÃ³n.
* DespuÃ©s, se debe crear la instancia de la clase y pasarle la variable con las reglas de validaciÃ³n, ademÃ¡s del identificador del formulario a validar:
* 
* 		var validacion = new Validacion(idFormulario, campos);
* 
* Para eliminar una regla de validaciÃ³n, hay que hacerlo del siguiente modo:
* 
* 		delete validacion['nombreCampo'];
* 
* Finalmente, para lanzar la aplicaciÃ³n de las reglas de validaciÃ³n debe llamarse al mÃ©todo valida() sin enviar el formulario:
* validacion.valida();
* 
* Este 'mÃ©todo' devuelve false si ha habido algÃºn error y true en caso contrario.
* TambiÃ©n es posible ejecutar las reglas de validaciÃ³n y enviar el formulario en caso de superar todas las validaciones con el mÃ©todo validaYEnvia().
* Como es lÃ³gico, las funciones valida() y validaYEnvia() pueden usarse a travÃ©s de eventos JavaScript, como onclick o onsubmit.
* 
* Formas de incorporar la validaciÃ³n al formulario:
* 
* 		A - <input type="submit" value="Enviar" onclick="return validacion.validar()" />
* 		B - <input type="button" value="BotÃ³n" onclick="return validacion.validarYEnviar()" />
* 		C - <form action="" method="get" onsubmit="return validacion.validar()">
* 		
* 
* CÃ³digos de validaciÃ³n:
* - alfanumerico: el campo debe contener Ãºnicamente nÃºmeros o letras del alfabeto inglÃ©s. Si el campo es vacÃ­o supera la validaciÃ³n.
* - anchoMaximo N: el campo puede contener como mÃ¡ximo N carÃ¡cteres. Esta validaciÃ³n debe aplicarse a elementos textarea. Para campos input usar el atributo maxlength.
* - anchoMinimo N: el campo debe contener como mÃ­nimo N carÃ¡cteres.
* - email: el campo debe ser un e-mail. Si el campo es vacÃ­o supera la validaciÃ³n.
* - fecha: el campo debe ser una fecha (DD/MM/AAAA). Si el campo es vacÃ­o supera la validaciÃ³n.
* - filtroFecha: el campo fecha debe estar en la definiciÃ³n del filtro. El filtro se expresa en formato CRON, pero sin horas ni minutos. Se pueden usar los caracteres '*' '-' ','. Formato: 'dia mes diaSemana'.
* - hora: el campo debe ser una hora (HH:MM). Si el campo es vacÃ­o supera la validaciÃ³n.
* - mayorOIgualQue Id: el campo debe contener una valor mayor o igual que el contenido en el campo con identificador Id. Puede comparar fechas, horas y nÃºmeros tanto reales como enteros.
* - mayorQue Id: el campo debe contener un valor mayor que el contenido en el campo con identificador Id. Puede comparar fechas, horas y nÃºmeros tanto reales como enteros.
* - menorOIgualQue Id: el campo debe contener una valor menor o igual que el contenido en el campo con identificador Id. Puede comparar fechas, horas y nÃºmeros tanto reales como enteros.
* - menorQue Id: el campo debe contener un valor menor que el contenido en el campo con identificador Id. Puede comparar fechas, horas y nÃºmeros tanto reales como enteros.
* - nif: el campo debe contener un NIF (#####L, donde ##### es un numero de hasta 8 cifras y L la letra correspondiente a un NIF). Cuando se realiza la validaciÃ³n se realiza un formateo del NIF eliminando caracteres espacio, . , _ y -.
* - nie: el campo debe contener un NIE (X0#######L donde ####### es un numero de 7 dÃ­gitos y L la letra correspondiente). Cuando se realiza la validaciÃ³n se realiza un formateo del NIE eliminando caracteres espacio, . , _ y -.
* - cif: el campo debe contener un CIF.
* - pasaporte: el campo debe contener un pasaporte. En su momento se adoptÃ³ la convenciÃ³n que los pasaportes tenÃ­an que empezar con una P.
* - nifNie: el campo debe contener un NIF (#####L, donde ##### es un numero de hasta 8 cifras y L la letra correspondiente a un NIF) o un NIE (X0#######L donde ####### es un numero de 7 dÃ­gitos y L la letra correspondiente). Si el campo es vacÃ­o se supera la validaciÃ³n. Cuando se realiza la validaciÃ³n se realiza un formateo del NIF/NIE eliminando caracteres espacio, . , _ y -.
* - nifNieAviso: igual que la condiciÃ³n nifNie anterior pero en caso de no ser correcto muestra un cuadro de mensaje informando de ello y permite continuar con el valor incorrecto. Cuando se realiza la validaciÃ³n se realiza un formateo del NIF/NIE eliminando caracteres espacio, . , _ y -.
* - nifNieCif: el campo debe contener un NIF o un CIF.
* - nifNieCifAviso: igual que la condiciÃ³n nifNieCif anterior pero en caso de no ser correcto muestra un cuadro de mensaje informando de ello y permite continuar con el valor incorrecto. Cuando se realiza la validaciÃ³n se realiza un formateo del NIF/NIE eliminando caracteres espacio, . , _ y -.
* - nifNiePas: el campo debe contener un NIF, un NIE (ver apartado nifNie) o un pasaporte. Para indicar que es un pasaporte se le antepone la letra 'P' y el resto es libre. Cuando se realiza la validaciÃ³n se realiza un formateo del NIF/NIE/Pasaporte eliminando caracteres espacio, . , _ y -.
* - nifNiePasAviso: igual que la condiciÃ³n nifNiePas anterior pero en caso de no ser correcto muestra un cuadro de mensaje informando de ello y permite continuar con el valor incorrecto. Cuando se realiza la validaciÃ³n se realiza un formateo del NIF/NIE/Pasaporte eliminando caracteres espacio, . , _ y -.
* - numeroEntero: el campo debe ser un nÃºmero entero (tanto negativo como positivo). Si el campo es vacÃ­o supera la validaciÃ³n.
* - numeroReal: el campo debe ser un nÃºmero real (incluye a nÃºmeros enteros y puede ser tanto negativo como positivo). Si el campo es vacÃ­o supera la validaciÃ³n.
* - obligatorio: el campo no debe estar vacÃ­o.
* - obligatorio1DeN: al menos uno de los campos indicados debe contener algÃºn valor.
* - obligatorioRadio: algÃºn radiobutton del grupo tiene que estar marcado. El identificador que se tiene que indicar es el del primer radiobutton del grupo. Hay que tener en cuenta que todos los radiobuttons del grupo tienen que compartir el mismo atributo name.
* - tarjetaCredito: el campo debe ser una tarjeta de crÃ©dito.
* - valorMaximo N: el campo debe contener un valor numÃ©rico como mÃ¡ximo igual a N. N puede ser un valor entero o real. Si el campo es vacÃ­o, se supera la validaciÃ³n.
* - valorMinimo N: el campo debe contener un valor numÃ©rico como mÃ­nimo igual a N. N puede ser un valor entero o real. Si el campo es vacÃ­o, se supera la validaciÃ³n.
*/

/* Validaciones disponibles */
ALFANUMERICO = 'alfanumerico';
ANCHO_MAXIMO = 'anchoMaximo';
ANCHO_MINIMO = 'anchoMinimo';
EMAIL = 'email';
EXPREG = 'expReg';
FECHA = 'fecha';
HORA = 'hora';
MAYOR_O_IGUAL_QUE = 'mayorOIgualQue';
MAYOR_QUE = 'mayorQue';
MENOR_O_IGUAL_QUE = 'menorOIgualQue';
MENOR_QUE = 'menorQue';
NIF = 'nif';
NIE = 'nie';
CIF = 'cif';
FILTRO_FECHA = 'filtroFecha';
PASAPORTE = 'pasaporte';
NIFNIE = 'nifNie';
NIFNIE_AVISO = 'nifNieAviso';
NIFNIECIF = 'nifNieCif';
NIFNIECIF_AVISO = 'nifNieCifAviso';
NIFNIEPAS = 'nifNiePas';
NIFNIEPAS_AVISO = 'nifNiePasAviso';
NUMERO_ENTERO = 'numeroEntero';
NUMERO_REAL = 'numeroReal';
OBLIGATORIO = 'obligatorio';
OBLIGATORIO_1_DE_N = 'obligatorio1DeN';
OBLIGATORIO_RADIO = 'obligatorioRadio';
TARJETA_CREDITO = 'tarjetaCredito';
VALOR_MAXIMO = 'valorMaximo';
VALOR_MINIMO = 'valorMinimo';

//Aporta compatibilidad con varias validaciones en una misma pÃ¡gina.
var _valIdInterno = 0;
var __validacion = [];

/**
* Clase que permite realizar la validaciÃ³n de campos de un formulario.
* 
* @constructor
* @param {String} idFormulario Identificador del formulario a validar.
* @param {Array} reglasDeValidacion Vector con las reglas de validaciÃ³n. 
* @param {String} idioma expresado con 2 letras segÃºn locale. Debe existir una definiciÃ³n de mensajes para este idioma en ValidacionMensajes.js
* 
* @author 3digits.
*/
Validacion = function Validacion(idFormulario, reglasDeValidacion, idioma, funcAlert) {

    //Comprobar que se ha incluido el archivo de mensajes de validaciÃ³n
    if (typeof (jsnMensajesVal) === 'undefined') {
        alert("Error\nNo se encuentra el fichero de mensajes de las validaciones (ValidacionMensajes.js).");
        return null;
    }

    this._reglasDeValidacion = reglasDeValidacion;
    this._idFormulario = idFormulario;

    this._etiquetas = [];

    this._idioma = idioma.toLowerCase();
    this._idiomaPorDefecto = "en";
    
    this._funcionAlerta = funcAlert;
        
    //Verificar si existe el idioma especificado y en caso contrario poner el idioma por defecto.
    if (typeof (jsnMensajesVal[this._idioma]) === 'undefined') {
        this._idioma = this._idiomaPorDefecto;
    }


    //PUNTO DE INSERCIÃ“N DE LAS VALIDACIONES
    this._agregarValidacion(ALFANUMERICO, TipoValidacion.prototype._validarAlfanumerico);
    this._agregarValidacion(ANCHO_MINIMO, TipoValidacion.prototype._validarAnchoMinimo);
    this._agregarValidacion(ANCHO_MAXIMO, TipoValidacion.prototype._validarAnchoMaximo);
    this._agregarValidacion(EMAIL, TipoValidacion.prototype._validarEmail);
    this._agregarValidacion(EXPREG, TipoValidacion.prototype._validarExpresionRegular);
    this._agregarValidacion(FECHA, TipoValidacion.prototype._validarFecha);
    this._agregarValidacion(FILTRO_FECHA, TipoValidacion.prototype._validarFiltroFecha);
    this._agregarValidacion(HORA, TipoValidacion.prototype._validarHora);
    this._agregarValidacion(MAYOR_QUE, TipoValidacion.prototype._validarMayorQue);
    this._agregarValidacion(MAYOR_O_IGUAL_QUE, TipoValidacion.prototype._validarMayorOIgualQue);
    this._agregarValidacion(MENOR_QUE, TipoValidacion.prototype._validarMenorQue);
    this._agregarValidacion(MENOR_O_IGUAL_QUE, TipoValidacion.prototype._validarMenorOIgualQue);
    this._agregarValidacion(NIF, TipoValidacion.prototype._validarNif);
    this._agregarValidacion(NIE, TipoValidacion.prototype._validarNie);
    this._agregarValidacion(CIF, TipoValidacion.prototype._validarCif);
    this._agregarValidacion(PASAPORTE, TipoValidacion.prototype._validarPasaporte);
    this._agregarValidacion(NIFNIE, TipoValidacion.prototype._validarNifNie);
    this._agregarValidacion(NIFNIE_AVISO, TipoValidacion.prototype._validarNifNieAviso, true);
    this._agregarValidacion(NIFNIECIF, TipoValidacion.prototype._validarNifNieCif);
    this._agregarValidacion(NIFNIECIF_AVISO, TipoValidacion.prototype._validarNifNieCifAviso, true);
    this._agregarValidacion(NIFNIEPAS, TipoValidacion.prototype._validarNifNiePas);
    this._agregarValidacion(NIFNIEPAS_AVISO, TipoValidacion.prototype._validarNifNiePasAviso, true);
    this._agregarValidacion(NUMERO_ENTERO, TipoValidacion.prototype._validarNumeroEntero);
    this._agregarValidacion(NUMERO_REAL, TipoValidacion.prototype._validarNumeroReal);
    this._agregarValidacion(OBLIGATORIO, TipoValidacion.prototype._validarObligatorio);
    this._agregarValidacion(OBLIGATORIO_1_DE_N, TipoValidacion.prototype._validarObligatorio1DeN);
    this._agregarValidacion(OBLIGATORIO_RADIO, TipoValidacion.prototype._validarObligatorioRadio);
    this._agregarValidacion(TARJETA_CREDITO, TipoValidacion.prototype._validarTarjetaCredito);
    this._agregarValidacion(VALOR_MAXIMO, TipoValidacion.prototype._validarValorMaximo);
    this._agregarValidacion(VALOR_MINIMO, TipoValidacion.prototype._validarValorMinimo);

    //array global __validacion
    __validacion[_valIdInterno] = this;
    _valIdInterno++;


    //Ejecutar al cargar, obtener todas las etiquetas del formulario
    $(document).ready(
			function () {
			    //Si tenemos varios objetos de validaciÃ³n se inicializarÃ¡n todos en el onload
			    for (var val in __validacion) {
			        __validacion[val]._indexarEtiquetas();
			    }

			    /*
			    __validacion._indexarEtiquetas();
			    __validacion = null;
			    */
			}
		);

    this.comprobarCampos();

};

/**
* Verifica que todos los campos indicados en las reglas de validaciÃ³n existen.
*/
Validacion.prototype.comprobarCampos = function () {
    var errores = "";
    if (this._reglasDeValidacion) {
        for (var campoAValidar in this._reglasDeValidacion) {
            //Es posible que como id de campo tengamos una lista separada por comas
            var campos = String(campoAValidar).split(",");
            for (var iCampo in campos) {
                var campo = this._trim(campos[iCampo]);
                campo = campo.replace(/\./g, "\\.");
                if ($("#" + campo).length == 0) {
                    errores += "\nEl campo " + campo + " no se encuentra en " + this._idFormulario;
                }
            }
        }
    } else {
        alert("Error: No se ha definido ninguna regla de validación.");
    }

    if (errores.length > 0) {
        errores = "Se han encontrado los siguientes errores en la definición de la validación:" + errores;
        alert(errores);
    }
};


/**
* Valida el formulario. Devuelve true si se superan todas la validaciones y false en caso contrario.
* 
* @return  true si se superan todas la validaciones y false en caso contrario.
*/
Validacion.prototype.validar = function () {
    var validacionesCampo;


    if (this._reglasDeValidacion) {
        for (var campoAValidar in this._reglasDeValidacion) {

            validacionesCampo = this._reglasDeValidacion[campoAValidar];
            //si nos dan un array ya no es necesario construirlo separando por comas
            if (!(validacionesCampo instanceof Array)) {
                validacionesCampo = String(this._reglasDeValidacion[campoAValidar]).split(',');
            }

            for (var i in validacionesCampo) {
                try {
                    if (!validacionesCampo[i] || validacionesCampo[i] === '') {
                        throw new Error('Error de definiciÃ³ de les regles de validaciÃ³.');
                    }

                    // Se obtiene el parÃ¡metro de la validaciÃ³n si es que existe y se quita de this._validacionActual
                    this._validacionActual = this._trim(validacionesCampo[i]);
                    posEspacio = this._validacionActual.indexOf(' ');
                    parametro = null;
                    if (posEspacio !== -1) {
                        parametro = this._validacionActual.substr(posEspacio);
                        this._validacionActual = this._validacionActual.substr(0, this._validacionActual.length - parametro.length);
                        parametro = String(this._trim(parametro, ' '));
                    }

                    //Escapar puntos en el id del campo
                    var campoAValidarEscapado = campoAValidar.replace(/\./g, "\\.");

                    // Se ejecuta la validaciÃ³n actual
                    var resultado = this.tiposValidaciones[this._validacionActual].ejecutar(campoAValidarEscapado, parametro);

                    if (!resultado) {

                        //comprobar si el tipo de validaciÃ³n ya ha mostrado un aviso y en tal caso no mostrar mensaje de error
                        if (!this.tiposValidaciones[this._validacionActual]._tipoAviso)
                            this._mostrarError(campoAValidar, parametro);

                        //Marcar el campo con una clase adicional (sÃ³lo si estÃ¡ cargado jQuery)							
                        var campoADestacar = $("#" + campoAValidarEscapado);

                        //Casos especiales: campos de lista de valores AJAX, hay que enfocar el campo de texto
                        if (campoADestacar.parent() != null && campoADestacar.parent().get(0).className == 'LVbloqueBusqueda')
                            campoADestacar = $(campoADestacar.parent().children().get(0));


                        //Si tiene mÃ¡scara serÃ¡ el campo anterior
                        if (campoADestacar.is('._masked'))
                            campoADestacar = campoADestacar.prev();

                        //Destacar el label
                        $("label[for='" + campoADestacar.attr('id') + "']").addClass("errorCampo");


                        //Ver si se trata de un control kendo
                        if (typeof campoADestacar.attr("data-role") !== "undefined") {                        
                            campoADestacar = $(getKendoInputControl(campoAValidarEscapado));
                        }

                        //Marcar visualmente el error
                        campoADestacar.addClass("errorCampo");
                        
                        //Bootstrap
                        campoADestacar.parent().addClass("has-error");                        

                        //Quitar error al posicionarse en el campo la primera vez
                        campoADestacar.one("keypress", function () {
                            $(this).removeClass("errorCampo");
                            $(this).prev().removeClass("errorCampo");
                            //Bootstrap
                            $(this).parent().removeClass("has-error"); 
                        });
                        //Para el caso de los selects / checkboxes
                        campoADestacar.one("change", function () {
                            $(this).removeClass("errorCampo");
                            $(this).prev().removeClass("errorCampo");
                            //Bootstrap
                            $(this).parent().removeClass("has-error"); 
                        });

                        //Enfocar campo
                        var elemento = campoADestacar.get(0);

                        //Compatibilidad con campos con mÃ¡scara a la hora de enfocar el campo de introducciÃ³n de los datos
                        if (campoADestacar.is("._masked"))
                            elemento = campoADestacar.prev().get(0);

                        //Encerrar en un try/catch para evitar problemas IE.
                        try {
                            //Enfocar el campo que no ha superado la validaciÃ³n
                            if (elemento && elemento.type !== 'hidden') {
                                elemento.focus();
                            }
                        } catch (e) {
                        }


                        return false;

                    }
                }
                catch (e) {
                    alert(e.message); // debug						
                    throw e;
                }

            }
        }
    }
    return true;
};

/**
* Valida el formulario, y en caso de superar la validaciÃ³n, envÃ­a el formulario.
* 
* @return false si el formulario no supera la validaciÃ³n y hace un sumbit del formulario en el caso de que la supere.
*/
Validacion.prototype.validarYEnviar = function () {
    if (this.validar()) {
        if (document.getElementById(this._idFormulario)) {
            document.getElementById(this._idFormulario).submit();
        }
    }
    return false;
};

/**
* Asigna una regla de validaciÃ³n a un campo. Si el campo ya posee una regla de validaciÃ³n, la substituye.
* Para validaciones grupales, hay que especificar los campos separados por comas.
* AtenciÃ³n: para la modificaciÃ³n de validaciones grupales ya especificadas, especificad los campos en el mismo orden.
* 
* @param {String} campo Identificador del campo al que se le debe asociar la regla de validaciÃ³n. En el caso de validaciones grupales, indicad los campos separados por comas.
* @param {String} reglaDeValidacion Regla de validaciÃ³n segÃºn los cÃ³digos. Para especificar mÃ¡s de una regla, usad la separaciÃ³n por comas.
*/
Validacion.prototype.setReglaDeValidacion = function (campo, reglaDeValidacion) {
    this._reglasDeValidacion[campo] = reglaDeValidacion;
};

/**
* Modifica la etiqueta (nombre del campo) asociada a un campo. 
* La clase Validacion recoge automÃ¡ticamente las etiquetas, pero mediante este mÃ©todo es posible modificar o crear una etiqueta para un campo determinado.</p>
* 
* @param {String} campo Identificador del campo al que se le debe cambiar la etiqueta asociada.
* @param {String} etiqueta Etiqueta a asociar al campo.
*/
Validacion.prototype.setEtiqueta = function (campo, etiqueta) {
    this._etiquetas[campo] = etiqueta;
};


/**
* Enfoca el campo con id especificado aÃ±adiendole la clase(css) de error y aplica los eventos necesarios para
* deshacer esta operaciÃ³n al cambiar algÃºn dato en el campo.
*/
Validacion.enfocarCampoErroneo = function (campo) {
    var campoADestacar = $("#" + campo);

    //Marcar visualmente el error
    campoADestacar.addClass("errorCampo");
    campoADestacar.prev().addClass("errorCampo"); //tambiÃ©n al label
    
    //Bootstrap
    campoADestacar.parent().addClass("has-error");

    //Quitar error al pulsar una tecla en el campo la primera vez
    campoADestacar.one("keypress", function () {
        $(this).removeClass("errorCampo");
        $(this).prev().removeClass("errorCampo");
        
        //Bootstrap
        $(this).parent().removeClass("has-error");        
    });
    //Para el caso de los selects / checkboxes
    campoADestacar.one("change", function () {
        $(this).removeClass("errorCampo");
        $(this).prev().removeClass("errorCampo");
        //Bootstrap
        $(this).parent().removeClass("has-error");          
    });

    //Enfocar campo
    var elemento = campoADestacar.get(0);

    //Encerrar en un try/catch para evitar problemas IE.
    try {
        //Enfocar el campo que no ha superado la validaciÃ³n
        if (elemento && elemento.type !== 'hidden') {
            elemento.focus();
        }
    } catch (e) {
    }
};

/**
* Crea un vector de etiquetas para poder imprimir los mensajes de error correctamente.
* 
* @private
*/
/*
Validacion.prototype._indexarEtiquetas = function(){
var etiquetas = document.getElementsByTagName('label');
var atributoFor;
				
if (etiquetas) {
for (var i = 0; i < etiquetas.length; i++) {
atributoFor = etiquetas[i].getAttribute('htmlfor') === null ? etiquetas[i].getAttribute('for') : etiquetas[i].getAttribute('htmlfor');				
this._etiquetas[atributoFor] = etiquetas[i].innerHTML.replace(/<[^>]*>/g, '');	//replace: borra tags HTML
}
}
};
*/

Validacion.prototype._indexarEtiquetas = function () {
    var _thisValidacion = this;

    //Para cada label presente en el formulario
    $("label", "#" + this._idFormulario).each(function () {
        var idCampo = this.getAttribute('for');
        if (idCampo == null)
            idCampo = this.getAttribute('htmlfor');

        //La etiqueta se refiere a un campo
        if (idCampo != null) {
            //Primero intentamos obtener el atributo Title, si no obtenemos el texto de la etiqueta.
            var texto = $(this).attr("title");
            if (typeof (texto) === 'undefined' || texto == '')
                texto = $(this).text();

            _thisValidacion._etiquetas[idCampo] = texto.replace(/<[^>]*>/g, '');
        }

    });


    //AÃ±adir posibles campos sin label pero con title
    $("input", "#" + this._idFormulario).each(function () {
        var idCampo = this.id;
        //Si no existe etiqueta para el campo y estÃ¡ en el formulario intentamos obtener su 'title'
        if (idCampo && !_thisValidacion._etiquetas[idCampo]) {
            var titulo = $(this).attr("title");

            if (titulo) {
                _thisValidacion._etiquetas[idCampo] = titulo.replace(/<[^>]*>/g, '');
            }
        }

    });


};


// Array de tipos de validaciones disponibles
Validacion.prototype.tiposValidaciones = [];


//MÃ©todo para aÃ±adir tipos de validaciÃ³n
Validacion.prototype._agregarValidacion = function (idValidacion, funcionValidacion, esDeTipoAviso) {
    var nuevoTipoValidacion = new TipoValidacion(funcionValidacion);
    nuevoTipoValidacion._idioma = this._idioma;

    if (esDeTipoAviso)
        nuevoTipoValidacion._tipoAviso = esDeTipoAviso;

    Validacion.prototype.tiposValidaciones[idValidacion] = nuevoTipoValidacion;

};


/**
* Quita los carÃ¡racteres chars del inicio y del final del string str.
*
* @private
* @param {String} str String al que se le quiere aplicar la funcion trim.
* @param {String} chars CarÃ¡cteres que se quieren eliminar del principio y del fin del string str.
* @return {String} String modificado.
*/
Validacion.prototype._trim = function (str, chars) {
    return this._ltrim(this._rtrim(str, chars), chars);
};

/**
* Quita los carÃ¡racteres chars del inicio del string str.
*
* @private
* @param {String} str String al que se le quiere aplicar la funcion trim.
* @param {String} chars CarÃ¡cteres que se quieren eliminar del principio del string str.
* @return {String} String modificado.
*/
Validacion.prototype._ltrim = function (str, chars) {
    chars = chars || "\\s";
    return str.replace(new RegExp("^[" + chars + "]+", "g"), "");
};

/**
* Quita los carÃ¡racteres chars del final del string str.
*
* @private
* @param {String} str String al que se le quiere aplicar la funcion trim.
* @param {String} chars CarÃ¡cteres que se quieren eliminar del final del string str.
* @return {String} String modificado.
*/
Validacion.prototype._rtrim = function (str, chars) {
    chars = chars || "\\s";
    return str.replace(new RegExp("[" + chars + "]+$", "g"), "");
};

/**
* Muestra una ventana con el mensaje de error de la validaciÃ³n actual.
*
* Los comodines que se pueden utilizar en el mensaje de error son los siguientes:
*    - ${campo} que serÃ¡ sustituido por la etiqueta del campo afectado.
*    - ${campos} que serÃ¡ sustituido por la etiqueta de los campos afectados separados por coma.
*    - ${parametro} que serÃ¡ sustituido por el parÃ¡metro de la regla de validaciÃ³n.
*    - ${parametroCampo} que serÃ¡ sustituido por el valor del campo pasado por parÃ¡metro en la regla de validaciÃ³n.
*
* @private
* @param {String} campoAValidar nombre del campo afectado, o bien, nombres de los campos afectados separados por coma.
* @param {String} parametro parÃ¡metro de la regla de validaciÃ³n.  
*/
Validacion.prototype._mostrarError = function (campoAValidar, parametro) {

    //Obtenemos el mensaje de error del json de mensajes
    msj = jsnMensajesVal[this._idioma][this._validacionActual];

    //si no encuentra el mensaje de error intentamos obtenerlo en el idioma por defecto
    if (!msj) {
        msj = jsnMensajesVal[this._idiomaPorDefecto][this._validacionActual];
    }

    // Hay casos en que no se quiere mostrar ventana de error. En ese caso se define un mensaje de error vacio.
    if (msj === '') {
        return;
    }

    //SubstituciÃ³n de parÃ¡metros
    msj = msj.replace(/\$\{campo\}/, '\'' + this._etiquetas[campoAValidar] + '\'');

    if (parametro !== null) {
    	var valorParametro = "";
    	if ($.isNumeric(parametro)) {
    		valorParametro = parametro;
    	} else {
    		valorParametro = this._etiquetas[parametro];
    	}
        msj = msj.replace(/\$\{parametro\}/, valorParametro);  // en caso que el parametro sea un campo, se obtiene la etiqueta
        msj = msj.replace(/\$\{parametroCampo\}/, valorParametro);
    }

    arrayCampos = campoAValidar.replace(/ /g, '').split(',');
    var campos = '';
    if (arrayCampos.length > 1) { // si hay mÃ¡s de un campo separado por coma:
        primeraIteracion = true;
        for (var i in arrayCampos) {
            if (!primeraIteracion) {
                campos += ', ';
            }
            primeraIteracion = false;
            campos += '\'' + this._etiquetas[arrayCampos[i]] + '\'';
        }
    }
    msj = msj.replace(/\$\{campos\}/, campos);
    
    //Utilizar la funciÃ³n de alerta proporcionada en caso que estÃ© definida
    if (this._funcionAlerta)
    	this._funcionAlerta(msj);
    else
    	alert(msj);
    
};


/**************************************************************************/
/************************* TIPOS DE VALIDACIONES **************************/
/**************************************************************************/

/**
* Classe TipoValidacion.
* 
* Los comodines que se pueden utilizar en los mensajes de error son los siguientes:
*    - ${campo} que serÃ¡ sustituido por la etiqueta del campo afectado.
*    - ${campos} que serÃ¡ sustituido por la etiqueta de los campos afectados separados por coma.
*    - ${parametro} que serÃ¡ sustituido por el parÃ¡metro de la regla de validaciÃ³n.
*    - ${parametroCampo} que serÃ¡ sustituido por el valor del campo pasado por parÃ¡metro en la regla de validaciÃ³n.
*
* @constructor
* @param {function} funcionValidacion funciÃ³n que realizarÃ  la validaciÃ³n.
* @param {String} mensajeErrorEs mensaje de error en castellano que se darÃ¡ en caso que la funciÃ³n de validaciÃ³n devuelva falso.
* @param {String} mensajeErrorEs mensaje de error en catalÃ¡n que se darÃ¡ en caso que la funciÃ³n de validaciÃ³n devuelva falso.
	 
*/
TipoValidacion = function (funcionValidacion) {
    this._funcionValidacion = funcionValidacion;
    this._idioma = null;

    //determina si la validaciÃ³n no es bloqueante, es decir que muestra un aviso y es posible continuar.
    this._tipoAviso = false;
};

/**
* MÃ©todo que se tiene que llamar para ejecutar la validaciÃ³n. Tiene que ser una interficie
* comÃºn en todas las validaciones. Es decir, la funciÃ³n a la que apunta this._funcionValidacion
* siempre recibirÃ¡ el campo a validar y opcionalmente el parÃ¡metro de validaciÃ³n. 
*/
TipoValidacion.prototype.ejecutar = function (campoAValidar, parametro) {
    return this._funcionValidacion(campoAValidar, parametro);
};


/**
* Valida que el valor del campo pasado por parametro contenga nÃºmeros o letras del alfabeto inglÃ©s.
* 
* @private
* @param {String} campoAValidar Identificador del campo a validar. 
* @return true si supera la validaciÃ³n y false en caso contrario.
*/
TipoValidacion.prototype._validarAlfanumerico = function (campoAValidar) {
    //var valor = document.getElementById(campoAValidar).value;
    var valor = $("#" + campoAValidar).val();
    if (valor !== '') {
        var alfanumerico = /^[\w]{1,}$/;
        return alfanumerico.test(valor);
    }
    else {
        return true;
    }
};

/*
Validacion.prototype.tiposValidaciones[ALFANUMERICO] = new TipoValidacion (
TipoValidacion.prototype._validarAlfanumerico
);
*/

/**
* Valida que el valor del campopasado por parÃ¡metro tenga una longitud mayor que
* el valor mÃ­nimo indicado por parÃ¡metro.
*
* @private
* @param {String} campoAValidar Identificador del campo a validar.
* @param {String} longMinima longitud mÃ­nima que puede tener el valor del campo. 
* @return true si supera la validaciÃ³n y false en caso contrario.
*/
TipoValidacion.prototype._validarAnchoMinimo = function (campoAValidar, longMinima) {
    //var valor = document.getElementById(campoAValidar).value;
    var valor = $("#" + campoAValidar).val();
    return this._validarComparacion(valor.length.toString(), longMinima, '>=');
};

/*
Validacion.prototype.tiposValidaciones[ANCHO_MINIMO] = new TipoValidacion (
TipoValidacion.prototype._validarAnchoMinimo
);
*/

/**
* Valida que el valor del campo pasado por parÃ¡metro tenga una longitud menor que
* el valor mÃ¡ximo indicado por parÃ¡metro.
*
* @private
* @param {String} campoAValidar Identificador del campo a validar.
* @param {String} longMaxima longitud mÃ¡xima que puede tener el valor del campo. 
* @return true si supera la validaciÃ³n y false en caso contrario.
*/
TipoValidacion.prototype._validarAnchoMaximo = function (campoAValidar, longMaxima) {
    //valor = document.getElementById(campoAValidar).value;
    var valor = $("#" + campoAValidar).val();

    var ancho = valor.length;

    //Contar saltos de lÃ­nea, pues cuentan como 2 caracteres
    try {
        i = valor.match(/[^\n]*\n[^\n]*/gi).length;
    } catch (e) {
        i = 0;
    }

    ancho += i;

    return this._validarComparacion(ancho.toString(), longMaxima, '<=');
};

/*
Validacion.prototype.tiposValidaciones[ANCHO_MAXIMO] = new TipoValidacion (
TipoValidacion.prototype._validarAnchoMaximo
);
*/

/**
* Valida que el valor del campo pasado por parÃ¡metro sea un e-mail.
* 
* @private
* @param {String} campoAValidar Identificador del campo a validar.
* @return true si supera la validaciÃ³n y false en caso contrario.
*/
TipoValidacion.prototype._validarEmail = function (campoAValidar) {
    //var valor = document.getElementById(campoAValidar).value;
    var valor = $("#" + campoAValidar).val();
    if (valor !== '') {
        var email = /^[\w-\.]{1,}\@([\da-zA-Z-]{1,}\.){1,}[\da-zA-Z-]{2,}$/;
        return email.test(valor);
    }
    else { // si el campo estÃ¡ vacio devolvemos cierto
        return true;
    }
};

/**
* Valida que la fecha del campo pasado por parÃ¡metro se ajuste al filtro CRON expresado por parÃ¡metro.
* 
* @private
* @param {String} campoAValidar Identificador del campo a validar.
* @param {String} parametro Identificador del campo especificado en la regla de validaciÃ³n.
* @return true si supera la validaciÃ³n y false en caso contrario.
*/
TipoValidacion.prototype._validarExpresionRegular = function (campoAValidar, parametro) {
    var valor = $("#" + campoAValidar).val();

    if (valor !== '' && parametro !== '') {
        var re = new RegExp(parametro);
        return re.test(valor);
    } else {
        return true;
    }
};

/*
Validacion.prototype.tiposValidaciones[EMAIL] = new TipoValidacion (
TipoValidacion.prototype._validarEmail
);
*/

/**
* Valida que el valor del campo pasado por parÃ¡metro sea una fecha.
* 
* @private
* @param {String} campoAValidar Identificador del campo a validar.
* @return true si supera la validaciÃ³n y false en caso contrario.
*/
TipoValidacion.prototype._validarFecha = function (campoAValidar) {
    //return this._esFecha(document.getElementById(campoAValidar).value);
    var valor = $("#" + campoAValidar).val();
    return this._esFecha(valor);
};

/*
Validacion.prototype.tiposValidaciones[FECHA] = new TipoValidacion (
TipoValidacion.prototype._validarFecha
);
*/


/**
* Valida que la fecha del campo pasado por parÃ¡metro se ajuste al filtro CRON expresado por parÃ¡metro.
* 
* @private
* @param {String} campoAValidar Identificador del campo a validar.
* @param {String} parametro Identificador del campo especificado en la regla de validaciÃ³n.
* @return true si supera la validaciÃ³n y false en caso contrario.
*/
TipoValidacion.prototype._validarFiltroFecha = function (campoAValidar, parametro) {
    var valor = $("#" + campoAValidar).val();

    if (valor !== '' && parametro !== '') {
        var fecha = this._obtenerFecha(valor);
        return this._checkCron(fecha, parametro);
    } else {
        return true;
    }
};

/*
Validacion.prototype.tiposValidaciones[FILTRO_FECHA] = new TipoValidacion (
TipoValidacion.prototype._validarFiltroFecha
);
*/


/**
* Valida que el valor del campo pasado por parÃ¡metro sea una hora.
* 
* @private
* @param {String} campoAValidar Identificador del campo a validar.
* @return true si supera la validaciÃ³n y false en caso contrario.
*/
TipoValidacion.prototype._validarHora = function (campoAValidar) {
    var valor = $("#" + campoAValidar).val();

    if (valor !== '') {
        return this._esHora(valor);
    } else {
        return true;
    }
};

/*
Validacion.prototype.tiposValidaciones[HORA] = new TipoValidacion (
TipoValidacion.prototype._validarHora
);
*/

/**
* Valida que el valor del campo pasado por parÃ¡metro sea mayor que el valor del campo 
* especificado en la regla de validaciÃ³n.
* 
* @private
* @param {String} campoAValidar Identificador del campo a validar.
* @param {String} parametro Identificador del campo especificado en la regla de validaciÃ³n.
* @return true si supera la validaciÃ³n y false en caso contrario.
*/
TipoValidacion.prototype._validarMayorQue = function (campoAValidar, parametro) {
    //var valor = document.getElementById(campoAValidar).value;
    var valor = $("#" + campoAValidar).val();
    //parametro = document.getElementById(parametro).value;
    
    var valorParametro = "";
    if ($.isNumeric(parametro)) {
    	valorParametro = parametro;
    } else {
    	valorParametro = $("#" + parametro).val();
    }
        
    if (valor !== '' && parametro !== '') {
        return this._validarComparacion(valor, valorParametro, '>');
    } else {
        return true;
    }
};


/**
* Valida que el valor del campo pasado por parÃ¡metro sea mayor o igual que el valor del campo 
* especificado en la regla de validaciÃ³n.
* 
* @private
* @param {String}campoAValidar Identificador del campo a validar.
* @param {String} parametro Identificador del campo especificado en la regla de validaciÃ³n.
* @return true si supera la validaciÃ³n y false en caso contrario.
*/
TipoValidacion.prototype._validarMayorOIgualQue = function (campoAValidar, parametro) {
    //var valor = document.getElementById(campoAValidar).value;
    var valor = $("#" + campoAValidar).val();

    var valorParametro = "";
    if ($.isNumeric(parametro)) {
    	valorParametro = parametro;
    } else {
    	valorParametro = $("#" + parametro).val();
    }
    //var valorParametro = parametro;
    if (valor !== '' && valorParametro !== '') {
        return this._validarComparacion(valor, valorParametro, '>=');
    } else {
        return true;
    }
};

/**
* Valida que el valor del campo pasado por parÃ¡metro sea menor que el valor del campo 
* especificado en la regla de validaciÃ³n.
* 
* @private
* @param {String} campoAValidar Identificador del campo a validar.
* @param {String} parametro Identificador del campo especificado en la regla de validaciÃ³n.
* @return true si supera la validaciÃ³n y false en caso contrario.
*/
TipoValidacion.prototype._validarMenorQue = function (campoAValidar, parametro) {

    var valor = $("#" + campoAValidar).val();
    
    var valorParametro = "";
    if ($.isNumeric(parametro)) {
    	valorParametro = parametro;
    } else {
    	valorParametro = $("#" + parametro).val();
    }
    
    if (valor !== '' && parametro !== '') {
        return this._validarComparacion(valor, valorParametro, '<');
    } else {
        return true;
    }
};


/**
* Valida que el valor del campo pasado por parÃ¡metro sea menor o igual que el valor del campo 
* especificado en la regla de validaciÃ³n.
* 
* @private
* @param {String}campoAValidar Identificador del campo a validar.
* @param {String} parametro Identificador del campo especificado en la regla de validaciÃ³n.
* @return true si supera la validaciÃ³n y false en caso contrario.
*/
TipoValidacion.prototype._validarMenorOIgualQue = function (campoAValidar, parametro) {

    var valor = $("#" + campoAValidar).val();
    
    var valorParametro = "";
    if ($.isNumeric(parametro)) {
    	valorParametro = parametro;
    } else {
    	valorParametro = $("#" + parametro).val();
    }
    
    if (valor !== '' && valorParametro !== '') {
        return this._validarComparacion(valor, valorParametro, '<=');
    } else {
        return true;
    }
};


/**
* Valida que el valor del campo pasado por parÃ¡metro corresponda a un NIF (nÃºmero + letra y letra correcta).
* 
* @private
* @param {String} campoAValidar String con el identificador del campo a validar.
* @return true si supera la validaciÃ³n y false en caso contrario.
*/
TipoValidacion.prototype._validarNif = function (campoAValidar) {
    if (!$("#" + campoAValidar)) {
        throw new Error('Error de programaciÃ³. No s\'ha trobat el camp amb l\'identificador \'' + campoAValidar + '\'');
    }
    var numero;
    //var nif = document.getElementById(campoAValidar).value;
    var nif = $("#" + campoAValidar).val();
    nif = this._reformatearNifNie(nif);
    if (nif === '') {
        //document.getElementById(campoAValidar).value = nif; // asÃ­ haremos el submit con el nif/nie formateado
        $("#" + campoAValidar).val(nif);
        return true;
    }

    var primerCaracter = nif.substring(0, 1);

    var nifEspecial = 'KLM'; // K -> EspaÃ±oles menores de 14 aÃ±os
    // L -> EspaÃ±oles residentes en el extranjero sin DNI
    // M -> NIF que otorga la Agencia Tributaria a extranjeros que no tienen NIE
    var esNifEspecial = false;
    if (nifEspecial.indexOf(primerCaracter) >= 0) {
        numero = nif.substring(1, nif.length - 1);
        esNifEspecial = true;
    } else {
        numero = nif.substring(0, nif.length - 1);
    }

    if (!numero.match(/^\d+$/)) {
        return false;
    }
    var letra = nif.substring(nif.length - 1).toUpperCase();
    // Forcem el radix a 10 per que sino javascript interpreta els numeros que
    // comencen amb 0 com octals.

    if (!esNifEspecial) {
        if (letra != 'TRWAGMYFPDXBNJZSQVHLCKE'.substr(parseInt(numero, 10) % 23, 1)) {
            return false;
        }
        else {
            //document.getElementById(campoAValidar).value = nif; 
            $("#" + campoAValidar).val(nif); // asÃ­ haremos el submit con el nif/nie formateado
            return true;
        }
    }
    else {
        return this._validarCif(campoAValidar); // Si el NIF Ã©s especial se valida como un CIF
    }
};

/*
Validacion.prototype.tiposValidaciones[NIF] = new TipoValidacion (
TipoValidacion.prototype._validarNif
);
*/

/**
* Valida que el valor del campo pasado por parÃ¡metro corresponda a un NIE (X + numero + letra y letra correcta).
* 
* @private
* @param {String} campoAValidar String con el identificador del campo a validar.
* @return true si supera la validaciÃ³n y false en caso contrario.
*/
TipoValidacion.prototype._validarNie = function (campoAValidar) {

    if (!$("#" + campoAValidar)) {
        throw new Error('Error de programaciÃ³. No s\'ha trobat el camp amb l\'identificador \'' + campoAValidar + '\'');
    }
    var numero;
    var nletra;
    //var nie = document.getElementById(campoAValidar).value;
    var nie = $("#" + campoAValidar).val();
    nie = this._reformatearNifNie(nie);
    if (nie === '') {
        //document.getElementById(campoAValidar).value = nie; // asÃ­ haremos el submit con el nif/nie formateado
        $("#" + campoAValidar).val(nie);
        return true;
    }
    // Como mÃ­nimo 3 carÃ¡cteres: X<nÃºmero><letra>
    if (nie.length < 3) {
        return false;
    }


    //El nuevo NIE admite X, Y o Z
    if (nie.substring(0, 1).toUpperCase() == 'X') {
        nletra = "0";
    } else if (nie.substring(0, 1).toUpperCase() == 'Y') {
        nletra = "1";
    } else if (nie.substring(0, 1).toUpperCase() == 'Z') {
        nletra = "2";
    } else {
        return false;
    }


    /*
    if(nie.substring(0,1).toUpperCase() !== 'X') {
    // El NIE tiene 10 caracteres. Permetem NIEs de qualsevol longitud.
    // (3 minim, la X, el numero i la lletra.
    return false;
    }
    */

    //Agregar el nÃºmero calculado segÃºn la letra al principio del nÃºmero grande.
    //numero = String.concat(nletra, nie.substring(1, nie.length - 1));
    numero = nletra + "" + nie.substring(1, nie.length - 1);

    if (!numero.match(/^\d+$/)) {
        return false;
    }

    var letra = nie.substring(nie.length - 1).toUpperCase();
    // Forcem el radix a 10 per que sino javascript interpreta els numeros que
    // copmencen amb 0 com octals.
    if (letra != 'TRWAGMYFPDXBNJZSQVHLCKE'.substr(parseInt(numero, 10) % 23, 1)) {
        return false;
    }

    //document.getElementById(campoAValidar).value = nie; // asÃ­ haremos el submit con el nif/nie formateado
    $("#" + campoAValidar).val(nie);
    return true;
};

/*
Validacion.prototype.tiposValidaciones[NIE] = new TipoValidacion (
TipoValidacion.prototype._validarNie
);
*/

/**
* Determina si un CIF es vÃ¡lido.
* 
* @private
* @param {Object} cif String con el CIF a validar.
* @return true si supera la validaciÃ³n y false en caso contrario.
*/
TipoValidacion.prototype._validarCif = function (campoAValidar) {
    if (!$("#" + campoAValidar)) {
        throw new Error('Error de programaciÃ³. No s\'ha trobat el camp amb l\'identificador \'' + campoAValidar + '\'');
    }

    var pares = 0;
    var impares = 0;
    var suma;
    var ultima;
    var unumero;
    var uletra = ['J', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
    var xxx;

    //var cif = document.getElementById(campoAValidar).value;
    var cif = $("#" + campoAValidar).val();

    if (cif === '') {
        return true;
    }

    cif = cif.toUpperCase();
    var regular = new RegExp(/^[ABCDEFGHJKLMNPQRSUVW]\d\d\d\d\d\d\d[0-9,A-J]$/g);
    if (!regular.exec(cif)) {
        return false;
    }

    ultima = cif.substr(8, 1);

    for (var cont = 1; cont < 7; cont++) {
        xxx = (2 * parseInt(cif.substr(cont++, 1), 10)).toString() + '0';
        impares += parseInt(xxx.substr(0, 1), 10) + parseInt(xxx.substr(1, 1), 10);
        pares += parseInt(cif.substr(cont, 1), 10);
    }
    xxx = (2 * parseInt(cif.substr(cont, 1), 10)).toString() + '0';
    impares += parseInt(xxx.substr(0, 1), 10) + parseInt(xxx.substr(1, 1), 10);

    suma = (pares + impares).toString();
    unumero = parseInt(suma.substr(suma.length - 1, 1), 10);
    unumero = (10 - unumero).toString();
    if (unumero == 10) {
        unumero = 0;
    }

    primeraLetra = cif.substr(0, 1);

    var controlNumero = 'ABEH'; // Si el primer carÃ¡cter del NIF Ã©s A, B, E o H entonces el dÃ­gito de control serÃ¡ un nÃºmero
    var controlLetra = 'KPQS';  // Si el primer carÃ¡cter del NIF Ã©s K, P, Q o S entonces el dÃ­gito de control serÃ¡ una letra
    // Para los demÃ¡s carÃ¡cteres el dÃ­gito de control puede ser tanto un nÃºmero como una letra
    if (controlNumero.indexOf(primeraLetra) >= 0) {
        return ultima == unumero;
    } else if (controlLetra.indexOf(primeraLetra) >= 0) {
        return ultima == uletra[unumero];
    } else {
        return ultima == unumero || ultima == uletra[unumero];
    }

};

/*
Validacion.prototype.tiposValidaciones[CIF] = new TipoValidacion (
TipoValidacion.prototype._validarCif
);
*/

/**
* Valida que el valor del campo pasado por parÃ¡metro sea un pasaporte correctamente formado.
* 
* @private
* @param {String} campoAValidar String con el identificador del campo a validar.
* @return true si supera la validaciÃ³n y false en caso contrario.
*/
TipoValidacion.prototype._validarPasaporte = function (campoAValidar) {
    if (!$("#" + campoAValidar)) {
        throw new Error('Error de programaciÃ³. No s\'ha trobat el camp amb l\'identificador \'' + campoAValidar + '\'');
    }
    //var pas = document.getElementById(campoAValidar).value;
    var pas = $("#" + campoAValidar).val();
    pas = this._reformatearNifNiePas(pas);
    if (pas === '') {
        //document.getElementById(campoAValidar).value = pas; // asÃ­ haremos el submit con el nif/nie/pasaporte formateado
        $("#" + campoAValidar).val(pas);
        return true;
    }
    pas = pas.toUpperCase();
    if (pas.substring(0, 1) == "P") {
        // Es un pasaport, no fem cap validaciÃ³.
        //document.getElementById(campoAValidar).value = pas; // asÃ­ haremos el submit con el nif/nie/pasaporte formateado
        $("#" + campoAValidar).val(pas);
        return true;
    } else {
        return false;
    }
};

/*
Validacion.prototype.tiposValidaciones[PASAPORTE] = new TipoValidacion (
TipoValidacion.prototype._validarPasaporte
);
*/

/**
* Valida que el valor del campo pasado por parÃ¡metro corresponda a un NIF (nÃºmero + letra y letra correcta) o un NIE (X + numero + letra y letra correcta).
* 
* @private
* @param {String} campoAValidar String con el identificador del campo a validar.
* @return true si supera la validaciÃ³n y false en caso contrario.
*/
TipoValidacion.prototype._validarNifNie = function (campoAValidar) {
    if (this._validarNif(campoAValidar)) {
        return true;
    } else if (this._validarNie(campoAValidar)) {
        return true;
    } else {
        return false;
    }
};

/*
Validacion.prototype.tiposValidaciones[NIFNIE] = new TipoValidacion (
TipoValidacion.prototype._validarNifNie
);
*/

/**
* Valida que el valor del campo pasado por parÃ¡metro corresponda a un NIF (nÃºmero + letra y letra correcta) o un NIE (X + numero + letra y letra correcta), 
* y consulta al usuario si desea igualmente usar este valor aunque no estÃ© bien formado.
* 
* @private
* @param {String} campoAValidar String con el identificador del campo a validar.
* @return true si supera la validaciÃ³n y false en caso contrario.
*/
TipoValidacion.prototype._validarNifNieAviso = function (campoAValidar) {
    if (!this._validarNifNie(campoAValidar)) {
        var mensaje = jsnMensajesVal[this._idioma][NIFNIE_AVISO];

        return confirm(mensaje);
    } else {
        return true;
    }
};

/*
Validacion.prototype.tiposValidaciones[NIFNIE_AVISO] = new TipoValidacion (
TipoValidacion.prototype._validarNifNieAviso
);
*/

/**
* Valida que el valor del campo pasado por parÃ¡metro sea un NIF, NIE o CIF correctamente formado.
* 
* @private
* @param {String} campoAValidar String con el identificador del campo a validar.
* @return true si supera la validaciÃ³n y false en caso contrario.
*/
TipoValidacion.prototype._validarNifNieCif = function (campoAValidar) {
    if (this._validarNif(campoAValidar)) {
        return true;
    } else if (this._validarNie(campoAValidar)) {
        return true;
    } else if (this._validarCif(campoAValidar)) {
        return true;
    } else {
        return false;
    }
};

/*
Validacion.prototype.tiposValidaciones[NIFNIECIF] = new TipoValidacion (
TipoValidacion.prototype._validarNifNieCif
);
*/

/**
* Valida que el valor del campo pasado por parÃ¡metro sea un NIF, NIE o CIF correctamente formado, y consulta al usuario si desea igualmente usar este valor aunque no estÃ© bien formado.
* 
* @private
* @param {Object} campoAValidar String con el identificador del campo a validar.
* @return true si supera la validaciÃ³n y false en caso contrario.
*/
TipoValidacion.prototype._validarNifNieCifAviso = function (campoAValidar) {
    if (!this._validarNifNieCif(campoAValidar)) {
        var mensaje = jsnMensajesVal[this._idioma][NIFNIECIF_AVISO];

        return confirm(mensaje);
    } else {
        return true;
    }
};

/*
Validacion.prototype.tiposValidaciones[NIFNIECIF_AVISO] = new TipoValidacion (
TipoValidacion.prototype._validarNifNieCifAviso
);
*/

/**
* Valida que el valor del campo pasado por parÃ¡metro sea un NIF, NIE o pasaporte correctamente formado.
* 
* @private
* @param {String} campoAValidar String con el identificador del campo a validar.
* @return true si supera la validaciÃ³n y false en caso contrario.
*/
TipoValidacion.prototype._validarNifNiePas = function (campoAValidar) {
    if (this._validarNifNie(campoAValidar)) {
        return true;
    }
    else if (this._validarPasaporte(campoAValidar)) {
        return true;
    } else {
        return false;
    }
};

/*
Validacion.prototype.tiposValidaciones[NIFNIEPAS] = new TipoValidacion (
TipoValidacion.prototype._validarNifNiePas
);
*/

/**
* Valida que el valor del campo pasado por parÃ¡metro sea un NIF, NIE o pasaporte correctamente formado, y consulta al usuario si desea igualmente usar este valor aunque no estÃ© bien formado.
* 
* @private
* @param {String} campoAValidar String con el identificador del campo a validar.
* @return true si supera la validaciÃ³n y false en caso contrario.
*/
TipoValidacion.prototype._validarNifNiePasAviso = function (campoAValidar) {
    if (!this._validarNifNiePas(campoAValidar)) {
        var mensaje = jsnMensajesVal[this._idioma][NIFNIEPAS_AVISO];

        return confirm(mensaje);
    } else {
        return true;
    }
};

/*
Validacion.prototype.tiposValidaciones[NIFNIEPAS_AVISO] = new TipoValidacion (
TipoValidacion.prototype._validarNifNiePasAviso
);
*/

/**
* Valida que el valor del campo pasado por parÃ¡metro sea un nÃºmero entero.
* 
* @private
* @param {String} campoAValidar String con el identificador del campo a validar.
* @return true si supera la validaciÃ³n y false en caso contrario.
*/
TipoValidacion.prototype._validarNumeroEntero = function (campoAValidar) {
    //var valor = document.getElementById(campoAValidar).value;
    var valor = $("#" + campoAValidar).val();
    if (valor !== '') {
        return valor.indexOf(' ') === -1 && valor * 1 === parseInt(valor, 10);
    }
    else {
        return true;
    }
};

/*
Validacion.prototype.tiposValidaciones[NUMERO_ENTERO] = new TipoValidacion (
TipoValidacion.prototype._validarNumeroEntero
);
*/

/**
* Valida que el valor del campo pasado por parÃ¡metro sea un nÃºmero real.
* 
* @private
* @param {String} campoAValidar String con el identificador del campo a validar.
* @return true si supera la validaciÃ³n y false en caso contrario.
*/
TipoValidacion.prototype._validarNumeroReal = function (campoAValidar) {
    //return this._esNumeroReal(document.getElementById(campoAValidar).value);
    return this._esNumeroReal($("#" + campoAValidar).val());
};

/*
Validacion.prototype.tiposValidaciones[NUMERO_REAL] = new TipoValidacion (
TipoValidacion.prototype._validarNumeroReal
);
*/

/**
* Valida que el valor del campo pasado por parÃ¡metro contenga algÃºn carÃ¡cter.
* 
* @private
* @param {String} campoAValidar String con el identificador del campo a validar.
* @return true si supera la validaciÃ³n y false en caso contrario.
*/
TipoValidacion.prototype._validarObligatorio = function (campoAValidar) {
    //if (!document.getElementById(campoAValidar)) {
    if (!$("#" + campoAValidar)) {
        throw new Error('No s\'ha trobat el camp.');
    }
    //var valor = document.getElementById(campoAValidar).value;
    var valor = $("#" + campoAValidar).val();
    return valor !== '' && valor !== null && valor.trim().length > 0;
};

/*
Validacion.prototype.tiposValidaciones[OBLIGATORIO] = new TipoValidacion (
TipoValidacion.prototype._validarObligatorio
);
*/

/**
* Valida que en el conjunto de campos pasado por parÃ¡metro al menos uno de ellos tenga valor.
* 
* @private
* @param {String} campoAValidar String con los campos a validar separados por coma.
* @return true si supera la validaciÃ³n y false en caso contrario.
*/
TipoValidacion.prototype._validarObligatorio1DeN = function (campoAValidar) {
    var campos = campoAValidar.replace(/ /g, '').split(',');
    for (var i in campos) {
        //var campo = document.getElementById(campos[i]);
        var campo = $("#" + campos[i]).get(0);
        if (campo.type == 'checkbox') {
            if (campo.checked) {
                return true;
            }
        }
        else {
            var valor = campo.value;
            if (valor !== '' && valor !== null) { // cuando se encuentra un campo que tiene valor se devuelve true
                return true;
            }
        }
    }
    return false;
};

/*
Validacion.prototype.tiposValidaciones[OBLIGATORIO_1_DE_N] = new TipoValidacion (
TipoValidacion.prototype._validarObligatorio1DeN
);
*/

/**
* Valida que en un grupo de radio buttons haya al menos uno marcado.
* 
* @private
* @param {String} campoAValidar String con el identificador del primer radioButton del grupo a validar.
* @return true si supera la validaciÃ³n y false en caso contrario.
*/
TipoValidacion.prototype._validarObligatorioRadio = function (campoAValidar) {
    var name = document.getElementById(campoAValidar).name; // obtenemos el nombre del grupo de radio buttons
    var radioButtons = document.getElementsByName(name);
    if (radioButtons !== null) {
        for (var i = 0; i < radioButtons.length; i++) {
            if (radioButtons[i].checked === true) {
                return true;
            }
        }
    }
    return false;
};

/*
Validacion.prototype.tiposValidaciones[OBLIGATORIO_RADIO] = new TipoValidacion (
TipoValidacion.prototype._validarObligatorioRadio
);
*/

/**
* Valida que el valor del campo pasado por parÃ¡metro sea un nÃºmero de tarjeta de crÃ©dito bien formado.
* 
* @private
* @param {String} campoAValidar String con el identificador del campo a validar.
* @return true si supera la validaciÃ³n y false en caso contrario.
*/
TipoValidacion.prototype._validarTarjetaCredito = function (campoAValidar) {
    if (!$("#" + campoAValidar)) {
        throw new Error('Error de definiciÃ³ de la validaciÃ³ del camp amb l\'identificador \'' + campoAValidar + '\'');
    }
    //var numeroTarjeta = document.getElementById(campoAValidar).value;
    var numeroTarjeta = $("#" + campoAValidar).val();
    if (numeroTarjeta === '') {
        return true;
    }
    var cadena = numeroTarjeta.toString();
    var longitud = cadena.length;
    var cifra = null;
    var cifraCadena = null;
    var suma = 0;

    for (var i = 0; i < longitud; i += 2) {
        cifra = parseInt(cadena.charAt(i), 10) * 2;
        if (cifra > 9) {
            cifraCadena = cifra.toString();
            cifra = parseInt(cifraCadena.charAt(0), 10) + parseInt(cifraCadena.charAt(1), 10);
        }
        suma += cifra;
    }
    for (var j = 1; j < longitud; j += 2) {
        suma += parseInt(cadena.charAt(j), 10);
    }
    return (suma % 10) === 0;
};

/*
Validacion.prototype.tiposValidaciones[TARJETA_CREDITO] = new TipoValidacion (
TipoValidacion.prototype._validarTarjetaCredito
);
*/

/**
* Valida que el valor del campo pasado por parÃ¡metro sea menor o igual que el parÃ¡metro especificado en la
* regla de validaciÃ³n.
* 
* @private
* @param {String} campoAValidar String con el identificador del campo a validar.
* @param {String} parametro valor mÃ¡ximo especificado en la regla de validaciÃ³n.
* @return true si supera la validaciÃ³n y false en caso contrario.
*/
TipoValidacion.prototype._validarValorMaximo = function (campoAValidar, parametro) {
    //var valor = document.getElementById(campoAValidar).value;
    var valor = $("#" + campoAValidar).val();
    if (valor === '') {
        return true;
    }
    else {
        return this._validarComparacion(valor, parametro, '<=');
    }
};

/*
Validacion.prototype.tiposValidaciones[VALOR_MAXIMO] = new TipoValidacion (
TipoValidacion.prototype._validarValorMaximo
);
*/

/**
* Valida que el valor del campo pasado por parÃ¡metro sea mayor o igual que el parÃ¡metro especificado en la
* regla de validaciÃ³n.
* 
* @private
* @param {String} campoAValidar String con el identificador del campo a validar.
* @param {String} parametro valor mÃ¡ximo especificado en la regla de validaciÃ³n.
* @return true si supera la validaciÃ³n y false en caso contrario.
*/
TipoValidacion.prototype._validarValorMinimo = function (campoAValidar, parametro) {
    //var valor = document.getElementById(campoAValidar).value;
    var valor = $("#" + campoAValidar).val();
    if (valor === '') {
        return true;
    }
    else {
        return this._validarComparacion(valor, parametro, '>=');
    }
};

/*
Validacion.prototype.tiposValidaciones[VALOR_MINIMO] = new TipoValidacion (
TipoValidacion.prototype._validarValorMinimo
);
*/



/**************************************************************************/
/*           Funciones de soporte para diferentes validaciones            */
/**************************************************************************/

/**
 * Funcion trim para ie8 ya que no la soporta.
 */
if(typeof String.prototype.trim !== 'function') {
	  String.prototype.trim = function() {
	    return this.replace(/^\s+|\s+$/g, ''); 
	  }
	}

/**
* Valida que la variable pasada por parÃ¡metro un nÃºmero real.
* 
* @private
* @param {String} valor String a validar.
* @return true si supera la validaciÃ³n y false en caso contrario.
*/
TipoValidacion.prototype._esNumeroReal = function (valor) {
    if (valor !== '') {
        return valor.indexOf(' ') === -1 && valor * 1.0 === parseFloat(valor);
    }
    else {
        return true;
    }
};

/**
* Valida que el valor pasado por parÃ¡metro sea una hora.
* 
* @private
* @param {String} valor String con la hora a validar.
* @return true si supera la validaciÃ³n y false en caso contrario.
*/
TipoValidacion.prototype._esHora = function (valor) {
    if (valor !== '' && valor.length == 5) {
        var horamin = valor.split(':');
        var hora = horamin[0];
        var min = horamin[1];
        return !isNaN(hora) && !isNaN(min)
					&& parseInt(hora, 10) >= 0 && parseInt(hora, 10) <= 24
			        && parseInt(min, 10) >= 0 && parseInt(min, 10) <= 59;
    }
    else {
        return false;
    }
};

/**
* Valida que el valor pasado por parÃ¡metro sea una fecha.
* 
* @private
* @param {String} valor String con la fecha a analizar.
* @return true si supera la validaciÃ³n y false en caso contrario.
*/
TipoValidacion.prototype._esFecha = function (valor) {
    if (valor !== '') {
        var fecha = valor.split('/');
        if (fecha.length === 3) {
            return this._esAnyo(fecha[2]) && this._esMes(fecha[1]) && this._esDia(fecha[0], fecha[1], fecha[2]);
        } else {
            return false;
        }
    }
    else {
        return true;
    }
};

/**
* Valida que anyo estÃ© bien formado.
* 
* @private
* @param {String} anyo Variable con el valor de un aÃ±o a analizar.
* @return true si supera la validaciÃ³n y false en caso contrario.
*/
TipoValidacion.prototype._esAnyo = function (anyo) {
    return !isNaN(anyo) && anyo.length === 4 && parseInt(anyo, 10) > 0;
};

/**
* Valida que el mes estÃ© bien formado.
* 
* @private
* @param {String} mes Varible con el valor de un mes a analizar.
* @return true si supera la validaciÃ³n y false en caso contrario.
*/
TipoValidacion.prototype._esMes = function (mes) {
    return !isNaN(mes) && parseInt(mes, 10) > 0 && parseInt(mes, 10) < 13;
};

/**
* Valida que el dia estÃ© bien definido en funciÃ³n del anyo y mes.
* 
* @private
* @param {String} dia Varible con el valor del dÃ­a a analizar.
* @param {String} mes Varible con el valor del mes a analizar.
* @param {String} anyo Variable con el valor del aÃ±o a analizar.
* @return true si supera la validaciÃ³n y false en caso contrario.
*/
TipoValidacion.prototype._esDia = function (dia, mes, anyo) {
    function finMes(mes, anyo) {
        var diasMes;
        switch (mes) {
            case 1: diasMes = 31; break;
            case 2: diasMes = 28; break;
            case 3: diasMes = 31; break;
            case 4: diasMes = 30; break;
            case 5: diasMes = 31; break;
            case 6: diasMes = 30; break;
            case 7: diasMes = 31; break;
            case 8: diasMes = 31; break;
            case 9: diasMes = 30; break;
            case 10: diasMes = 31; break;
            case 11: diasMes = 30; break;
            case 12: diasMes = 31; break;
        }
        return diasMes + (((mes === 2) && (anyo % 4) === 0) ? 1 : 0);
    }
    return !isNaN(dia) && dia.length === 2 && parseInt(dia, 10) <= finMes(parseInt(mes, 10), parseInt(anyo, 10)) && parseInt(dia, 10) > 0;
};

/**
* Valida la comparaciÃ³n entre nÃºmeros, tanto reales como enteros.
* 
* @private
* @param {String} numeroIzquierda NÃºmero a comparar situado a la izquierda.
* @param {String} numeroDerecha NÃºmero a comparar situado a la derecha.
* @return true si supera la validaciÃ³n y false en caso contrario.
*/
TipoValidacion.prototype._validarComparacionNumero = function (numeroIzquierda, numeroDerecha, operadorRelacional) {
    return this._ejecutarComparacion(parseFloat(numeroIzquierda), parseFloat(numeroDerecha), operadorRelacional);
};

/**
* Convierte una fecha a un entero.
* 
* @private
* @param {String} fecha String con una fecha
* @return Number con el valor numÃ©rico de la fecha
*/
TipoValidacion.prototype._convertirFechaAEntero = function (fecha) {
    return parseInt(fecha.substr(6) + fecha.substr(3, 2) + fecha.substr(0, 2), 10);
};

/**
* Valida la comparaciÃ³n entre fechas.
* 
* @private
* @param {String} fechaIzquierda String con la fecha a comparar situada a la izquierda.
* @param {String} fechaDerecha String con la fecha a comparar situada a la derecha.
* @return true si supera la validaciÃ³n y false en caso contrario.
*/
TipoValidacion.prototype._validarComparacionFecha = function (fechaIzquierda, fechaDerecha, operadorRelacional) {
    return this._ejecutarComparacion(this._convertirFechaAEntero(fechaIzquierda), this._convertirFechaAEntero(fechaDerecha), operadorRelacional);
};

/**
* Convierte un string hora a un entero.
* 
* @private
* @param {String} hora String con la hora.
* @return Number con la representaciÃ³n numÃ©rica de la hora.
*/
TipoValidacion.prototype._convertirHoraAEntero = function (hora) {
    return parseInt(hora.substr(0, 2) + hora.substr(3), 10);
};

/**
* Valida la comparaciÃ³n entre horas.
* 
* @private
* @param {String} horaIzquierda String con la hora a comparar situada a la izquierda.
* @param {String} horaDerecha String con la hora a comparar situada a la derecha.
*/
TipoValidacion.prototype._validarComparacionHora = function (horaIzquierda, horaDerecha, operadorRelacional) {
    return this._ejecutarComparacion(this._convertirHoraAEntero(horaIzquierda), this._convertirHoraAEntero(horaDerecha), operadorRelacional);
};

/**
* A partir de la validaciÃ³n actual, devuelve la ejecuciÃ³n de la comparaciÃ³n correspondiente sobre los parÃ¡metros numÃ©ricos izquierda y derecha.
* 
* @private
* @param {Number} izquierda Valor numÃ©rico a comparar situado a la izquierda.
* @param {Number} derecha Valor numÃ©rico a comparar situado a la derecha.
* @return true si supera la validaciÃ³n y false en caso contrario.
*/
TipoValidacion.prototype._ejecutarComparacion = function (izquierda, derecha, operadorRelacional) {
    switch (operadorRelacional) {
        case '>': return izquierda > derecha;
        case '>=': return izquierda >= derecha;
        case '<=': return izquierda <= derecha;
        case '<': return izquierda < derecha;
        default: return false;
    }
};

/**
* Valida que el parÃ¡metro de la izquierda sea mayor que el parÃ¡metro de la derecha.
* SegÃºn la validacionActual, la comparaciÃ³n es en modo estricto o no.
* 
* @private
* @param {String} izquierda String con un valor numÃ©rico, hora o fecha a comparar situado a la izquierda.
* @param {String} derecha String con un valor numÃ©rico, hora o fecha a comparar situado a la derecha.
* @return true si supera la validaciÃ³n y false en caso contrario.
*/
TipoValidacion.prototype._validarComparacion = function (izquierda, derecha, operadorRelacional) {
    if (this._esNumeroReal(izquierda)) { //incluye nÃºmeros enteros
        return this._validarComparacionNumero(izquierda, derecha, operadorRelacional);
    } else if (this._esHora(izquierda)) {
        return this._validarComparacionHora(izquierda, derecha, operadorRelacional);
    } else if (this._esFecha(izquierda)) {
        return this._validarComparacionFecha(izquierda, derecha, operadorRelacional);
    } else {
        return false;
    }
};

/**
* Reformatea el NIF/NIE para quitar guiones (-), espacios y 0 iniciales.
* 
* @private
* @param {Object} nifNie String con el NIF/NIE a validar.
* @return String con el NIF/NIE reformateado.
*/
TipoValidacion.prototype._reformatearNifNie = function (nifNie) {
    var numero;
    nifNie = nifNie.replace(/[ \-\._]/g, '').toUpperCase();
    var letra = nifNie.substring(nifNie.length - 1);
    if (letra >= 'A' && letra <= 'Z') {
        // Si es nie no li fem res mes, si no, ...
        if (nifNie.substring(0, 1) != 'X1') {
            // Es un dni.
            numero = nifNie.substring(0, nifNie.length - 1);
            // Si es correcto, reformateamos, si no lo dejamos como esta.
            if (numero.match(/^\d+$/)) {
                //numero = parseInt(numero, 10);
                // Eliminamos los 0 iniciales que no correspondan para evitar duplicados.
                nifNie = '' + numero + letra;
            }
        }
    }
    return nifNie;
};

/**
* Reformatea el NIF/NIE/Pasaporte para quitar guiones (-), espacios y 0 iniciales.
* 
* @private
* @param {String} nifNiePas String con el NIF/NIE/Pasaporte a tratar.
* @return String con el NIF/NIE/Pasaporte reformateado.
*/
TipoValidacion.prototype._reformatearNifNiePas = function (nifNiePas) {
    var numero;
    nifNiePas = nifNiePas.replace(/[ \-\._]/g, '').toUpperCase();
    if (nifNiePas.substring(0, 1) == 'P') {
        return nifNiePas;
    } else {
        var letra = nifNiePas.substring(nifNiePas.length - 1);
        if (letra >= 'A' && letra <= 'Z') {
            // Si es nie no li fem res mes, si no, ...
            if (nifNiePas.substring(0, 1) != 'X') {
                // Es un dni.
                numero = nifNiePas.substring(0, nifNiePas.length - 1);
                // Si es correcto, reformateamos, si no lo dejamos como estÃ¡.
                if (numero.match(/^\d+$/)) {
                    //numero = parseInt(numero, 10);
                    // Eliminamos los 0 iniciales que no correspondan para evitar duplicados.
                    nifNiePas = '' + numero + letra;
                }
            }
        }
    }
    return nifNiePas;
};

/**
* Reformatea el NIF/NIE/CIF para quitar guiones (-), espacios y 0 iniciales.
* 
* @private
* @param {String} nifNieCif String con el NIF/NIE/CIF a tratar.
* @return String con el NIF/NIE/CIF reformateado.
*/
TipoValidacion.prototype._reformatearNifNieCif = function (nifNieCif) {
    var numero;
    nifNieCif = nifNieCif.replace(/[ \-\._]/g, '').toUpperCase();
    //si lo primero es una letra distinta de X posiblemente es un CIF
    if (!nifNieCif.substring(0, 1).match(/^\d+$/) && nifNieCif.substring(0, 1) != 'X') {
        return nifNieCif;
    } else {
        var letra = nifNieCif.substring(nifNieCif.length - 1);
        if (letra >= 'A' && letra <= 'Z') {
            // Si es nie no li fem res mes, si no, ...
            if (nifNieCif.substring(0, 1) != 'X') {
                // Es un dni.
                numero = nifNieCif.substring(0, nifNieCif.length - 1);
                // Si es correcto, reformateamos, si no lo dejamos como esta.
                if (numero.match(/^\d+$/)) {
                    //numero = parseInt(numero, 10);
                    // Eliminamos los 0 iniciales que no correspondan para evitar duplicados.
                    nifNieCif = '' + numero + letra;
                }
            }
        }
    }
    return nifNieCif;
};

//FUNCIONES DE SOPORTE PARA FILTRAR FECHAS VÃ�A EXPRESIONES CRON.

/**
* Analiza una fecha en modo texto con el formato dd/mm/yyyy admitiendo cierta flexibilidad (d/m/yy o d-m-y)
* 
* @param {String} ft Fecha en formato texto a procesar.
* @return {Date} Objeto Date con la fecha obtenida.
*/
TipoValidacion.prototype._obtenerFecha = function (ft) {
    //determinar tipo de separador y posiciÃ³n del primero de los 2
    var separador = '/';
    var posSeparador = ft.indexOf(separador);

    if (posSeparador == -1) {
        separador = '-';
        posSeparador = ft.indexOf(separador);
    }

    if (posSeparador == -1)
        return null;

    var dia = ft.substr(0, posSeparador);
    var tmp = ft.substr(posSeparador + 1);

    //segundo separador
    posSeparador = tmp.indexOf(separador);
    if (posSeparador == -1)
        return null;

    var mes = tmp.substr(0, posSeparador) - 1;

    var ano = tmp.substr(posSeparador + 1);
    if (ano.length < 4 && parseInt(ano) < 10) {
        ano = '20' + ano;
    }

    //validar informaciÃ³n:
    if (parseInt(dia) == -1 || parseInt(mes) == -1 || parseInt(ano) == -1)
        return null;
    if (dia.length > 2 || mes.length > 2 || ano.length > 4)
        return null;
    if (parseInt(dia) > 31 || parseInt(mes) > 12)
        return null;

    var fecha = new Date(ano, mes, dia);

    return fecha;
};

/**
* Determina si un aÃ±o es bisiesto.
* @private
* 
* @param {Object} ano AÃ±o a evaluar.
* @return {boolean} true si el aÃ±o es bisiesto.
*/
TipoValidacion.prototype._isBisiesto = function (ano) {
    return (((ano % 4 == 0) && (ano % 100 != 0)) || (ano % 400 == 0)) ? 1 : 0;
};

//Devuelve el Ãºltimo dia del mes especificado del aÃ±o.
TipoValidacion.prototype._ultimoDiaMes = function (mes, anyo) {
    var calDiasMesAnoNormal = new Array('31', '28', '31', '30', '31', '30', '31', '31', '30', '31', '30', '31');
    var calDiasMesAnoBisiesto = new Array('31', '29', '31', '30', '31', '30', '31', '31', '30', '31', '30', '31');
    if (this._isBisiesto(anyo)) {
        return calDiasMesAnoBisiesto[mes];
    } else {
        return calDiasMesAnoNormal[mes];
    }
};



//CRON:
//  *   *   *
//	1-31 0-11 0-6
//	dia mes diaSemana
TipoValidacion.prototype._checkCron = function (fecha, cron) {
    var test = [fecha.getDate(), fecha.getMonth() + 1, fecha.getDay()];

    //Adaptamos la expresiÃ³n CRON a la fecha. 
    //En caso de existir referencias al dÃ­a 31 tener en cuenta el Ãºltimo dÃ­a del mes de la fecha evaluada
    cron = cron.replace("31", this._ultimoDiaMes(fecha.getMonth(), fecha.getFullYear()));

    var elementosCron = cron.split(" ");
    var n = 0;
    for (var i = 0; i < elementosCron.length; i++) {
        if (this._testElementoCron(elementosCron[i], test[i]))
            n++;
    }
    return n == 3;
};

//Comprueba si un elemento (nÃºmero) concuerda con la expresiÃ³n CRON correspondiente a su posiciÃ³n.
TipoValidacion.prototype._testElementoCron = function (cron, elemento) {

    //*
    if (cron === "*")
        return true;

    //digito
    if (/^\d+$/.test(cron))
        return (cron == elemento);

    // -
    var rango = cron.split("-");
    if (rango.length > 1) {
        var n = parseInt(elemento);
        return (n >= parseInt(rango[0]) && n <= parseInt(rango[1]));
    }

    // ,
    var ns = cron.split(",");
    if (ns.length > 1) {
        for (var i = 0; i < ns.length; i++) {
            if (ns[i] == elemento)
                return true;
        }
    }

    return false;
};

//Dado el id de un campo intenta obtener el campo del control kendo asociado.
function getKendoInputControl(id) {
    /*
    var roles = {
    "numerictextbox": "kendoNumericTextBox"
    }
    */

    if ($("#" + id).length == 0) {
        alert("ERROR en getKendoInputControl: El campo con ID " + id + " no existe.");
        return false;
    }

    //Determinar si es un autocompletable
    if ($("#" + id + "_ac").length > 0) {
        return $("#" + id + "_ac").data("kendoComboBox").input;
    } else {
        /*
        var role = $("#" + id).data("role");
        var kendoWidgetId = roles[role];
        var kendoControl = $("#" + id).data(kendoWidgetId);
        */
        var kendoControl = $("#" + id);
        return kendoControl.siblings("input:visible");
        //return kendoControl._text;
    }

    return false;
}


