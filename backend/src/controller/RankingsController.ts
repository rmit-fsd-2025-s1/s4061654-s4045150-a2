import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Rankings } from "../entity/Rankings";

const rankingRepo = AppDataSource.getRepository(Rankings);

export const RankingsController = {
  // Get all rankings for a lecturer
  getRankingsByLecturer: async (req: Request, res: Response) => {
    const lecturerId = parseInt(req.params.lecturerId);
    try {
      const rankings = await rankingRepo.find({ where: { lecturerId } });
      res.json(rankings);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch rankings" });
    }
  },

  // Set or update a ranking (rank 1, 2, or 3) for a selected application
  setRanking: async (req: Request, res: Response) => {
    const { lecturerId, applicationId, rank } = req.body;
    if (!lecturerId || !applicationId || ![1, 2, 3].includes(rank)) {
      return res.status(400).json({ message: "Invalid ranking input" });
    }
    try {
      // Remove any existing ranking for this lecturer and rank
      await rankingRepo.delete({ lecturerId, rank });
      // Remove any existing ranking for this lecturer and applicationId
      await rankingRepo.delete({ lecturerId, applicationId });
      // Create new ranking
      const newRanking = rankingRepo.create({ lecturerId, applicationId, rank });
      await rankingRepo.save(newRanking);
      res.status(201).json(newRanking);
    } catch (err) {
      res.status(500).json({ message: "Failed to set ranking" });
    }
  },

  // Remove a ranking for a lecturer and rank
  deleteRanking: async (req: Request, res: Response) => {
    const lecturerId = parseInt(req.params.lecturerId);
    const rank = parseInt(req.params.rank);
    if (!lecturerId || ![1, 2, 3].includes(rank)) {
      return res.status(400).json({ message: "Invalid input" });
    }
    try {
      await rankingRepo.delete({ lecturerId, rank });
      res.status(204).send();
    } catch (err) {
      res.status(500).json({ message: "Failed to delete ranking" });
    }
  },
};
