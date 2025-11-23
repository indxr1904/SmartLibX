const catchAsync = require("./catchasync");
const AppError = require("./../utils/appError");
const { Model } = require("mongoose");
const User = require("../models/userModel");

exports.getOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const docs = await Model.findById(req.params.id);
    if (!docs) {
      next(new AppError("No User find with the id", 404));
    }
    res.status(200).json({
      status: "success",
      data: {
        docs,
      },
    });
  });

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    const docs = await Model.find();

    res.status(200).json({
      status: "success",
      result: docs.length,
      data: {
        docs,
      },
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const docs = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!docs) {
      return next(new AppError("No document find with the id", 404));
    }
    res.status(200).json({
      status: "success",
      data: {
        data: docs,
      },
    });
  });

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const docs = await Model.findByIdAndDelete(req.params.id);
    if (!docs) {
      return next(new AppError("No Document find with the id", 404));
    }
    res.status(200).json({
      status: "success",
      data: null,
    });
  });
