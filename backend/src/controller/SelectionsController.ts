import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Selections } from "../entity/Selections";

const selectionRepo = AppDataSource.getRepository(Selections);

export const SelectionsController = {
  // Get all selected applicationIds for a lecturer
  getSelectionsByLecturer: async (req: Request, res: Response) => {
    const lecturerId = parseInt(req.params.lecturerId);
    if (isNaN(lecturerId)) {
      return res.status(400).json({ message: "Invalid lecturerId" });
    }
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
    if (isNaN(parseInt(lecturerId)) || isNaN(parseInt(applicationId))) {
      return res.status(400).json({ message: "Invalid lecturerId or applicationId" });
    }
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
    if (isNaN(lecturerId) || isNaN(applicationId)) {
      return res.status(400).json({ message: "Invalid lecturerId or applicationId" });
    }
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

  // Get all selections globally
  getAllSelections: async (req: Request, res: Response) => {
    try {
      const selections = await selectionRepo.find();
      // Return array of { applicationId, lecturerId }
      res.json(selections.map(s => ({ applicationId: s.applicationId, lecturerId: s.lecturerId })));
    } catch (err) {
      console.error('getAllSelections error:', err);
      res.status(500).json({ message: "Failed to fetch all selections" });
    }
  },

  // Get global applicant selection counts
  getGlobalApplicantSelectionCounts: async (req: Request, res: Response) => {
    try {
      // Join Selections -> Applications -> UserInformation to get applicant userId and name for each selection
      const selections = await selectionRepo
        .createQueryBuilder("selection")
        .leftJoinAndSelect("selection.application", "application")
        .leftJoinAndSelect("application.applicant", "applicant")
        .select(["applicant.userid AS applicantId", "CONCAT(applicant.firstName, ' ', applicant.lastName) AS name"])
        .addSelect("COUNT(selection.rowId)", "count")
        .groupBy("applicant.userid")
        .addGroupBy("applicant.firstName")
        .addGroupBy("applicant.lastName")
        .getRawMany();
      // Returns array of { applicantId, name, count }
      res.json(selections);
    } catch (err) {
      console.error("getGlobalApplicantSelectionCounts error:", err);
      res.status(500).json({ message: "Failed to fetch global applicant selection counts" });
    }
  },
};
