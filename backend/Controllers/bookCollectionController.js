const BookCollection = require("./../models/BookCollection");
const BookCopies = require("./../models/BookCopies");
const catchAsync = require("./catchasync");
const AppError = require("./../utils/appError");
const Book = require("../models/BooksModel");
const { collection } = require("../models/userModel");
const { path } = require("../script");

exports.getbookcollection = catchAsync(async (req, res, next) => {
  const bookCollection = await BookCollection.findById(req.params.id)
    .populate({
      path: "copyId",
      select: "bookId status copycode",
      populate: { path: "bookId", select: "title author isbn category" },
    })
    .populate({
      path: "studentId",
      select: "firstname lastname rollNo email",
    })
    .populate({
      path: "librarianId",
      select: "firstname lastname role",
    });
  if (!bookCollection) {
    return next(new AppError("No book find with the id", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      collection: [bookCollection],
    },
  });
});

exports.getAllBookCollection = catchAsync(async (req, res, next) => {
  const query = {};

  if (req.user && req.user.role === "student") {
    query.studentId = req.user._id;
  }

  const bookCollection = await BookCollection.find(query)
    .populate({
      path: "copyId",
      select: "bookId status copycode",
      populate: { path: "bookId", select: "title author" },
    })
    .populate({
      path: "studentId",
      select: "firstname lastname rollNo",
    })
    .populate({
      path: "librarianId",
      select: "firstname lastname role",
    })
    .lean();

  res.status(200).json({
    status: "success",
    result: bookCollection.length,
    data: {
      collection: bookCollection,
    },
  });
});

exports.createCollection = catchAsync(async (req, res, next) => {
  const { copyId, studentId, librarianId, dueDate, returnDate, status } =
    req.body;

  const copy = await BookCopies.findById(copyId);
  if (!copy) {
    return next(new AppError("Copy not found", 403));
  }

  if (copy.status === "issued") {
    return res.status(400).json({
      status: "Fail",
      message: "This copy is already assigned to another student.",
    });
  }

  const newCollection = await BookCollection.create({
    copyId,
    studentId,
    librarianId,
    issueDate: new Date(),
    dueDate,
    returnDate,
    status: "issued",
  });

  copy.status = "issued";
  await copy.save();

  res.status(200).json({
    status: "success",
    data: {
      collection: [newCollection],
    },
  });
});

exports.updateCollecion = catchAsync(async (req, res, next) => {
  const bookCollection = await BookCollection.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  )
    .populate({
      path: "copyId",
      select: "bookId copycode status",
      populate: { path: "bookId", select: "title author isbn category" },
    })
    .populate({
      path: "studentId",
      select: "firstname lastname rollNo email",
    })
    .populate({
      path: "librarianId",
      select: "firstname lastname role",
    });
  if (!bookCollection) {
    return next(new AppError("No book find with that id", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      collection: [bookCollection],
    },
  });
});

exports.deletecollection = catchAsync(async (req, res, next) => {
  const bookCollection = await BookCollection.findByIdAndDelete(req.params.id);
  if (!bookCollection) {
    return next(new AppError("No book find with that id", 404));
  }
  res.status(200).json({
    status: "success",
    data: null,
  });
});

