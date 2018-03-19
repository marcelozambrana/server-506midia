1) Instalar node32   
npm -v 5.6.0  
nvm install 8.9.4 32 (nvm list 8.9.4 Currently using 32-bit executable)  
  
2) npm install --global --production windows-build-tools  
or  
http://landinghub.visualstudio.com/visual-cpp-build-tools  
https://www.python.org/downloads/  
  
3) fatal error LNK1107: invalid or corrupt file: cannot read at 0x153E76  
troubleshooting: I deleted C:\Users\UserName\.node-gyp folder and did npm i to resolve dependencies, which worked for me.  
  
4) npm install:  
npm install ffi  
npm install ref  
npm install ref-array  
npm install struct  
npm install wordwrap  
npm install performance-now  
  
5) npm install oracledb  
https://github.com/oracle/node-oracledb/blob/master/INSTALL.md  
https://github.com/oracle/node-oracledb/blob/master/doc/api.md#getstarted  
https://support.microsoft.com/en-us/help/2977003/the-latest-supported-visual-c-downloads  
  
6) CREATE OR REPLACE PROCEDURE buscaPreco(BARCODE_IN IN STRING, PRODUTO_OUT OUT STRING, PRECO_OUT OUT STRING)  
 IS  
  pDescricao VARCHAR(100);  
  pValor VARCHAR(100);  
BEGIN  
	BEGIN  
		SELECT descricao, valor INTO pDescricao, pValor  
	 		FROM produto WHERE barcode = BARCODE_IN;  
	EXCEPTION  
      		WHEN NO_DATA_FOUND THEN  
        		pDescricao := NULL;  
	END;  
  
 	IF (pDescricao IS NULL) THEN  
    		PRODUTO_OUT := 'PRODUTO NÃO ENCONTRADO';  
    		PRECO_OUT := '';  
 	ELSE  
    		PRODUTO_OUT := pDescricao;  
    		PRECO_OUT := pValor;  
 	END IF;  
END;  
  
--- test:  
set serveroutput on;  
  
DECLARE  
	x VARCHAR(100);  
	y VARCHAR(100);  
BEGIN  
	buscaPreco('123', x, y);  
	dbms_output.put_line('x: ' || x || ' y: ' || y);  
END;  
  
7) UP Server:  
node gertect506m-server.js  
