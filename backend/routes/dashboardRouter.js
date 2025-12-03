const express = require("express");
const router = express.Router();
const dashboardController = require("./../Controllers/dashboardController");
const authController = require("../Controllers/authController");

router.use(authController.protect); // protect all routes

router.get("/stats/books", dashboardController.totalBooks);
router.get("/stats/users", dashboardController.totalUsers);
router.get("/stats/issued", dashboardController.totalIssued);
router.get("/stats/overdue", dashboardController.totalOverdue);
router.get("/assignments/recent", dashboardController.recentAssignments);
router.get("/stats/categories", dashboardController.categoryCount);

module.exports = router;
