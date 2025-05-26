import { Router } from "express";
import { SelectionsController } from "../controller/SelectionsController";

const router = Router();

// Get all selected applicantIds for a lecturer
router.get("/:lecturerId", SelectionsController.getSelectionsByLecturer);

// POST: select an applicant
router.post("/", SelectionsController.selectApplicant);

// DELETE: deselect an applicant
router.delete("/", SelectionsController.deselectApplicant);

export default router;
