const express = require("express")
const app = express()
const handlebars = require("express-handlebars").engine
const PORT = 8081
const bodyParser = require("body-parser")
const agendamentos = require("./models/agendamento")

app.engine("handlebars", handlebars({
    defaultLayout: "main",
    helpers:{
      // Function to do basic mathematical operation in handlebar
      math: function(lvalue, operator, rvalue) {lvalue = parseFloat(lvalue);
          rvalue = parseFloat(rvalue);
          return {
              "+": lvalue + rvalue,
              "-": lvalue - rvalue,
              "*": lvalue * rvalue,
              "/": lvalue / rvalue,
              "%": lvalue % rvalue
          }[operator];
      }
  }}))
app.set('view engine', 'handlebars');
app.set("view engine", "handlebars")

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.get("/", function(req, res){
    res.render("index")
})

app.get("/consultar", function(req, res){
    agendamentos.findAll().then(function(listaAgendamentos){
        //console.log(listaAgendamentos)
        res.render("consultar", { listaAgendamentos: listaAgendamentos })
    }).catch(function(erro){
        console.log("Erro: nenhum agendamento encontrado! " + erro)
    })
})


app.get("/atualizar", function(req, res){
    res.render("atualizar")
})

app.post("/cadastrar", function(req, res){
    agendamentos.create({
        nome: req.body.nome,
        telefone: req.body.telefone,
        origem: req.body.origem,
        data_contato: req.body.data_contato,
        observacao: req.body.observacao
    }).then(function(){
        console.log("Agendamento cadastrado com sucesso!")
    }).catch(function(erro){
        console.log("Erro: Agendamento não cadastrado!" + erro)
    })
    res.render("consultar")
})


app.listen(8081, function(){
    console.log(`Servidor ativo na porta ${PORT}`)
    console.log(`http://localhost:${PORT}`)
})

// npm i express
// npm i express-handlebars
// npm i sequelize mysql
// npm i body-parser