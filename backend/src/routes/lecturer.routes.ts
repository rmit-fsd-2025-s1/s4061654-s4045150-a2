import { Router } from "express";
import { LecturerController } from "../controller/LecturerController";

const router = Router();

// Get all lecturer-course assignments
router.get("/", LecturerController.getAllLecturerCourses);

// Get all courses assigned to a lecturer
router.get("/:lecturerId", LecturerController.getLecturerCoursesById);

// Assign a course to a lecturer
router.post("/", LecturerController.assignLecturerCourse);

// Delete a course assignment
router.delete("/:rowId", LecturerController.deleteLecturerCourse);

export default router;
