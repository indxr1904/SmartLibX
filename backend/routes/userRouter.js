const express = require("express");
const userController = require("./../Controllers/userController");
const authController = require("./../Controllers/authController");

const userRouter = express.Router();

userRouter.route("/signup").post(authController.signup);
userRouter.route("/login").post(authController.login);
userRouter.route("/verify/:token").get(authController.verifyEmail);
userRouter.post("/forgotPassword", authController.forgotPassword);
userRouter.patch("/resetPassword/:token", authController.resetPassword);
userRouter.post("/studentdetail", userController.getStudentDetails);
userRouter.get("/paginated", userController.getPaginatedUsers);

// userRouter.use(authController.protect);
userRouter
  .route("/")
  .get(userController.getAllUsers)
  .post(userController.createUser);

userRouter
  .route("/:id")
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = userRouter;
