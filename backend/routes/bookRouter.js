const express = require("express");
const bookController = require("./../Controllers/bookController");
// const { protect, restrictTo } = require("./../Controllers/authController");

const bookRouter = express.Router();

// bookRouter.use(protect);

bookRouter.get("/paginated", bookController.getPaginatedBooks);

bookRouter
  .route("/")
  .get(bookController.getAllbook)
  .post(bookController.createbook);

bookRouter
  .route("/:id")
  .get(bookController.getbook)
  .patch(bookController.updatebook)
  .delete(bookController.deletebook);

module.exports = bookRouter;
