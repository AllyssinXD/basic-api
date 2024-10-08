const mongoose = require("mongoose")

function Connect(){
    mongoose.connect(process.env.MONGO_URI+"registrese")
    
    const db = mongoose.connection;

    db.on('error', (err)=>{
        console.log('Erro ao conectar ao Banco de dados: ' + err)
    })

    db.once('open', ()=>{
        console.log('Conectado ao Banco de Dados')
    })
}

module.exports.Connect = Connect