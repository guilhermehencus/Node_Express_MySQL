var express = require('express'); /* Programar e interceptar rotas */
const ejs = require('ejs');
var app = express(); /* (), executar todo o conteúdo da biblioteca express */
var load = require('express-load');
var md5= require('md5');
load ('banco').into(app); 
var bodyParser = require('body-parser');
var session = require('express-session');
app.set('view engine','ejs'); /* Indenizar o Layout ejs */
app.use(bodyParser.urlencoded({extended:true})); /* habilita formulários mais complexo e deixa os dados mais visíveis vindo */
app.use(session({
 secret: 'exemplo1', /* chave de criptografia */
 resave: false,
 saveUninitialized: true,
 cookie: { maxAge: 600000 }
}));
app.use(express.static("public")); /*acesso para pasta public */
/* colocar rotas */
app.get('/',function(requi,respo){
var sess = requi.session;
  if(sess.logado== 1){
    respo.render('index.ejs', {'usuario': sess});  /* locals= se existe uma variável */ 
}else{
respo.render('index.ejs');
}
});
app.get('/sobre',function(requi,respo){
respo.render('sobre.ejs');
});
app.get('/exibirform',function(requi,respo){
var sess = requi.session;
  if(sess.logado== 1){
    respo.redirect ('/login');
}else{
   respo.render('formulario.ejs');   
}
});
app.post('/acform',function(requi,respo){
  var dados = requi.body; /* Ex: var nome= requi.body.nome */
  var conexao = app.banco.conexao();
  var usuario = new app.banco.usuario(conexao);
  var cripto = md5(dados.senha);
  dados.senha = cripto;
  usuario.guardar(dados, function (erro, sucesso)
  {
  usuario.guardar_login(dados, function (erro, sucesso)
  {  
  if (erro) {
    console.log(erro);
  }
  respo.render('dados.ejs', {'info': dados}); /* <%= info.nome %> , tag js mostra algo. 'info' vai para dados.ejs */
  });
  }); 
  });
  app.get('/mostrar',function(requi,respo){
    var conexao = app.banco.conexao();
    var usuario = new app.banco.usuario(conexao); /* Passar o conexão.js para usuario.js */
    usuario.mostrar (function (erro, sucesso) { /* callback (err, true) */
    if (erro) {
    console.log(erro);
    } else {
    console.log(sucesso);  
    respo.render('resultadodados.ejs', {'resultado': sucesso}); /* tag % código java sem mostrar nada, enquando tag %= mostra alguma coisa*/
    }
  });
  });
  app.post('/buscarnome', function (requi,respo){
    var nome = requi.body;
    if (nome.nomebusca == "") {
      respo.redirect ('/mostrar');
    }
    var conexao = app.banco.conexao();
    var usuario = new app.banco.usuario(conexao);
    usuario.buscarnome(nome, function (erro,sucesso){ 
      if (erro) {
    console.log(erro);
    } else {
      respo.render('resultadodados.ejs', {'resultado': sucesso} );
    } 
    });
  });
  app.post('/ac2form',function(requi,respo){
    respo.render('index.ejs');
  });
  app.get('/buscaeditar/:id', function(requi,respo) {
    var id= requi.params.id;
    var conexao = app.banco.conexao();
    var usuario = new app.banco.usuario(conexao);
    usuario.buscaeditar(id,function(erro,sucesso){
    if(erro){
      console.log(erro);
    }else{
      respo.render('formeditar.ejs',{'resultado':sucesso});
    }
  });
  });
  app.post ('/editar', function(requi, respo) {
  var dados = requi.body
  var conexao = app.banco.conexao();
  var usuario = new app.banco.usuario(conexao)
  usuario.editar(dados,function(erro,sucesso){
    if(erro){
      console.log(erro);
    }else{
       respo.redirect ('/mostrar');
    }
  });
  });
  app.get('/deletar/:id', function(requi,respo) {
    var id= requi.params.id;
    var conexao = app.banco.conexao();
    var usuario = new app.banco.usuario(conexao);
    usuario.deletar(id,function(erro,sucesso){
    if(erro){
      console.log(erro);
    }else{
      respo.redirect ('/mostrar');
    }
  });
  });
  app.get('/login', function(requi,respo) {
    
    respo.render('formlogin.ejs');
  });
  app.post ('/login', function(requi,respo) {
  var sess = requi.session;
  var dados = requi.body; 
   var cripto = md5(dados.senha);
  dados.senha = cripto;
  var conexao = app.banco.conexao();
  var usuario = new app.banco.usuario(conexao);
  usuario.verlogin(dados,function(erro,sucesso){ 
   if(sucesso.length){
     sess.usuario = sucesso[0].usuario;
     sess.logado = 1;
     respo.redirect('/');
   } else {
     respo.redirect ('/login');
   } 
  });
  });
app.get ('/logout', function(requi,respo) {
    var sess = requi.session;
    sess.logado=0;
    sess.destroy(); 
    respo.redirect ('/');
  });
  app.get ('/cadastrarAdm', function(requi,respo) {
     var sess = requi.session;
    if (sess.logado==1){
    respo.render ("cadastrarAdm.ejs");   /* Boas práticas, uma renderiza e outra rendireciona */
} else {
   respo.rendirect('/login');
}
  });
  app.post ('/cadastrarAdm', function(requi,respo) {
    var dados = requi.body;
    var conexao = app.banco.conexao();
    var usuario = new app.banco.usuario(conexao);
    usuario.verAdm(dados,function(erro,sucesso){ 
    if (sucesso.length){
      var mensagem = "O usuário já existe";
     respo.render('cadastrarAdm.ejs', {'mensagem': mensagem });
   } 
   else {
     var cripto = md5(dados.senha);
     dados.senha = cripto;
     usuario.cadastrarAdm(dados,function(erro,sucesso){ 
       if (erro) {
       console.log(erro);
    }else{
      var mensagem = "Usuário cadastrado";
      respo.render('formlogin.ejs', {'mensagem': mensagem });
    }
     });
   }
    });
  });
var porta = 3000;
app.listen(porta,function(){
  console.log('Sucesso'); /* Requisição deu certo */
});

