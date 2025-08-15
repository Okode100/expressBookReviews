const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
  if (username.length >= 3) {
    return true;
  }
  return false;
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  let validusers = users.filter((user)=>{
    return (user.username === username && user.password === password)
  });
  if(validusers.length > 0){
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  
  if (!username || !password) {
    return res.status(400).json({message: "Username and password are required"});
  }
  
  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({
      data: username
    }, 'fingerprint_customer', { expiresIn: 60 * 60 });
    
    req.session.authorization = {
      accessToken, username
    }
    return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const review = req.body.review;
  const username = req.user.data; // Get username from JWT token
  
  if (!books[isbn]) {
    return res.status(404).json({message: "Book not found"});
  }
  
  if (!review) {
    return res.status(400).json({message: "Review text is required"});
  }
  
  // Add or update the review
  books[isbn].reviews[username] = review;
  
  return res.status(200).json({message: "Review added successfully"});
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.user.data; // Get username from JWT token
  
  if (!books[isbn]) {
    return res.status(404).json({message: "Book not found"});
  }
  
  if (!books[isbn].reviews[username]) {
    return res.status(404).json({message: "No review found for this user on this book"});
  }
  
  // Delete the user's review
  delete books[isbn].reviews[username];
  
  return res.status(200).json({message: "Review deleted successfully"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
