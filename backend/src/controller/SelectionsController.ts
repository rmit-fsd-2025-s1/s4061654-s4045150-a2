import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Selections } from "../entity/Selections";

const selectionRepo = AppDataSource.getRepository(Selections);

export const SelectionsController = {
  // Get all selected applicationIds for a lecturer
  getSelectionsByLecturer: async (req: Request, res: Response) => {
    const lecturerId = parseInt(req.params.lecturerId);

    try {
      const selections = await selectionRepo.find({
        where: { lecturerId: lecturerId },
      });

      // Return array of { applicationId }
      const selectedApplications = selections.map((s) => ({
        applicationId: s.applicationId,
      }));
      res.json(selectedApplications);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch selections" });
    }
  },

  // Add a selection
  selectApplicant: async (req: Request, res: Response) => {
    const { lecturerId, applicationId } = req.body;

    if (!lecturerId || !applicationId) {
      return res.status(400).json({ message: "Missing lecturerId or applicationId" });
    }

    try {
      const exists = await selectionRepo.findOneBy({ lecturerId, applicationId });
      if (exists) {
        return res.status(200).json({ message: "Already selected" });
      }

      const newSelection = selectionRepo.create({ lecturerId, applicationId });
      await selectionRepo.save(newSelection);

      res.status(201).json(newSelection);
    } catch (err) {
      res.status(500).json({ message: "Failed to select application" });
    }
  },

  // Remove a selection (deselect)
  deselectApplicant: async (req: Request, res: Response) => {
    const lecturerId = parseInt(req.params.lecturerId);
    const applicationId = parseInt(req.params.applicationId);

    if (!lecturerId || !applicationId) {
      return res.status(400).json({ message: "Missing lecturerId or applicationId" });
    }

    try {
      await selectionRepo.delete({ lecturerId, applicationId });
      res.status(204).send();
    } catch (err) {
      res.status(500).json({ message: "Failed to deselect application" });
    }
  },
};
