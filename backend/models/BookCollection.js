const crypto = require("crypto");
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const { type } = require("os");
const { ref } = require("process");

const bookCollectionSchema = new mongoose.Schema({
  copyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "BookCopy",
    required: true,
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  librarianId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  issueDate: {
    type: Date,
    default: Date.now(),
  },
  dueDate: {
    type: Date,
    required: [true, "Please provide the due date"],
  },
  returnDate: {
    type: Date,
  },
  status: {
    type: String,
    enum: ["issued", "returned", "overdue"],
  },
});

const BookCollection = mongoose.model("BookCollection", bookCollectionSchema);

module.exports = BookCollection;
