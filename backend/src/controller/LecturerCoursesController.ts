import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { LecturerCourses } from "../entity/LecturerCourses";

const lecturerRepo = AppDataSource.getRepository(LecturerCourses);

export const LecturerController = {
  // Get all lecturer-course assignments
  getAllLecturerCourses: async (req: Request, res: Response) => {
    try {
      const lecturerCourses = await lecturerRepo.find();
      res.json(lecturerCourses);
    } catch (err) {
      res.status(500).json({ message: "Error getting lecturer courses" });
    }
  },

  // Get courses for one lecturer
  getLecturerCoursesById: async (req: Request, res: Response) => {
    const lecturerId = parseInt(req.params.lecturerId);

    try {
      const lecturerCourses = await lecturerRepo.find({
        where: { lecturerId: lecturerId },
      });
      res.json(lecturerCourses);
    } catch (err) {
      res.status(500).json({ message: "Error finding courses for lecturer" });
    }
  },

  // Assign course to lecturer
  assignLecturerCourse: async (req: Request, res: Response) => {
    const { lecturerId, courseId } = req.body;

    if (!lecturerId || !courseId) {
      return res
        .status(400)
        .json({ message: "Missing lecturerId or courseId" });
    }

    try {
      const newLecturer = lecturerRepo.create({
        lecturerId: lecturerId,
        courseId: courseId,
      });

      await lecturerRepo.save(newLecturer);
      res.status(201).json(newLecturer);
    } catch (err) {
      res.status(500).json({ message: "Error assigning course to lecturer" });
    }
  },

  // Delete course assignment
  deleteLecturerCourse: async (req: Request, res: Response) => {
    const rowId = parseInt(req.params.rowId);

    try {
      await lecturerRepo.delete({ rowId: rowId });
      res.status(204).send();
    } catch (err) {
      res.status(500).json({ message: "Error deleting lecturer course" });
    }
  },
};
