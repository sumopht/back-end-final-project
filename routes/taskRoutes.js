const express = require("express");
const tasksController = require("../controller/tasksController");

const router = express.Router();

router.get("/:student_id", tasksController.getTasks);
// router.get("/members", tasksController.getGroupMembers);
router.post("/", tasksController.addTask);
router.delete("/:student_id/:task_title", tasksController.deleteTask);

module.exports = router;