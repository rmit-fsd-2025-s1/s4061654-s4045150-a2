import { Router } from "express";
import { RankingsController } from "../controller/RankingsController";

const router = Router();

// Get rankings for a lecturer
router.get("/:lecturerId", RankingsController.getRankingsByLecturer);

// Save or update rankings
router.post("/", RankingsController.saveRankings);

export default router;
