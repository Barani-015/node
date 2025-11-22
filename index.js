const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const bcrypt = require('bcrypt')

mongoose.connect('mongodb://localhost:27017/crud-example')


const schema = new mongoose.Schema(
    {
        username : String,
        password : String
    }
)

const model = new mongoose.model("users", schema)

const app = express();
app.use(cors())
app.use(express.json())

const PORT = 5678;

app.get('/',(req,res)=>{
    res.json({ msg: "Server is hosting successfully..." })
})

app.post('/register',(req,res)=>{
    const { username , password} = req.body;

    bcrypt.hash(password , 10)
    .then(hashedpassword => {
        return model.create({
            username,
            password : hashedpassword
        })
    })
    
    .then(users => res.json(users))
    .catch(err => res.json(err))
})

app.post('/login',(req,res)=>{
    const { username , password } = req.body;

    model.findOne({username})
    .then(user => {
        if(!user){
            res.status(400).json({msg:"username not found"})
        }
        bcrypt.compare(password , user.password)
        .then(isMatch => {
                if(!isMatch){
                res.status(401).json({msg : "invalid password"})
            }
            else{
                res.json({
                    msg : "login successfully",
                    user: {
                        id : user._id,
                        username : user.username

                    }
                })
            }
        })

        

    })
})


app.listen(PORT , (req,res)=>{
    console.log("server is running at htpp://localhost:",PORT);
})