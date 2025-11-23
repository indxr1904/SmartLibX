const crypto = require("crypto");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("./../models/userModel");
const catchAsync = require("./catchasync");
const AppError = require("./../utils/appError");
const sendEmail = require("./../utils/sendEmail");

const signInToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const {
    firstname,
    lastname,
    email,
    password,
    passwordConfirm,
    role,
    rollNo,
  } = req.body;

  let user = await User.findOne({ email });

  if (user) {
    if (user.verified) {
      return next(new AppError("Email already exists. Please Login!", 400));
    }

    if (user.verificationTokenExpires < Date.now()) {
      const newToken = user.createVerificationToken();
      await user.save({ validateBeforeSave: false });

      const verifyUrl = `${req.protocol}://${req.get(
        "host"
      )}/api/v1/users/verify/${newToken}`;

      const message = `Your previous link is expired. Please verify your email using this link ${verifyUrl}`;

      await sendEmail({
        email: user.email,
        subject: "Resend Verification Link",
        message,
      });

      return res.status(200).json({
        status: "success",
        message: "Verification link expired. New link sent to your email.",
      });
    }

    return next(
      new AppError(
        "You already signed up. Please check your email for verification"
      )
    );
  }

  newUser = await User.create({
    firstname,
    lastname,
    email,
    password,
    passwordConfirm,
    role,
    rollNo,
  });

  const verifyToken = newUser.createVerificationToken();
  await newUser.save({ validateBeforeSave: false });

  const verifyUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/users/verify/${verifyToken}`;

  const message = `Welcome! Please verify your email by clicking here ${verifyUrl}`;

  await sendEmail({
    email: newUser.email,
    subject: "Verify your email",
    message,
  });

  res.status(200).json({
    status: "success",
    message: "Verification email sent. Please  check your inbox",
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(
      new AppError("Please provide the valid email and password", 401)
    );
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password!", 401));
  }

  if (!user.verified) {
    return next(
      new AppError("Please verify your email before logging in ", 403)
    );
  }

  const token = signInToken(user._id);

  res.status(200).json({
    status: "success",
    token,
    data: {
      _id: user._id,
      role: user.role,
      name: user.fullname,
      email: user.email,
    },
  });
});

exports.verifyEmail = catchAsync(async (req, res, next) => {
  const hashToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    verificationToken: hashToken,
    verificationTokenExpires: { $gt: Date.now() },
  });

  console.log(user);

  if (!user) {
    return next(new AppError("Token is invalid or expires", 400));
  }

  user.verified = true;
  user.verificationToken = undefined;
  user.verificationTokenExpires = undefined;
  await user.save({ validateBeforeSave: false });

  const token = signInToken(user._id);

  res.status(200).json({
    status: "success",
    token,
    message: "Email verified successfully",
  });
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new AppError("There is no user with this email address", 404));
  }

  const newToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const verifyUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/users/resetPassword/${newToken}`;

  const message = `Forgot your password? Submit a patch request with your new password and passwordConfirm to ${verifyUrl}.\nIf you didn't forget your password, Please ignore this email`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset token (valid for 10 min)",
      message,
    });

    res.status(200).json({
      status: "success",
      message: "Token sent to email",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      // new AppError("There was an error sending email. Try again later", 500)
      new AppError(err, 500)
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const hashToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await findOne({
    passwordResetToken: hashToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new AppError("The token is expired, Please create new token", 400)
    );
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = req.body.passwordResetToken;
  user.passwordResetExpires = req.body.passwordResetExpires;
  await user.save();

  const token = signInToken(user._id);

  res.status(200).json({
    status: "success",
    token,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new AppError("You are not logged in! Please log in to get access.", 401)
    );
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(new AppError("The user no longer exists.", 401));
  }

  req.user = currentUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You don't have permission to perform this action", 403)
      );
    }
    next();
  };
};
