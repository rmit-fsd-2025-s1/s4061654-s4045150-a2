import { Router } from "express";
import { SelectionsController } from "../controller/SelectionsController";

const router = Router();

// Add logging to help debug selection fetches
router.get("/", (req, res, next) => {
  console.log("[GET] /api/selections or /api/selections/ called");
  next();
}, SelectionsController.getAllSelections);

// Get all selected applicantIds for a lecturer
router.get("/:lecturerId", SelectionsController.getSelectionsByLecturer);

// POST: select an applicant
router.post("/", SelectionsController.selectApplicant);

// DELETE: deselect an applicant
router.delete("/:lecturerId/:applicationId", SelectionsController.deselectApplicant);

// Add a global analytics endpoint for applicant selection counts
router.get("/analytics/global", SelectionsController.getGlobalApplicantSelectionCounts);

export default router;
