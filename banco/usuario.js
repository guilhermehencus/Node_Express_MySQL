//ações na tabela cadastro//
function usuario(conexao) {
  this._conexao=conexao; /* vai receber a conexão no conexao.js */
}

usuario.prototype.guardar = function (dados, callback) {
  this._conexao.query('insert into cadastro set ?',dados,callback);
}
usuario.prototype.guardar_login = function (dados, callback) {
  this._conexao.query('insert into login (usuario, senha) values (?, ?) ',[dados.nome,dados.senha],callback);
}
usuario.prototype.mostrar = function (callback) {
  this._conexao.query('select * from cadastro',callback);
}
usuario.prototype.buscarnome = function (nome, callback) {
  var nome = nome.nomebusca;
  this._conexao.query('select * from cadastro where nome = ?',nome, callback);
}
usuario.prototype.buscaeditar= function (id, callback) {

  this._conexao.query('select * from cadastro where id = ?',id, callback); 
}
usuario.prototype.editar= function (dados, callback) {

  this._conexao.query('UPDATE cadastro SET? where id = ?',[dados, dados.id], callback);
}
usuario.prototype.deletar= function (id, callback) {

  this._conexao.query('DELETE from cadastro where id = ?',id, callback);
}
usuario.prototype.verlogin = function(dados,callback){
  this._conexao.query('SELECT * FROM login WHERE usuario = ? AND senha = ?',[dados.usuario,dados.senha],callback);
}
usuario.prototype.verAdm = function(dados,callback){
  this._conexao.query('SELECT * FROM login WHERE usuario = ?',dados.usuario,callback);
}
usuario.prototype.cadastrarAdm = function(dados,callback){
  this._conexao.query('INSERT into login set ?',dados,callback);
}
module.exports = function () {
  return usuario;
}