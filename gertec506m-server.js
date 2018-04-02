var ffi = require("ffi");
var ref = require("ref");
var ArrayType = require("ref-array");
var Struct = require("struct");

var now = require("performance-now");
var wrap = require('wordwrap')(30);

var int = ref.types.int;
var IntArray = ArrayType(int); 



/**
* A map between Windows and C types.
* https://msdn.microsoft.com/en-us/library/windows/desktop/aa383751%28v=vs.85%29.aspx
*/
const types = {
  "BOOL":   "int",
  "INT":    "int",
  "UINT":   "uint",
  "ULONG":  "ulong",
  "DWORD":  "ulong",
  "HKL":    "void*",
  "ULONG_PTR": "ulong",
  "LONG":   "long",
  "HANDLE": "uint32",
  "WORD":   "uint16",
  "TCHAR":  "uint16"
};


var LIB_GERTEC_506M = ffi.Library('SC504.dll', {
  'tc_startserver': [int, [IntArray, int, int] ],
  "tc_ipfromid": ['string', [int]],
  "ClearDisplay": [int, [int, int]],
  "tc_sendlive": [int, [int]],
  "tc_sendalwayslive": [int, [int]],
  "tc_requid": [int, [int]],
  "tc_getuid": [int, [int, 'string', 'string']],
  "tc_getserial": [int, [int, 'int *', 'char *']],
  "tc_sendtext": [int, [int, "pointer"]]
});

var DisplayText = Struct()
    .word16Sle('wPosX')
    .word16Sle('wPosY')
	.chars('sText',128)
    .chars('sFont',32)
    .word16Sle('wSize')
    .word16Sle('wColor')
    .word16Sle('wBGColor');


function loopingVerificaNovoTerminalConectado() {

  let terminalID = terminais.length+1;
  let whois = LIB_GERTEC_506M.tc_ipfromid(terminalID);

  if (whois) {
    console.log("Novo terminal conectado: (IP) " + whois);
    terminais.push(terminalID);
    LIB_GERTEC_506M.tc_sendalwayslive(terminalID);
  
   // console.log("Requesting MAC address...");
   // libm.tc_requid(terminalID);
   
  } else {
    console.log("Total de terminais conectados: " + terminais.length);
  }
};

function buscaPrecoDadoCodigoBarras(terminalID, codBarras, lojaID) {
    console.log("Terminal: " + terminalID + " / Código de Barras: " + codBarras);
}

function getLojaID() {
    return 1;
}

function loopingVerificaNovoCodigoDeBarras() {

  var n1 = now().toFixed(10);

  for (i = 0; i < 100; i++) { 
    let terminalID = i+1;
    let serialPort = new Buffer(1);
    let bufferBarCode = new Buffer(256);

    var t0 = now().toFixed(3);  
    let bytesRead = LIB_GERTEC_506M.tc_getserial(terminalID, serialPort, bufferBarCode);
    var t1 = now().toFixed(3);
//    console.log("ping terminal " + terminalID + "// t1 (tc_getserial): " + ((t1 - t0)/1000).toFixed(6) + " seconds.")
   
    if (bytesRead > 0) {
        let codigoBarras = ref.readCString(bufferBarCode);
        let lojaID = getLojaID();

        buscaPrecoDadoCodigoBarras(terminalID, codigoBarras, lojaID);

        var t2 = now().toFixed(3);
        LIB_GERTEC_506M.ClearDisplay(terminalID,271);
        var t3 = now().toFixed(3);
        console.log("t2 (ClearDisplay): " + (t3 - t2).toFixed(3) + " milliseconds.")

        let produto = "Tempero Completo Arisco com Pimenta 300g";
        let preco = "4,69";

        let produtoArrWordWrap = wrap(produto).split('\n');
        let linha1 = (typeof  produtoArrWordWrap[0] != 'undefined') ? produtoArrWordWrap[0] : "";
        let linha2 = (typeof  produtoArrWordWrap[1] != 'undefined') ? produtoArrWordWrap[1] : "";

        //PRIMEIRA LINHA - PRODUTO
        DisplayText.allocate();
        var buf = DisplayText.buffer();
        var proxy = DisplayText.fields;
        proxy.wPosX = 10;
        proxy.wPosY = 40;
        proxy.sText = linha1;
        proxy.sFont = "DejaVuSerif.ttf";
        proxy.wSize = 20;
        proxy.wColor = 260;
        proxy.wBGColor = 264; 
        LIB_GERTEC_506M.tc_sendtext(terminalID, buf);

        var t4 = now().toFixed(3);
        console.log("t3 (tc_sendtext): " + (t4 - t3) + " milliseconds.")

        //SEGUNDA LINHA - PRODUTO
        DisplayText.allocate();
        let buf1 = DisplayText.buffer();
        var proxy1 = DisplayText.fields;
        proxy1.wPosX = 10;
        proxy1.wPosY = 80;
        proxy1.sText = linha2;
        proxy1.sFont = "DejaVuSerif.ttf";
        proxy1.wSize = 20;
        proxy1.wColor = 260;
        proxy1.wBGColor = 264; 
        LIB_GERTEC_506M.tc_sendtext(terminalID, buf1);

        var t5 = now().toFixed(3);
        console.log("t5 (tc_sendtext): " + (t5 - t4) + " milliseconds.")

        //TERCEIRA LINHA - PREÇO
        DisplayText.allocate();
        let buf2 = DisplayText.buffer();
        let proxy2 = DisplayText.fields;
        proxy2.wPosX = 160;
        proxy2.wPosY = 140;
        proxy2.sText = "R$" + preco;
        proxy2.sFont = "DejaVuSerif.ttf";
        proxy2.wSize = 26;
        proxy2.wColor = 260;
        proxy2.wBGColor = 264;
        LIB_GERTEC_506M.tc_sendtext(terminalID, buf2);

        var t6 = now().toFixed(3);
        console.log("t6 (tc_sendtext): " + (t6 - t5) + " milliseconds.")
    }

  }
  var n2 = now().toFixed(10);
  console.log("******** Total ping terminais (tc_getserial): " + ((n2 - n1)/1000).toFixed(3) + " seconds.")
}

function start() {
  let connected = LIB_GERTEC_506M.tc_startserver([],2,3);
  if (connected == 1) { 
    console.log("> Eurekalabs - Servidor para Terminais de Consulta Modelo Gertec 506 Mídia.");
    console.log("> Solução utilizando NodeJS sobre DLL (SC504.DLL).");

    console.log("\n\n> Iniciando servidor....");
    console.log("> Servidor inicializado. Aguardando por conexões de terminais...\n");
  } else {
    console.log("> Falha ao iniciar servidor!");
  }
  
  setInterval(loopingVerificaNovoTerminalConectado, 20000);
  setInterval(loopingVerificaNovoCodigoDeBarras, 1300);
}

var terminais = [];
start();