exports.getStudentAssignments = catchAsync(async (req, res, next) => {
  const studentId = req.user.id;

  const assignments = await BookCollection.find({ studentId })
    .populate({
      path: "copyId",
      select: "bookId status copycode",
      populate: { path: "bookId", select: "title author" },
    })
    .populate({ path: "studentId", select: "firstname lastname rollNo email" })
    .populate({ path: "librarianId", select: "firstname lastname role" });

  res.status(200).json({
    status: "success",
    results: assignments.length,
    data: { collection: assignments },
  });
});
exports.getFilteredByAssignments = catchAsync(async (req, res, next) => {
  const { page = 1, limit = 10, rollNo, dueDate, status } = req.query;
  const skip = (page - 1) * limit;

  let query = {};

  // status filter
  if (status) {
    query.status = { $regex: status, $options: "i" };
  }

  let assignments = await BookCollection.find(query)
    .populate({
      path: "studentId",
      match: rollNo ? { rollNo: rollNo } : {},
    })
    .populate("librarianId")
    .populate({
      path: "copyId",
      populate: { path: "bookId" },
    });

  // filter out unmatched rollNo entries
  if (rollNo) {
    assignments = assignments.filter((a) => a.studentId);
  }

  // due date filter (dd/mm/yyyy)
  if (dueDate) {
    assignments = assignments.filter((item) => {
      if (!item.issueDate) return false;
      const due = new Date(item.issueDate);
      due.setDate(due.getDate() + 7);
      return due.toLocaleDateString("en-GB") === dueDate;
    });
  }

  // pagination after filtering
  const totalAssignments = assignments.length;
  const totalPages = Math.ceil(totalAssignments / limit);
  const paginated = assignments.slice(skip, skip + limit);

  res.status(200).json({
    status: "success",
    data: {
      assignments: paginated,
      totalAssignments,
      totalPages,
      currentPage: Number(page),
    },
  });
});

exports.getPaginatedAssignments = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit, 5) || 5, 1);
    const skip = (page - 1) * limit;

    const rollNo = req.query.rollNo ? req.query.rollNo.trim() : null;
    const dueDateStr = req.query.dueDate ? req.query.dueDate.trim() : null;
    const status = req.query.status ? req.query.status.trim() : null;

    const pipeline = [];

    // ===== STATUS FILTER =====
    if (status) {
      pipeline.push({ $match: { status } });
    }

    // ===== POPULATIONS =====
    pipeline.push(
      {
        $lookup: {
          from: "bookcopies",
          localField: "copyId",
          foreignField: "_id",
          as: "copyId",
        },
      },
      { $unwind: { path: "$copyId", preserveNullAndEmptyArrays: true } },

      {
        $lookup: {
          from: "books",
          localField: "copyId.bookId",
          foreignField: "_id",
          as: "copyId.bookId",
        },
      },
      { $unwind: { path: "$copyId.bookId", preserveNullAndEmptyArrays: true } },

      {
        $lookup: {
          from: "users",
          localField: "studentId",
          foreignField: "_id",
          as: "studentId",
        },
      },
      { $unwind: { path: "$studentId", preserveNullAndEmptyArrays: true } },

      {
        $lookup: {
          from: "users",
          localField: "librarianId",
          foreignField: "_id",
          as: "librarianId",
        },
      },
      { $unwind: { path: "$librarianId", preserveNullAndEmptyArrays: true } }
    );

    // ===== ROLL NO FILTER =====
    if (rollNo) {
      pipeline.push({
        $match: {
          $expr: {
            $regexMatch: {
              input: { $toString: "$studentId.rollNo" }, // convert number → string
              regex: rollNo,
              options: "i",
            },
          },
        },
      });
    }

    // ===== DUE DATE FILTER (dd/mm/yyyy) =====
    if (dueDateStr) {
      pipeline.push({
        $match: {
          $expr: {
            $eq: [
              {
                $dateToString: {
                  format: "%d/%m/%Y",
                  date: "$dueDate",
                  timezone: "Asia/Kolkata",
                },
              },
              dueDateStr,
            ],
          },
        },
      });
    }

    // ===== PAGINATION & SORT =====
    pipeline.push(
      { $sort: { issueDate: -1, _id: -1 } },
      {
        $facet: {
          metadata: [{ $count: "total" }],
          data: [{ $skip: skip }, { $limit: limit }],
        },
      }
    );

    const aggResult = await BookCollection.aggregate(pipeline).allowDiskUse(
      true
    );

    const total = aggResult[0].metadata[0]?.total || 0;
    const totalPages = Math.max(Math.ceil(total / limit), 1);
    const docs = aggResult[0].data;

    return res.status(200).json({
      status: "success",
      data: {
        assignments: docs,
        totalAssignments: total,
        totalPages,
        currentPage: page,
      },
    });
  } catch (err) {
    console.error("getPaginatedAssignments error:", err);
    return res.status(500).json({ status: "error", message: err.message });
  }
};
