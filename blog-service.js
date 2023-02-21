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

        postData.id = posts.length + 1;
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
    var ID =  [];

    return new Promise((resolve, reject) => 
    {

        for(var i = 0; i < posts.length; i++)
        {
            if(posts[i].id == id)
            {
                ID.push(posts[i]);
            }
        }

        if(ID.length == 0)
        {
            reject("no results returned");
        }

        resolve(ID);
    });
}

module.exports = {initialize, getAllPosts, getPublishedPosts, getCategories, addPost, getPostsByCategory, getPostsByMinDate, getPostById};