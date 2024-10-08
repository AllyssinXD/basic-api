const express = require('express')
const {authRouter} = require('./routes/auth')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const db = require('./db/db')
require('dotenv').config()


const port = 5000
const app = express()

db.Connect();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(cookieParser())

app.use('/auth', authRouter)

app.listen(port, ()=>console.log(`Servidor rodando na porta ${port}`))