var oracledb = require('oracledb');

oracledb.getConnection(
  {
    user          : "cds_cidade_cancao",
    password      : "cds_cancao",
    connectString : "localhost/XE"
  },
  function(err, connection) {
      connection.execute(
        "BEGIN BUSCAPRECO(:barcode, :descricao, :preco); END;",
        {  // bind variables
            barcode:   '7891040204465',
            descricao: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 70 },
            preco: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 20 },
        }, function (err, result) {
        if (err) { console.error(err.message); return; }
        console.log(result.outBinds);
        })
  });