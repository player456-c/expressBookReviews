const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const PORT = require("../index.js");


// Register a new user
public_users.post("/register", (req, res)=>{
    const username=req.body.username;
    const password=req.body.password;

    // Check if both username and password are provided
    if(username && password){
        // Check if the user does not already exist
        if(!isValid(username)){
            // Add the new user to the users array
            users.push({
                "username": username,
                "password": password
            });
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        }else{
            return res.status(404).json({message: "User already exists!"});
        };
    };
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});
});


// Get the book list available in the shop (sync)
public_users.get('/',function (req, res){
    return res.status(200).json(books);
});

// Get the book list available in the shop (async)
public_users.get('/async', async function (req,res){
    try{
        let response=await axios.get(`http://localhost:5000/`);
        console.log(response.data);
        return res.status(200).json(response.data);

    }catch(error){
        console.error(error);
        return res.status(500).json({message: "Error getting book list"});
    };
});


// Get book details based on ISBN (sync)
public_users.get('/isbn/:isbn',function (req, res){
    const isbn=req.params.isbn;
    return res.status(200).json(books[isbn]);
});

// Get book details based on ISBN (async)
public_users.get('/async/isbn/:isbn', async function (req, res){
    try{
        const isbn=req.params.isbn;
        let response=await axios.get(`http://localhost:5000/isbn/${isbn}`);
        //console.log(response.data);
        return res.status(200).json(response.data);
    }catch(err){
        console.error(err);
        return res.status(500).json({message: "Error getting book by isbn"});
    };
});


// Get book details based on author (sync)
public_users.get('/author/:author',function (req, res){
    const author=req.params.author;
    let filtered_books=[];

    Object.keys(books).forEach((key)=>{
        if(books[key].author===author){
            filtered_books.push(books[key]);
        };
    });

    return res.status(200).json(filtered_books);
});

// Get book details based on author (async)
public_users.get('/async/author/:author', async function (req, res){
    try{
        const author=req.params.author;
        let response=await axios.get(`http://localhost:5000/author/${author}`);
        //console.log(response.data);
        return res.status(200).json(response.data);
    }catch(err){
        console.error(err);
        return res.status(500).json({message: "Error getting books by author"});
    };
});


// Get all books based on title (sync)
public_users.get('/title/:title',function (req, res){
    const title=req.params.title;
    let filtered_books=[];

    Object.keys(books).forEach((key)=>{
        if(books[key].title===title){
            filtered_books.push(books[key]);
        };
    });

    return res.status(200).json(filtered_books);
});

// Get all books based on title (async)
public_users.get('/async/title/:title', async function (req, res){
    try{
        const title=req.params.title;
        let response=await axios.get(`http://localhost:5000/title/${title}`);
        //console.log(response.data);
        return res.status(200).json(response.data);
    }catch(err){
        console.error(err);
        return res.status(500).json({message: "Error getting books by title"});
    };
});


//  Get book review (sync)
public_users.get('/review/:isbn',function (req, res){
    const isbn=req.params.isbn;
    /* let filtered_books=[];
    //console.log(isbn);

    Object.keys(books).forEach((key)=>{
        console.log(key);
        if(key===isbn){
            filtered_books.push(books[key]['reviews']);
        };
    });
    console.log("end\n"); */

    return res.status(200).json(books[isbn]['reviews']);
    //return res.status(200).json(filtered_books);
});


module.exports.general = public_users;
