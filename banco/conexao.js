var mysql = require('mysql2');
function criarConexao(){

  return mysql.createConnection ({
    host:'',
    user: '',
    password: '',
    database: 'Exemplo_Node',



  });


}

module.exports = function(){ /* Ficar disponível para outros arquivos */
  return criarConexao;
}