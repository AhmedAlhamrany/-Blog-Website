const fs = require("fs"); // required at the top of your module

var posts = [];
var categories = [];

function initialize()  {
 
    return new Promise((resolve,reject) => 
    {

         fs.readFile('./data/posts.json', 'utf8', (err, data) => {
            if (err) throw err;
            posts = JSON.parse(data)
          
           fs.readFile('./data/categories.json', 'utf8', (err, data) => {
                if (err) throw err;
                categories = JSON.parse(data)

                if(categories.length != 0 && posts.length != 0)
                {
                    resolve("Data has been fetched"); 
                }
                else if(categories.length == 0 || posts.length == 0)
                {
                    reject("Error: Data has not been fetched");
                }
            });
        });
    });
}

function getAllPosts() {

    var getAllPost = [];

    return new Promise((resolve,reject) =>
    {
        
        for(var i = 0; i < posts.length; i++)
        {
            getAllPost.push(posts[i]);
        }

        if(getAllPost.length != 0)
        {
            resolve(getAllPost);
        }
        else if(getAllPost.length == 0)
        {
            reject("no results returned");
        }
    });
}

function getPublishedPosts()
{
    var publishedPosts = []

    return new Promise((resolve,reject) =>
    {

        for(var i = 0; i < posts.length; i++)
        {
            if(posts[i].published == true)
            {
                publishedPosts.push(posts[i]);
            }
        }
    
        if(publishedPosts.length != 0)
        {
            resolve(publishedPosts);
        }
        else if(publishedPosts.length == 0)
        {
            reject("no results returned");
        }
    });
}

function getCategories()
{
    var fullCategory = [];

    return new Promise((resolve,reject) => 
    {
        
        for(var i = 0; i < categories.length; i++)
        {
            fullCategory.push(categories[i]);
        }

        if(fullCategory.length != 0)
        {
            resolve(fullCategory);
        }
        else if(fullCategory.length == 0)
        {
            reject("no results returned");
        }
    });
}

function addPost(postData)
{

    return new Promise((resolve, reject) =>
    {

        if(postData.published == null)
        {
            postData.published = false;
        }
        else
        {
            postData.published = true;
        }

        var date = new Date();
        var formatDate = date.toISOString().substring(0,10);

        postData.id = posts.length + 1;
        postData.postDate = formatDate;

        var data = posts.push(postData);

        resolve(data);
    });
}

function getPostsByCategory(category)
{
    var categoryId = [];

    return new Promise((resolve, reject) => 
    {

      for(var i = 0; i < posts.length; i++)
      {
        if(posts[i].category == category)
        {
            categoryId.push(posts[i])
        }
      }
      
      if(categoryId.length == 0)
      {
        reject("no results returned");
      }
       
      resolve(categoryId);
      
    });
}

function getPostsByMinDate(minDateStr)
{
    var date = [];

    return new Promise((resolve, reject) => 
    {

        for(var i = 0; i < posts.length; i++)
        {
            if(new Date(posts[i].postDate) >= new Date(minDateStr))
            {
                console.log("The postDate value is greater than minDateStr");
                date.push(posts[i]);
            }
        }

        if(date.length == 0)
        {
            reject("no results returned");
        }

        resolve(date);
    });
}

function getPostById(id)
{
    var ID = [];

    return new Promise((resolve,reject)=>{ //from generic Assignment 3 solution
        ID = posts.find(post => post.id == id);

        if(ID){
            resolve(ID);
        }else{
            reject("no result returned");
        }
    });
}

function getPublishedPostsByCategory(category) {

    var publishedPost = []

    return new Promise((resolve,reject) =>
    {

        for(var i = 0; i < posts.length; i++)
        {
            if(posts[i].published == true && posts[i].category == category)
            {
                publishedPost.push(posts[i]);
            }
        }
    
        if(publishedPost.length != 0)
        {
            resolve(publishedPost);
        }
        else if(publishedPost.length == 0)
        {
            reject("no results returned");
        }
    });
}

module.exports = {initialize, getAllPosts, getPublishedPosts, getCategories, addPost, getPostsByCategory, getPostsByMinDate, getPostById, getPublishedPostsByCategory};