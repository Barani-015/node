const express = require('express')
const cors = require('cors')
const model = require('./model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config();

const PORT = 4700;

const app = express();
app.use(cors());
app.use(express.json());

function generateToken(payload){
    const token = jwt.sign({payload }, process.env.JWT_SECRET )
    return token
}

function decoder(token){
    const decoder = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoder);
}

app.post('/register',(req,res)=>{
    const {name , email , age , password} = req.body;

    model.findOne({ email })
    .then(user =>{
        if(user){
            res.status(404).json({msg : "Email id already found"})
        }
        else{
            bcrypt.hash(password , 10)
            .then(hashedpassword => {
                return model.create({
                    name,
                    age,
                    email,
                    password : hashedpassword
                })
            })

            .then(users => res.json(users))
            .catch(err => res.json(err))
            
        }
    })
})

app.post('/login', (req,res)=>{
    const {email , password } = req.body;

    model.findOne({ email })
    .then(user => {
        if(!user){
            res.status(404).json({msg : "Email ID is not found"})
        }
        else{
            bcrypt.compare(password , user.password)
            .then(password => {
                if(!password){
                    res.status(404).json({msg : "Invalid user credintials"})
                }
                else{
                    const payload = user.id;
                    const token = generateToken(payload)
                    decoder(token)
                    res.status(200).json({
                        msg : "Log In successfully..",
                        token : token
                    })
                }
            })
        }
    })
})

app.listen(PORT, (req,res)=>{
    console.log("Server is running at ", PORT);
})