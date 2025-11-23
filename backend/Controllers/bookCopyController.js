const BookCopy = require("./../models/BookCopies");
const catchAsync = require("./catchasync");
const AppError = require("./../utils/appError");
const User = require("../models/userModel");
const Book = require("../models/BooksModel");

exports.getbookCopy = catchAsync(async (req, res, next) => {
  const copy = await BookCopy.findById(req.params.id);
  if (!copy) {
    return next(
      new AppError("No Copies of the book is available with the given id", 404)
    );
  }
  res.status(200).json({
    status: "success",
    data: {
      copy,
    },
  });
});

// exports.assignBook = catchAsync(async (req, res, next) => {
//   const { name, rollNo, isbn, copycode, librarianId, dueDate, returnDate } =
//     req.body;

//   const student = await User.find({ rollNo, role: "student" });
//   if (!student) {
//     return next(
//       new AppError("Student not found with this name and roll no.", 404)
//     );
//   }

//   const book = await Book.findOne({ isbn });
//   if (!book) {
//     return next(new AppError("Book not found with this ISBN", 404));
//   }
//   const bookCopy = await BookCopy.findOne({ copycode, bookId: book._id });
//   if (!bookCopy) {
//     return next(new AppError("Book copy not found", 404));
//   }
// });

exports.getAllCopy = catchAsync(async (req, res, next) => {
  const copies = await BookCopy.find();

  res.status(200).json({
    status: "success",
    result: copies.length,
    data: {
      copies,
    },
  });
});

exports.getCopiesByBookId = catchAsync(async (req, res, next) => {
  const copies = await BookCopy.find({ bookId: req.params.bookId }).populate(
    "bookId",
    "title author"
  );

  if (!copies || copies.length === 0) {
    return next(new AppError("No copies found for this book", 404));
  }
  res.status(200).json({
    status: "success",
    result: copies.length,
    data: {
      copies,
    },
  });
});

exports.createbookcopy = catchAsync(async (req, res, next) => {
  const { bookId, copycode, status } = req.body;
  const copy = await BookCopy.create({
    bookId,
    copycode,
    status,
  });
  res.status(200).json({
    status: "success",
    data: {
      copies: copy,
    },
  });
});

exports.updatecopy = catchAsync(async (req, res, next) => {
  const copy = await BookCopy.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!copy) {
    return next(new AppError("No Book Copy is available to update", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      data: copy,
    },
  });
});

exports.deletecopy = catchAsync(async (req, res, next) => {
  const copy = await BookCopy.findByIdAndDelete(req.params.id);
  if (!copy) {
    return next(new AppError("No Book find with that id", 404));
  }
  res.status(200).json({
    status: "success",
    data: null,
  });
});

exports.assignBook = catchAsync(async (req, res, next) => {
  const { firstname, rollNo, isbn, copycode } = req.body;

  const assignment = await BookCopy.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "studentId",
        foreignField: "_id",
        as: "student",
      },
    },
    { $unwind: "$student" },

    {
      $lookup: {
        from: "bookcopies",
        localField: "copyId",
        foreignField: "_id",
        as: "copy",
      },
    },
    { $unwind: "$copy" },

    {
      $lookup: {
        from: "books",
        localField: "copy.bookId",
        foreignField: "_id",
        as: "book",
      },
    },
    { $unwind: "$book" },
    {
      $match: {
        "student.firstname": firstname,
        "student.rollNo": rollNo,
        "book.isbn": isbn,
        "copy.copycode": copycode,
      },
    },
    {
      $project: {
        _id: 1,
        issueDate: 1,
        dueDate: 1,
        returnDate: 1,
        status: 1,
        "student.firstname": 1,
        "student.lastname": 1,
        "student.rollNo": 1,
        "book.title": 1,
        "book.isbn": 1,
        "copy.copycode": 1,
      },
    },
  ]);
  if (!assignment) {
    return next(new AppError("No assignment found", 404));
  }

  res.status(200).json({
    status: "success",
    result: assignment.length,
    data: assignment,
  });
});

exports.getbookdetailsbycopycode = catchAsync(async (req, res, next) => {
  const { copycode } = req.body;

  if (!copycode) {
    return res.status(400).json({
      status: "fail",
      message: "No copycode is found",
    });
  }

  const bookCopy = await BookCopy.findOne({ copycode: copycode }).populate({
    path: "bookId",
    select: "title author isbn category",
  });

  if (!bookCopy) {
    return res.status(400).json({
      status: "fail",
      message: "No book is found",
    });
  }

  const bookDetails = bookCopy.bookId;
  const copyData = {
    ...bookCopy.toObject(),
    bookId: bookDetails._id,
  };
  delete copyData.bookId.title;
  delete copyData.bookId.author;
  delete copyData.bookId.isbn;
  delete copyData.bookId.category;

  res.status(200).json({
    status: "success",
    data: {
      bookCopies: copyData,
      bookDetails: bookDetails,
    },
  });
});

exports.getBookCopyByCopycode = catchAsync(async (req, res, next) => {
  const copy = await BookCopy.findOne({
    copycode: req.params.copycode,
  }).populate("bookId", "title author isbn category");

  if (!copy) {
    return res.status(404).json({ status: "fail", message: "Copy not found" });
  }

  if (copy.status === "issued") {
    return res.status(400).json({
      status: "fail",
      message: "Book is already assigned to a student",
    });
  }

  res.status(200).json({
    status: "success",
    data: copy,
  });
});

exports.getCopiesByBookPaginated = async (req, res) => {
  try {
    const { bookId } = req.params;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const totalCopies = await BookCopy.countDocuments({ bookId });

    const copies = await BookCopy.find({ bookId })
      .populate("bookId")
      .skip(skip)
      .limit(limit);

    const totalPages = Math.ceil(totalCopies / limit);

    res.status(200).json({
      status: "success",
      currentPage: page,
      limit,
      totalCopies,
      totalPages,
      data: {
        copies,
      },
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};
