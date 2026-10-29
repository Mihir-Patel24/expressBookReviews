const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

// Check if username is valid (not already taken)
const isValid = (username) => {
  let usersWithSameName = users.filter((user) => user.username === username);
  if (usersWithSameName.length > 0) {
    return false; // username already exists
  }
  return true;
};

// Check if username and password match records
const authenticatedUser = (username, password) => {
  let validUsers = users.filter((user) => {
    return (user.username === username && user.password === password);
  });
  if (validUsers.length > 0) {
    return true;
  }
  return false;
};

// Login for registered users
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in: username and password required" });
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign(
      { data: password },
      'access',
      { expiresIn: 60 * 60 }
    );
    req.session.authorization = {
      accessToken,
      username
    };
    return res.status(200).json({ message: "User successfully logged in", token: accessToken });
  } else {
    return res.status(208).json({ message: "Invalid Login. Check username and password." });
  }
});

// Add or modify a book review (authenticated users only)
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.session.authorization.username;

  if (books[isbn]) {
    books[isbn].reviews[username] = review;
    return res.status(200).json({
      message: `Review for book with ISBN ${isbn} has been added/updated.`,
      reviews: books[isbn].reviews
    });
  } else {
    return res.status(404).json({ message: `Book with ISBN ${isbn} not found.` });
  }
});

// Delete a book review (authenticated users only)
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization.username;

  if (books[isbn]) {
    if (books[isbn].reviews[username]) {
      delete books[isbn].reviews[username];
      return res.status(200).json({
        message: `Review for book with ISBN ${isbn} by user ${username} deleted successfully.`
      });
    } else {
      return res.status(404).json({ message: `No review found for user ${username} on ISBN ${isbn}.` });
    }
  } else {
    return res.status(404).json({ message: `Book with ISBN ${isbn} not found.` });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
