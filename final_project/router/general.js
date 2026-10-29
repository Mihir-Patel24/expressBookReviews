const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// ===== TASK 6: Register a new user =====
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  if (isValid(username)) {
    users.push({ username, password });
    return res.status(200).json({ message: `User ${username} successfully registered. You can now log in.` });
  } else {
    return res.status(404).json({ message: "User already exists!" });
  }
});

// ===== TASK 1: Get the book list available in the shop =====
public_users.get('/', function (req, res) {
  return res.status(200).json(books);
});

// ===== TASK 2: Get book details based on ISBN =====
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(books[isbn]);
  } else {
    return res.status(404).json({ message: `Book with ISBN ${isbn} not found.` });
  }
});

// ===== TASK 3: Get book details based on Author =====
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  const booksByAuthor = Object.values(books).filter(
    (book) => book.author.toLowerCase() === author.toLowerCase()
  );
  if (booksByAuthor.length > 0) {
    return res.status(200).json(booksByAuthor);
  } else {
    return res.status(404).json({ message: `No books found for author: ${author}` });
  }
});

// ===== TASK 4: Get all books based on Title =====
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  const booksByTitle = Object.values(books).filter(
    (book) => book.title.toLowerCase() === title.toLowerCase()
  );
  if (booksByTitle.length > 0) {
    return res.status(200).json(booksByTitle);
  } else {
    return res.status(404).json({ message: `No books found with title: ${title}` });
  }
});

// ===== TASK 5: Get book review =====
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  } else {
    return res.status(404).json({ message: `Book with ISBN ${isbn} not found.` });
  }
});

// ===== TASK 10: Get all books using async/await with Axios =====
public_users.get('/async/books', async (req, res) => {
  try {
    const response = await axios.get('http://localhost:5000/');
    return res.status(200).json({
      message: "Books retrieved using async/await",
      books: response.data
    });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books", error: error.message });
  }
});

// ===== TASK 11: Get book by ISBN using async/await with Axios =====
public_users.get('/async/isbn/:isbn', async (req, res) => {
  const isbn = req.params.isbn;
  try {
    const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
    return res.status(200).json({
      message: `Book with ISBN ${isbn} retrieved using async/await`,
      book: response.data
    });
  } catch (error) {
    return res.status(404).json({ message: `Book with ISBN ${isbn} not found`, error: error.message });
  }
});

// ===== TASK 12: Get books by Author using async/await with Axios =====
public_users.get('/async/author/:author', async (req, res) => {
  const author = req.params.author;
  try {
    const response = await axios.get(`http://localhost:5000/author/${encodeURIComponent(author)}`);
    return res.status(200).json({
      message: `Books by author "${author}" retrieved using async/await`,
      books: response.data
    });
  } catch (error) {
    return res.status(404).json({ message: `No books found for author: ${author}`, error: error.message });
  }
});

// ===== TASK 13: Get books by Title using async/await with Axios =====
public_users.get('/async/title/:title', async (req, res) => {
  const title = req.params.title;
  try {
    const response = await axios.get(`http://localhost:5000/title/${encodeURIComponent(title)}`);
    return res.status(200).json({
      message: `Books with title "${title}" retrieved using async/await`,
      books: response.data
    });
  } catch (error) {
    return res.status(404).json({ message: `No books found with title: ${title}`, error: error.message });
  }
});

module.exports.general = public_users;
