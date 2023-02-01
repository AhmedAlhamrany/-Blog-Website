/*********************************************************************************
*  WEB322 – Assignment 02
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part *  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: Ahmed Alhamrany Student ID: 144654217 Date: 2/1/2023
*
*  Cyclic Web App URL: ________________________________________________________
*
*  GitHub Repository URL: https://github.com/AhmedAlhamrany/web322-app
*
********************************************************************************/ 


var express = require("express");
var app = express();
var path = require("path");
var blog = require("./blog-service.js");

var HTTP_PORT = process.env.PORT || 8080;

function onHttpStart() {
    console.log("Express http server listening on: " + HTTP_PORT);
}

app.use(express.static('public')); 

app.get("/", function(req,res) {
    res.redirect("/about");
});

app.get("/about", function(req,res){
    res.sendFile(path.join(__dirname,"/views/about.html"));
});

app.get("/blog", function(req,res){
    blog.getPublishedPosts().then((data)=>{
        res.send(data);
    }).catch((err)=>{
        res.send({message: err})
    });
});

app.get("/posts", function(req,res){
    blog.getAllPosts().then((data)=>{
        res.send(data);
    }).catch((err)=>{
        res.send({message: err})
    });
});

app.get("/categories", function(req,res){
    blog.getCategories().then((data)=>{
        res.send(data);
    }).catch((err)=>{
        res.send({message: err})
    });
});

app.use(function(req,res){
    res.status(404).send("Sorry, page has not been found!");
});

blog.initialize().then((resolve)=>{
    app.listen(HTTP_PORT, onHttpStart);
    console.log(resolve);
}).catch((reject)=>{
    console.log(reject);
});

