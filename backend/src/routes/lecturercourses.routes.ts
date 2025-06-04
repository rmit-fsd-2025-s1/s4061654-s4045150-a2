import { Router } from "express";
import { LecturerController } from "../controller/LecturerCoursesController";

const router = Router();

// Get all lecturer-course assignments
router.get("/", LecturerController.getAllLecturerCourses);

// Assign a course to a lecturer
router.post("/", LecturerController.assignLecturerCourse);

// Delete a course assignment
router.delete("/:rowId", LecturerController.deleteLecturerCourse);

router.get("/lecturers/:lecturerId/courses", LecturerController.getLecturerCoursesById); // <-- MOVE THIS UP
router.get("/:lecturerId", LecturerController.getLecturerCoursesById); // <-- KEEP THIS BELOW


export default router;
