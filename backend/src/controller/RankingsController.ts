import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Rankings } from "../entity/Rankings";

const rankingRepo = AppDataSource.getRepository(Rankings);

export const RankingsController = {
  // Get a lecturer's rankings
  getRankingsByLecturer: async (req: Request, res: Response) => {
    const lecturerId = parseInt(req.params.lecturerId);

    try {
      const ranking = await rankingRepo.findOneBy({ lecturerId });
      if (!ranking) {
        return res.json([]);
      }

      const ranked = [
        ranking.firstChoiceId,
        ranking.secondChoiceId,
        ranking.thirdChoiceId,
      ].filter((id) => id !== null);

      res.json(ranked);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch rankings" });
    }
  },

  // Save/update a lecturer's rankings
  saveRankings: async (req: Request, res: Response) => {
    const { lecturerId, ranked } = req.body; // ranked = [1, 2, 3]

    if (!lecturerId || !Array.isArray(ranked) || ranked.length === 0) {
      return res.status(400).json({ message: "Invalid ranking input" });
    }

    try {
      let ranking = await rankingRepo.findOneBy({ lecturerId });

      if (!ranking) {
        ranking = rankingRepo.create({ lecturerId });
      }

      ranking.firstChoiceId = ranked[0] || null;
      ranking.secondChoiceId = ranked[1] || null;
      ranking.thirdChoiceId = ranked[2] || null;

      await rankingRepo.save(ranking);
      res.status(200).json(ranking);
    } catch (err) {
      res.status(500).json({ message: "Failed to save rankings" });
    }
  },
};
