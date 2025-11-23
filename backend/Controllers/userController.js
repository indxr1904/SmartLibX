const User = require("./../models/userModel");
const AppError = require("./../utils/appError");
const catchAsync = require("./catchasync");
const Factory = require("./handleFactory");

exports.getAllUsers = Factory.getAll(User);
exports.getUser = Factory.getOne(User);

exports.createUser = async (req, res, next) => {
  console.log("1111");
  const { email, password, passwordConfirm } = req.body;

  if (!email || !password || !passwordConfirm) {
    return next(new AppError("Please provide email and password"));
  }

  const newUser = await User.create({
    email,
    password,
    passwordConfirm,
  });
  res.status(201).json({
    status: "success",
    data: {
      user: newUser,
    },
  });
};

exports.updateUser = Factory.updateOne(User);
exports.deleteUser = Factory.deleteOne(User);

exports.getStudentDetails = catchAsync(async (req, res, next) => {
  const { rollNo } = req.body;

  if (!rollNo) {
    return res.status(400).json({
      status: "fail",
      message: "There is no student with this rollNo",
    });
  }

  const detail = await User.findOne({ rollNo: rollNo });

  if (!detail) {
    return res.status(400).json({
      status: "fail",
      message: "Roll No is not found",
    });
  }

  res.status(200).json({
    status: "success",
    user: detail,
  });
});

// GET /api/v1/users/paginated?page=1&limit=10&search=john
exports.getPaginatedUsers = async (req, res) => {
  try {
    let { page = 1, limit = 10, search = "" } = req.query;

    page = Number(page);
    limit = Number(limit);

    const query = {
      $or: [
        { firstname: { $regex: search, $options: "i" } },
        { lastname: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ],
    };

    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      User.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }),
      User.countDocuments(query),
    ]);

    res.status(200).json({
      status: "success",
      results: users.length,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      users,
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};
