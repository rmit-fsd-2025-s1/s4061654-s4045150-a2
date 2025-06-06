import { Router } from "express";
import { RankingsController } from "../controller/RankingsController";

const router = Router();

// Get rankings for a lecturer
router.get("/:lecturerId", RankingsController.getRankingsByLecturer);

// Set or update a ranking
router.post("/", RankingsController.setRanking);

// Delete a ranking for a lecturer and rank
router.delete("/:lecturerId/:rank", RankingsController.deleteRanking);

export default router;
