import { Router } from "express";
import { ApplicantCoursesController } from "../controller/ApplicationCoursesController";

const router = Router();
const applicationcoursescontroller = new ApplicantCoursesController();

router.get("/courses", async (req, res) => {
  await applicationcoursescontroller.all(req, res);
});

router.post("/courses", async (req, res) => {
  await applicationcoursescontroller.save(req, res);
});

export default router;
