const express = require('express');
const axios = require('axios');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users=[];


const isValid=(username)=>{ //returns boolean
    let usersWithSameName=users.find((user)=>{
        return (user.username===username);
    });
    //console.log(!!usersWithSameName);

    return !!usersWithSameName;
};

const authenticatedUser=(username,password)=>{ //returns boolean
    const validUsers=users.find((user)=>{
        return (user.username===username && user.password===password);
    });
    //console.log(`Inside authUser: ${username}, ${password}, [${validUsers}], [${users[0]}]`);
    //console.log(!!validUsers);

    return !!validUsers;
};


//only registered users can login
regd_users.post("/login", (req, res)=>{
    //console.log("Logging in...")
    const username=req.body.username;
    const password=req.body.password;
    //console.log(`Inside login:    ${username}, ${password}, ${JSON.stringify(req.body)}`);

    // Check if username or password is missing
    if(!username || !password){
        return res.status(404).json({ message: "Error logging in: username or password is missing." });
    };

    // Authenticate user
    if(authenticatedUser(username, password)){
        // Generate JWT access token
        let accessToken=jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });

        // Store access token and username in session
        req.session.authorization={
            accessToken, username
        };
        return res.status(200).send("User successfully logged in");
    }else{
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    };
});


// Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res)=>{
    const isbn=req.params.isbn;
    const content=req.query.content;
    const user=req.session.authorization['username'];
    //console.log(`${isbn}`);

    let message="";
    if(books[isbn]['reviews'][user]===undefined){
        message=`Your review on book with ISBN ${isbn} has been added. If you want to update your review, simply write a new one.`;
    }else{
        message=`Your review on book with ISBN ${isbn} has been updated.`;
    };

    books[isbn]['reviews'][user]=content;
    /* books[isbn]['reviews'][user]={
        "content": content
    }; */
    return res.status(200).json(message);
});


// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res)=>{
    const isbn=req.params.isbn;
    const user=req.session.authorization['username'];
    //console.log(`${isbn}`);

    let message="";
    if(books[isbn]['reviews'][user]===undefined){
        message=`You don't have a review on book with ISBN ${isbn}.`;
    }else{
        delete books[isbn]['reviews'][user];
        message=`Your review on book with ISBN ${isbn} has been deleted.`;
    };

    return res.status(200).json(message);
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
