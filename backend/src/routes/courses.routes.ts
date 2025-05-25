import { Router } from "express";
import { CoursesController } from "../controller/CoursesController";

const router = Router();
const coursesController = new CoursesController();

router.get("/courses", async (req, res) => {
  await coursesController.all(req, res);
});

export default router;
