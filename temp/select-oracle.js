var oracledb = require('oracledb');

oracledb.getConnection(
  {
    user          : "cds_cidade_cancao",
    password      : "cds_cancao",
    connectString : "localhost/XE"
  },
  function(err, connection)
  {
    if (err) { console.error(err); return; }
    connection.execute(
      "SELECT descricao, valor "
    + "FROM produto "
    + "WHERE barcode = " + "7891040204465",
      function(err, result)
      {
        if (err) { console.error(err); return; }
        console.log(result.rows);
      });
  });