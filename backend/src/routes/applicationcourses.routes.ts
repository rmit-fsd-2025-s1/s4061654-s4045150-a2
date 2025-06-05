import { Router } from "express";
import { ApplicantCoursesController } from "../controller/ApplicationCoursesController";

const router = Router();
const applicationCoursesController = new ApplicantCoursesController();

// (Optional) If you really need to create new join‐rows via POST, you can keep this:
router.post("/applicationcourses", async (req, res) => {
  await applicationCoursesController.save(req, res);
});

// This is the one we need for fetching by applicationId:
router.get("/applicationcourses", async (req, res) => {
  await applicationCoursesController.findByApplicationId(req, res);
});

export default router;
