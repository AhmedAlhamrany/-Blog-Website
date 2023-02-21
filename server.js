/*********************************************************************************
*  WEB322 – Assignment 03
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part 
*  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: Ahmed Alhamrany Student ID: 144654217 Date: 2/20/2023
*
*  Cyclic Web App URL: ________________________________________________________
* 
*  GitHub Repository URL: ______________________________________________________
*
********************************************************************************/ 



var express = require("express");
var app = express();
var path = require("path");
var blog = require("./blog-service.js");
var multer = require("multer");
var cloudinary = require("cloudinary").v2;
var streamifier = require("streamifier");

cloudinary.config({
    cloud_name: 'dnsozvyrl',
    api_key: '712444667688893',
    api_secret: 'eyQ0wFCD7aDfgRdmZKA9a3bdyGQ',
    secret: true
})

const upload = multer(); // no { storage: storage }

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

app.get("/posts/add", function(req,res){
    res.sendFile(path.join(__dirname,"/views/addPost.html"));
});

app.post("/posts/add", upload.single("featureImage"), function(req, res){
    
    if(req.file){
        let streamUpload = (req) => {
            return new Promise((resolve, reject) => {
                let stream = cloudinary.uploader.upload_stream(
                    (error, result) => {
                        if (result) {
                            resolve(result);
                        } else {
                            reject(error);
                        }
                    }
                );
    
                streamifier.createReadStream(req.file.buffer).pipe(stream);
            });
        };
    
        async function upload(req) {
            let result = await streamUpload(req);
            console.log(result);
            return result;
        }
    
        upload(req).then((uploaded)=>{
            processPost(uploaded.url);
        });
    }else{
        processPost("");
    }
     
    function processPost(imageUrl){
        req.body.featureImage = imageUrl;

          // TODO: Process the req.body and add it as a new Blog Post before redirecting to /posts
            formData = req.body;

            blog.addPost(formData).then(()=>{
                res.redirect("/posts");
            }).catch((err)=>{
                res.send({message: err})
            });
    }    
});

app.get("/blog", function(req,res){
    blog.getPublishedPosts().then((data)=>{
        res.send(data);
    }).catch((err)=>{
        res.send({message: err})
    });
});

app.get("/posts", function(req,res){

     category = req.query.category;
     minDateStr = req.query.minDate;

    if(!category && !minDateStr)
    {
    blog.getAllPosts().then((data)=>{
        res.send(data);
    }).catch((err)=>{
        res.send({message: err})
    });
    }
    else if(category)
    {
        blog.getPostsByCategory(category).then((data)=>{
            res.send(data);
            console.dir(category);
        }).catch((err)=>{
            res.send({message: err})
        });
    }
    else if(minDateStr)
    {
        blog.getPostsByMinDate(minDateStr).then((data)=>{
            res.send(data);
            console.dir(minDateStr);
        }).catch((err)=>{
            res.send({message: err})
        });
    }
});

app.get("/posts/:value", function(req,res){

    id = req.params.value;

    blog.getPostById(id).then((data)=>{
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

