const Sequelize = require('sequelize');

var sequelize = new Sequelize('wakzxfzs', 'wakzxfzs', '0gHXdYDYYnP-OLWEw6W6MKJxCl8bPi5Z', {
    host: 'ruby.db.elephantsql.com',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: { rejectUnauthorized: false }
    },
    query: { raw: true },
    logging: false
    });

    var Post = sequelize.define('Post', {
        body: Sequelize.TEXT,
        title: Sequelize.STRING,
        postDate: Sequelize.DATE,
        featureImage: Sequelize.STRING,
        published: Sequelize.BOOLEAN
    });

    var Category = sequelize.define('Category', {
        category: Sequelize.STRING
    });

    Post.belongsTo(Category, {foreignKey: 'category'});

module.exports.initialize = function () {

    return new Promise((resolve, reject) => {

        sequelize.sync().then(function (Post) {
            resolve(Post);
        }).then(function (Category){
            resolve(Category);
        }).catch(function (err){
            reject("unable to sync the database" + err);
        });
    });
}

module.exports.getAllPosts = function(){

    return new Promise((resolve,reject)=>{
       
        sequelize.sync().then(function () {

            Post.findAll().then(function (data){
                resolve(data);
            }).catch(function (err){
                reject("no results returned");
            });
        });
    });
}

module.exports.getPostsByCategory = function(category){

    return new Promise((resolve,reject)=>{
       
        sequelize.sync().then(function () {

           Post.findAll({
                where: { category: category}

            }).then(function (data){
                resolve(data);
            }).catch(function (err){
                reject("no results returned");
            });
        });
    });
}

module.exports.getPostsByMinDate = function(minDateStr) {

    return new Promise((resolve, reject) => {

        sequelize.sync().then(function () {
        const { gte } = Sequelize.Op;

           Post.findAll({
            where: {postDate: {[gte]: new Date(minDateStr)}}

           }).then(function (data){
               resolve(data);
           }).catch(function (err){
            reject("no results returned");
           });
        });
    });
}

module.exports.getPostById = function(id){

    return new Promise((resolve,reject)=>{
       
         sequelize.sync().then(function () {

            Post.findAll({
                where: { id: id}
    
            }).then(function (data){
                resolve(data[0]);
            }).catch(function (err){
                reject("no results returned");
            });
        });
    });
}

module.exports.addPost = function(postData){

    postData.published = postData.published = (postData.published) ? true : false;

    return new Promise((resolve,reject)=>{

        sequelize.sync().then(function (){

            var i;

            for(i in postData)
            {
                if(postData[i] == "")
                {
                    postData[i] = null;
                }
            }

            var postDate = new Date();

            Post.create({
                body: postData.body,
                title: postData.title,
                postDate: postDate,
                category: postData.category,
                featureImage: postData.featureImage,
                published: postData.published

            }).then(function (data){
                resolve(data);
            }).catch(function (err){
                reject("unable to create post");
            });
        });
    });
}

module.exports.getPublishedPosts = function(){

    return new Promise((resolve,reject)=>{
 
        sequelize.sync().then(function () {

            Post.findAll({
                where: { published: true}

            }).then(function (data){
                resolve(data);
            }).catch(function (err){
                reject("no results returned");
            });
        });
    });
}

module.exports.getPublishedPostsByCategory = function(category){
    
    return new Promise((resolve,reject)=>{
      
        sequelize.sync().then(function () {

           Post.findAll({
                where: { category: category, published: true}

            }).then(function (data){
                resolve(data);
            }).catch(function (err){
                reject("no results returned");
            });
        });
    });
}

module.exports.getCategories = function(){

    return new Promise((resolve,reject)=>{

        sequelize.sync().then(function (){

            Category.findAll().then(function (data){
                resolve(data);
            }).catch(function (err){
                reject("no results returned");
            });
        });
    });
}

module.exports.addCategory = function(categoryData){

    return new Promise((resolve,reject)=>{

        sequelize.sync().then(function (){

            var i;

            for(i in categoryData)
            {
                if(categoryData[i] == "")
                {
                    categoryData[i] = null;
                }
            }

            Category.create({
                category: categoryData.category

            }).then(function (data){
                resolve(data);
            }).catch(function (err){
                reject("unable to create category");
            });
        });
    });
}

module.exports.deleteCategoryById = function(id){

    return new Promise((resolve,reject)=>{
        sequelize.sync().then(function (){

            Category.destroy({
                where: {id : id}

            }).then(function(){
                resolve("destroyed");
            }).catch(function (err){
                reject("Reject");
            });
        });
    });
}

module.exports.deletePostById = function(id){

    return new Promise((resolve, reject) =>{

        sequelize.sync().then(function (){

            Post.destroy({
                where: {id : id}

            }).then(function (){
                resolve("destroyed");
            }).catch(function (err){
                reject("Reject");
            });
        });
    });
}
