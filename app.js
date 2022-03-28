//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const { append } = require("express/lib/response");
const mogoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const { default: mongoose } = require("mongoose");


mongoose.connect("mongodb://localhost/userDB");

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

const secret = process.env.SECRET;


const User = mongoose.model("User",userSchema);

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));

app.get("/",function(req,res){
    res.render("home");
});


app.get("/login",function(req,res){
    res.render("login");
});


app.get("/register",function(req,res){
    res.render("register");
});

app.post("/register", function (req, res) {
    bcrypt.hash(myPlaintextPassword, saltRounds, function (err, hash) {
        if (!err) {
            const newUser = new User({
                email: req.body.username,
                password: hash
            });
            newUser.save(function (err) {
                if (err) {
                    console.log(err);
                } else {
                    res.render("secrets");
                }
            });
        } else {
            console.log(err);
        }
    });
});


app.post("/login",function(req,res){
    const username = req.body.username;
    const password = req.body.password;
    User.findOne({email: username},function(err,foundUser){
        if(err) {
            console.log(err);
        } else {
            if(foundUser) {
                bcrypt.compare(password, foundUser.password, function(err, result) {
                    if(!err) {
                        if(result===true) {
                            res.render("secrets");
                        }
                    } else {
                        console.log(err);
                    }
                });
            }
        }
    });
});

app.listen(3000,function(){
    console.log("Server is started on port 3000");
});