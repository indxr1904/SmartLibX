const Book = require("../models/BooksModel");
const User = require("../models/userModel");
const Assignment = require("../models/BookCollection");
const BookCopy = require("../models/BookCopies");

// 1. TOTAL BOOKS
exports.totalBooks = async (req, res) => {
  const count = await Book.countDocuments();
  res.status(200).json({
    status: "success",
    data: { total: count },
  });
};

// 2. TOTAL USERS
exports.totalUsers = async (req, res) => {
  const count = await User.countDocuments();
  res.status(200).json({
    status: "success",
    data: { total: count },
  });
};

// 3. TOTAL ISSUED BOOKS
exports.totalIssued = async (req, res) => {
  const count = await Assignment.countDocuments({ status: "issued" });
  res.status(200).json({
    status: "success",
    data: { count },
  });
};

// 4. TOTAL OVERDUE BOOKS
exports.totalOverdue = async (req, res) => {
  const count = await Assignment.countDocuments({ status: "overdue" });
  res.status(200).json({
    status: "success",
    data: { count },
  });
};

// 5. RECENT ASSIGNMENTS (Latest 5)
exports.recentAssignments = async (req, res) => {
  const recent = await Assignment.find()
    .populate("studentId")
    .populate({
      path: "copyId",
      populate: { path: "bookId" },
    })
    .sort({ createdAt: -1 })
    .limit(5);

  res.status(200).json({
    status: "success",
    data: { collection: recent },
  });
};

// 6. BOOK CATEGORY COUNTS (for chart)
exports.categoryCount = async (req, res) => {
  const result = await Book.aggregate([
    { $group: { _id: "$category", count: { $sum: 1 } } },
  ]);

  res.status(200).json({
    status: "success",
    data: { categories: result },
  });
};
