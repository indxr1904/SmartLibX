const crypto = require("crypto");
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const { type } = require("os");

const bookCopySchema = new mongoose.Schema({
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Book",
    required: true,
  },
  copycode: {
    type: String,
    required: [true, "Please provide copycode"],
    unique: true,
  },
  status: {
    type: String,
    enum: ["available", "issued", "lost", "damaged"],
    default: "available",
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

const BookCopy = mongoose.model("BookCopy", bookCopySchema);

module.exports = BookCopy;
