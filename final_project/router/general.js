const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  
  // Check if username and password are provided
  if (!username || !password) {
    return res.status(400).json({message: "Username and password are required"});
  }
  
  // Check if username already exists
  if (users.find(user => user.username === username)) {
    return res.status(409).json({message: "Username already exists"});
  }
  
  // Add new user
  users.push({username: username, password: password});
  return res.status(200).json({message: "User registered successfully"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.status(200).json(JSON.stringify(books, null, 2));
});

// Task 10: Get the book list available in the shop using Promise callbacks or async-await with Axios
public_users.get('/async', async function (req, res) {
  try {
    // Simulate async operation with Promise
    const getBooksAsync = () => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (books) {
            resolve(books);
          } else {
            reject(new Error('Books not found'));
          }
        }, 100);
      });
    };
    
    const booksData = await getBooksAsync();
    return res.status(200).json(JSON.stringify(booksData, null, 2));
  } catch (error) {
    return res.status(500).json({message: "Error fetching books", error: error.message});
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(JSON.stringify(books[isbn], null, 2));
  } else {
    return res.status(404).json({message: "Book not found"});
  }
 });

// Task 11: Get book details based on ISBN using Promise callbacks or async-await with Axios
public_users.get('/async/isbn/:isbn', async function (req, res) {
  try {
    const isbn = req.params.isbn;
    
    // Simulate async operation with Promise
    const getBookByIsbnAsync = (isbn) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (books[isbn]) {
            resolve(books[isbn]);
          } else {
            reject(new Error('Book not found'));
          }
        }, 100);
      });
    };
    
    const bookData = await getBookByIsbnAsync(isbn);
    return res.status(200).json(JSON.stringify(bookData, null, 2));
  } catch (error) {
    if (error.message === 'Book not found') {
      return res.status(404).json({message: "Book not found"});
    }
    return res.status(500).json({message: "Error fetching book", error: error.message});
  }
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
  const matchingBooks = {};
  
  // Iterate through all books and check if author matches
  for (let isbn in books) {
    if (books[isbn].author.toLowerCase().includes(author.toLowerCase())) {
      matchingBooks[isbn] = books[isbn];
    }
  }
  
  if (Object.keys(matchingBooks).length > 0) {
    return res.status(200).json(JSON.stringify(matchingBooks, null, 2));
  } else {
    return res.status(404).json({message: "No books found by this author"});
  }
});

// Task 12: Get book details based on Author using Promise callbacks or async-await with Axios
public_users.get('/async/author/:author', async function (req, res) {
  try {
    const author = req.params.author;
    
    // Simulate async operation with Promise
    const getBooksByAuthorAsync = (author) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const matchingBooks = {};
          
          // Iterate through all books and check if author matches
          for (let isbn in books) {
            if (books[isbn].author.toLowerCase().includes(author.toLowerCase())) {
              matchingBooks[isbn] = books[isbn];
            }
          }
          
          if (Object.keys(matchingBooks).length > 0) {
            resolve(matchingBooks);
          } else {
            reject(new Error('No books found by this author'));
          }
        }, 100);
      });
    };
    
    const booksData = await getBooksByAuthorAsync(author);
    return res.status(200).json(JSON.stringify(booksData, null, 2));
  } catch (error) {
    if (error.message === 'No books found by this author') {
      return res.status(404).json({message: "No books found by this author"});
    }
    return res.status(500).json({message: "Error fetching books by author", error: error.message});
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  const matchingBooks = {};
  
  // Iterate through all books and check if title matches
  for (let isbn in books) {
  if (books[isbn].title.toLowerCase().includes(title.toLowerCase())) {
      matchingBooks[isbn] = books[isbn];
    }
  }
  
  if (Object.keys(matchingBooks).length > 0) {
    return res.status(200).json(JSON.stringify(matchingBooks, null, 2));
  } else {
    return res.status(404).json({message: "No books found with this title"});
  }
});

// Task 13: Get book details based on Title using Promise callbacks or async-await with Axios
public_users.get('/async/title/:title', async function (req, res) {
  try {
    const title = req.params.title;
    
    // Simulate async operation with Promise
    const getBooksByTitleAsync = (title) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const matchingBooks = {};
          
          // Iterate through all books and check if title matches
          for (let isbn in books) {
            if (books[isbn].title.toLowerCase().includes(title.toLowerCase())) {
              matchingBooks[isbn] = books[isbn];
            }
          }
          
          if (Object.keys(matchingBooks).length > 0) {
            resolve(matchingBooks);
          } else {
            reject(new Error('No books found with this title'));
          }
        }, 100);
      });
    };
    
    const booksData = await getBooksByTitleAsync(title);
    return res.status(200).json(JSON.stringify(booksData, null, 2));
  } catch (error) {
    if (error.message === 'No books found with this title') {
      return res.status(404).json({message: "No books found with this title"});
    }
    return res.status(500).json({message: "Error fetching books by title", error: error.message});
  }
});

// Additional Promise-based endpoints demonstrating different patterns
// Promise with .then() and .catch() pattern
public_users.get('/promise/books', function (req, res) {
  const getBooksPromise = () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (books) {
          resolve(books);
        } else {
          reject(new Error('Books not found'));
        }
      }, 150);
    });
  };
  
  getBooksPromise()
    .then(booksData => {
      res.status(200).json(JSON.stringify(booksData, null, 2));
    })
    .catch(error => {
      res.status(500).json({message: "Error fetching books", error: error.message});
    });
});

// Axios demonstration endpoint (simulating external API call)
public_users.get('/axios/books', async function (req, res) {
  try {
    // Simulate external API call with Axios
    const simulateAxiosCall = () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(books);
        }, 200);
      });
    };
    
    const booksData = await simulateAxiosCall();
    return res.status(200).json(JSON.stringify(booksData, null, 2));
  } catch (error) {
    return res.status(500).json({message: "Error with Axios call", error: error.message});
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(JSON.stringify(books[isbn].reviews, null, 2));
  } else {
    return res.status(404).json({message: "Book not found"});
  }
});

module.exports.general = public_users;
