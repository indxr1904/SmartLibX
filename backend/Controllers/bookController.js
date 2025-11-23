const Book = require("./../models/BooksModel");
const catchAsync = require("./catchasync");
const AppError = require("./../utils/appError");

exports.getbook = catchAsync(async (req, res, next) => {
  const book = await Book.findById(req.params.id);
  if (!book) {
    return next(new AppError("No book find with the id", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      book,
    },
  });
});

exports.getAllbook = catchAsync(async (req, res, next) => {
  const books = await Book.find();

  res.status(200).json({
    status: "success",
    result: books.length,
    data: {
      books,
    },
  });
});

exports.createbook = catchAsync(async (req, res, next) => {
  const { title, author, isbn, category } = req.body;
  const newbook = await Book.create({
    title,
    author,
    isbn,
    category,
  });
  res.status(200).json({
    status: "success",
    data: {
      book: newbook,
    },
  });
});

exports.updatebook = catchAsync(async (req, res, next) => {
  const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!book) {
    return next(new AppError("No book find with that id", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      data: book,
    },
  });
});

exports.deletebook = catchAsync(async (req, res, next) => {
  const book = await Book.findByIdAndDelete(req.params.id);
  if (!book) {
    return next(new AppError("No book find with that id", 404));
  }
  res.status(200).json({
    status: "success",
    data: null,
  });
});

exports.getPaginatedBooks = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    const search = req.query.search || "";
    const category = req.query.category || "All Categories";

    const skip = (page - 1) * limit;

    let query = {
      $or: [
        { title: { $regex: search, $options: "i" } },
        { author: { $regex: search, $options: "i" } },
        { isbn: { $regex: search, $options: "i" } },
      ],
    };

    if (category !== "All Categories") {
      query.category = category;
    }

    const [books, total] = await Promise.all([
      Book.find(query).skip(skip).limit(limit),
      Book.countDocuments(query),
    ]);

    res.status(200).json({
      status: "success",
      books,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      totalBooks: total,
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};
