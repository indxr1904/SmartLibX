const express = require("express");
const bookcopyController = require("./../Controllers/bookCopyController");
// const { protect, restrictTo } = require("./../Controllers/authController");

const copyRouter = express.Router();

copyRouter.post("/assign", bookcopyController.assignBook);
copyRouter.post("/bookdetails", bookcopyController.getbookdetailsbycopycode);
copyRouter.get(
  "/book/:bookId/paginated",
  bookcopyController.getCopiesByBookPaginated
);
copyRouter.get("/book/:bookId", bookcopyController.getCopiesByBookId);

// copyRouter.use(protect);

copyRouter
  .route("/")
  .get(bookcopyController.getAllCopy)
  .post(bookcopyController.createbookcopy);

copyRouter
  .route("/:id")
  .get(bookcopyController.getbookCopy)
  .patch(bookcopyController.updatecopy)
  .delete(bookcopyController.deletecopy);

module.exports = copyRouter;
