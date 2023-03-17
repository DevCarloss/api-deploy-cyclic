const dotenv = require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const CORS = require('CORS')
const nodemailer = require('nodemailer')
const validator = require('validator')

// Nodemailer 
let transporter = nodemailer.createTransport({
    service: 'gmail',
    secure: false,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.SENHA
    }

})
// API 
app.use(CORS())
app.use(bodyParser.json())
app.get('/',(req,res) => {
    return res.status(200).send('<h1>API Funcionando<h1>')
})
app.post('/send',(req,res) => {
    res.set({'Content-Type': 'application/json'})
    function enviarEmail(){
        const {email,empresa_projeto,descricao} = req.body
        if(validator.isEmail(email)){
            transporter.sendMail({
            from: 'Formulario de Contato ' + '<' + process.env.EMAIL + '>',
            to: 'carlossilvasbc@gmail.com',
            replyTo: email,
            subject: empresa_projeto,
            text: descricao,
          }).then(info => {
            return res.status(200).send('Formulario Enviado Com Sucesso')
          }).catch((err) => {
            console.log(err.stack)
            return res.status(500).send('Erro ao enviar o formulario tente novamente: ' + err.stack)
            
          })
        }
        else {
            return res.status(500).send('Por favor preencha um email valído')
        }
    }
    enviarEmail()
})

app.listen(process.env.PORT || 3000, () => {
    console.log('API Rodando')
})
