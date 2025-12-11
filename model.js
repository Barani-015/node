const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/e-commerce')

const schema = new mongoose.Schema({
    name:String,
    age:Number,
    email:String,
    password:String
})

const model = new mongoose.model("users", schema)

module.exports = model