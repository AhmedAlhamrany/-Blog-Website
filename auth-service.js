const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
var Schema = mongoose.Schema;

var userSchema = new Schema({

    "userName" : { "type": String, "unique": true},
    "password" : String,
    "email" : String,
    "loginHistory" : [{ "dateTime": Date, "userAgent" : String}]
});

let User;

module.exports.initialize = function () {
    return new Promise(function (resolve, reject) {
        let db = mongoose.createConnection("mongodb+srv://aalhamrany:DkeYg9jCPP4xav2W@senecaweb.qx5ke23.mongodb.net/test");

        db.on('error', (err)=>{
            reject(err); // reject the promise with the provided error
        });
        db.once('open', ()=>{
           User = db.model("users", userSchema);
           resolve();
        });
    });
};

module.exports.registerUser = function(userData){ 

    return new Promise(function (resolve, reject){

        if(userData.password == userData.password2)
        {

            bcrypt.hash(userData.password, 10).then(hash=>{ // Hash the password using a Salt that was generated using 10 rounds
                // TODO: Store the resulting "hash" value in the DB
                userData.password = hash;

                let newUser = new User(userData);

                newUser.save().then(()=>{
                    resolve();
                }).catch(err=>{
                    if(err.code == 11000)
                    {
                        reject("User Name already taken")
                    }
                    else
                    {
                        reject("There was an error creating the user: " + err)
                    }
                });
            })
            .catch(err=>{
                console.log(err); // Show any errors that occurred during the process
                reject("There was an error encrypting the password");
            });
        }
        else
        {
            reject("Passwords do not match");
        }
    });
}

module.exports.checkUser = function(userData){

    return new Promise(function (resolve, reject){

        User.find({ userName: userData.userName }).exec().then((user)=>{
            
            if(user.length === 0)
            {
                reject("Unable to find user: " + userData.userName);
            }

                bcrypt.compare(userData.password, user[0].password).then((result) => {
                    // result === true if it matches and result === false if it does not match
                    if(result === true)
                    {
                        user[0].loginHistory.push({dateTime: (new Date()).toString(), userAgent: userData.userAgent});

                        User.updateOne({userName: user[0].userName}, {$set:{ loginHistory: user[0].loginHistory}}).exec().then(()=>{

                            resolve(user[0]);
                        }).catch((err)=>{

                            reject("There was an error verifying the user: " + err);
                        });
                    }
                    else if(result === false)
                    {
                        reject("Incorrect Password for user: " + userData.userName);
                    }
                });
            
        }).catch(()=>{

            reject("Unable to find user: " + userData.userName);
        });
    });
}