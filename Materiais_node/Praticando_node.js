var express = require('express');
const ejs = require('ejs');
var app = express();
app.set('view engine','ejs');
/* colocar rota */
app.get('/',function(requi,respo){
respo.render('index.ejs');
});
app.get('/sobre',function(requi,respo){
respo.render('sobre.ejs');
});
var porta=3000;
app.listen(porta,function(){
console.log("Sucesso");

});
