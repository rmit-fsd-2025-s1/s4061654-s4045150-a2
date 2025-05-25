import { Router } from "express";
import { ApplicantCoursesController } from "../controller/ApplicantCoursesController";

const router = Router();
const applicantcoursescontroller = new ApplicantCoursesController();

router.get("/courses", async (req, res) => {
  await applicantcoursescontroller.all(req, res);
});

router.post("/courses", async (req, res) => {
  await applicantcoursescontroller.save(req, res);
});

export default router;
