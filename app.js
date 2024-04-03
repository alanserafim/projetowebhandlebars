const express = require("express")
const app = express()
const handlebars = require("express-handlebars").engine
const PORT = 8081
const bodyParser = require("body-parser")
const agendamentos = require("./models/agendamento")

app.use(express.static("assets"));
app.engine("handlebars", handlebars({
    defaultLayout: "main",
    helpers: {
        // Função para fazer operações matemáticas no handlebars
        math: function (lvalue, operator, rvalue) {
            lvalue = parseFloat(lvalue);
            rvalue = parseFloat(rvalue);
            return {
                "+": lvalue + rvalue,
                "-": lvalue - rvalue,
                "*": lvalue * rvalue,
                "/": lvalue / rvalue,
                "%": lvalue % rvalue
            }[operator];
        },
        // Função para fazer comparação de valores no handlebars
        isEqual: function (expectedValue, value) {
            return value === expectedValue;
        }
    }
}))
app.set('view engine', 'handlebars');
app.set("view engine", "handlebars")

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get("/", function (req, res) {
    res.render("index")
})

app.get("/consultar", function (req, res) {
    agendamentos.findAll().then(function (listaAgendamentos) {
        res.render("consultar", { listaAgendamentos: listaAgendamentos })
    }).catch(function (erro) {
        console.log("Erro: nenhum agendamento encontrado! " + erro)
    })
})


app.get("/editar/:id", function (req, res) {
    agendamentos.findAll({ where: { "id": req.params.id } }).then(function (cliente) {
        console.log(cliente)
        res.render("editar", { cliente: cliente })
    }).catch(function (erro) {
        console.log("Erro: Agendamento não encontrado!" + erro)
    })
})



app.post("/cadastrar", function (req, res) {
    agendamentos.create({
        nome: req.body.nome,
        telefone: req.body.telefone,
        origem: req.body.origem,
        data_contato: req.body.data_contato,
        observacao: req.body.observacao
    }).then(function () {
        console.log("Agendamento cadastrado com sucesso!")
        agendamentos.findAll().then(function (listaAgendamentos) {
            res.render("consultar", { listaAgendamentos: listaAgendamentos })
        }).catch(function (erro) {
            console.log("Erro: nenhum agendamento encontrado! " + erro)
        })
    }).catch(function (erro) {
        console.log("Erro: Agendamento não cadastrado!" + erro)
    })
})



app.post("/atualizar", function (req, res) {
    agendamentos.update({
        nome: req.body.nome,
        telefone: req.body.telefone,
        origem: req.body.origem,
        data_contato: req.body.data_contato,
        observacao: req.body.observacao
    }, { where: { "id": req.body.id } }).then(function () {
        console.log("Agendamento atualizado com sucesso!")
        agendamentos.findAll().then(function (listaAgendamentos) {
            res.render("consultar", { listaAgendamentos: listaAgendamentos })
        }).catch(function (erro) {
            console.log("Erro: nenhum agendamento encontrado! " + erro)
        })
    }).catch(function (erro) {
        console.log("Erro: Agendamento não atualizado!" + erro)
    })

})

app.get("/excluir/:id", function (req, res) {
    agendamentos.destroy({ where: { "id": req.params.id } }).then(function () {
        res.redirect("/")
        console.log("Agendamento excluído com sucesso!")
    }).catch(function (erro) {
        console.log("Erro: Agendamento não excluído!" + erro)
    })
})

app.listen(8081, function () {
    console.log(`Servidor ativo na porta ${PORT}`)
    console.log(`http://localhost:${PORT}`)
})




// npm i express
// npm i express-handlebars
// npm i sequelize mysql
// npm i body-parser