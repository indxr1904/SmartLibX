const express = require("express");
const bookCollection = require("./../Controllers/bookCollectionController");
const authController = require("./../Controllers/authController");

const bookCollectionRouter = express.Router();

bookCollectionRouter.use(authController.protect);

bookCollectionRouter
  .route("/student")
  .get(bookCollection.getStudentAssignments);

bookCollectionRouter.get("/filter", bookCollection.getFilteredByAssignments);

bookCollectionRouter.get(
  "/assignments/paginated",
  bookCollection.getPaginatedAssignments
);

bookCollectionRouter
  .route("/")
  .get(bookCollection.getAllBookCollection)
  .post(bookCollection.createCollection);

bookCollectionRouter
  .route("/:id")
  .get(bookCollection.getbookcollection)
  .patch(bookCollection.updateCollecion)
  .delete(bookCollection.deletecollection);

module.exports = bookCollectionRouter;
