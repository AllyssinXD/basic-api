const express = require('express')
const {authRouter} = require('./routes/auth')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const db = require('./db/db')
require('dotenv').config()
const cors = require('cors')


const port = 5000
const app = express()

db.Connect();

const allowedOrigins = ['http://localhost:3000'];

app.use(cors(
    {
        origin: function (origin, callback) {
            // Verifica se o origin está na lista de permitidos
            if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
            } else {
            callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: true
    }
))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(cookieParser())

app.use('/auth', authRouter)

app.listen(port, ()=>console.log(`Servidor rodando na porta ${port}`))