const crypto = require("crypto");
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const { type } = require("os");

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "A book must have a title"],
    trim: true,
  },
  author: {
    type: String,
    required: [true, "A book must have author name"],
  },
  isbn: {
    type: String,
    required: [true, "It must contains isbn number "],
  },
  category: {
    type: String,
    required: [true, "A branch name is required"],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
    default: Date.now(),
  },
});

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;
