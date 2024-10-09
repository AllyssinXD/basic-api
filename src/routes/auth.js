const express = require('express')
const router = express.Router();
const UserModel = require('../db/models/UserModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

router.get('/', async (req, res)=>{
    if(!req.cookies)
        return res.status(400).json({message: "Não há Cookies"})

    const token = req.cookies.token;
    if(!token)
        return res.status(400).json({message: "Cookie de token não definido"})

    const payload = jwt.verify(token, process.env.SECRET_KEY)
    if(!payload)
        return res.status(400).json({message: "Token Inválido"})
    
    const user = await UserModel.findOne({_id: payload.userID})
    if(!user)
        return res.status(400).json({message: "Id do Usuário invalido"})

    return res.status(200).json({username: user.username})
})

router.get('/logout', async (req, res)=>{
    res.clearCookie('token', {
        httpOnly: true,
        sameSite: 'Lax',  // Mesmas configurações que foram usadas na criação
        secure: process.env.NODE_ENV === 'production',  // Mesmas configurações que foram usadas na criação
    });
    res.status(200).json({ message: "Logout realizado com sucesso" });
})

router.post('/register', async (req, res)=>{
    const {username, password} = req.body;

    if(!username || !password)
        return res.status(400).json({message: "Nome ou senha não definidos"})

    const exists = await UserModel.findOne({username: username})

    if(exists)
        return res.status(400).json({message: "Esse nome de usuário já está sendo utilizado"})

    if(password.length < 8)
        return res.status(400).json({message: "Senha muito curta"})

    const hashedPassword = await bcrypt.hash(password, 12)

    const newUser = new UserModel({username: username, password: hashedPassword})
    await newUser.save()
    return res.status(200).json({message: "Sucesso!"})
})

router.post('/login', async (req, res)=>{
    const {username, password} = req.body;

    if(!username || !password)
        return res.status(400).json({message: "Nome ou senha não definidos"})

    const user = await UserModel.findOne({username: username})

    if(!user)
        return res.status(400).json({message: "Esse usuário não existe."})

    const passwordAccurate = await bcrypt.compare(password, user.password)

    if(!passwordAccurate)
        return res.status(400).json({message: "A senha está incorreta"})

    
    res.cookie('token', jwt.sign({userID: user._id}, process.env.SECRET_KEY),
    {
        httpOnly: true,
        maxAge: 1000*60*60*24,
        secure: process.env.NODE_ENV === 'production',  // Só define o cookie como secure em produção
        sameSite: 'Lax'  // Evita problemas de CSRF, mas permite envio de cookies
    }).status(200).json({message: "Logado com sucesso"})
})

exports.authRouter = router;