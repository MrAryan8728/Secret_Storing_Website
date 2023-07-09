//jshint esversion:6'
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose")
const encrypt = require("mongoose-encryption")
// const md5 = require("md5")
//Now we will use bcrypt to secure our password with combination of hashing and salting.
const bcrypt = require('bcrypt');
const saltRounds = 10;

const app = express();

app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({
    extended:true
}));

mongoose.connect('mongodb://127.0.0.1:27017/UserDB')
  .then(() => console.log('Connected!'));

const userSchema = new mongoose.Schema({
    email:String,
    password:String
});
//Level 3 security using .env inside 
// userSchema.plugin(encrypt,{secret:process.env.SECRET ,encryptedFields:['password'] });

const User = mongoose.model("user",userSchema)

app.get("/",function(req,res){
    res.render("home")
});

app.get("/login",function(req,res){
    res.render("login")
})

app.get("/register",function(req,res){
    res.render("register")
})

app.post("/register",function(req,res){

    bcrypt.hash(req.body.password,saltRounds,function(err,hash){
        const newUser = User({
            email:req.body.username,
            //Hashing password using the hashing of password on both case as 
            //hash of a number of pass always remain same.
            //password:md5(req.body.password)
            password:hash
        })
    
        newUser.save().then(function(result){
            if(result){
                res.render("secrets");
            }else{
                console.log("Error");
            }
        })
    });

})

app.post("/login",function(req,res){
    const username = req.body.username;
    const password = req.body.password

    User.findOne({email:username}).then(function(result){
        if(result){
            // if(result.password === password){
            // res.render("secrets")
            // }
            bcrypt.compare(password,result.password,function(err,RESULT){
                if(RESULT === true){
                    res.render("secrets")
                }
            })
            
        }else{
            console.log("Error Occured !!")
        }
    })
})

app.listen(3000,function(){
    console.log("server started at 3000")
})

