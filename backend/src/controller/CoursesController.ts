import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Courses } from "../entity/Courses";

export class CoursesController {
  private courseRepository = AppDataSource.getRepository(Courses);

  async all(request: Request, response: Response) {
    const courses = await this.courseRepository.find();
    return response.json(courses);
  }
  async findById(request: Request, response: Response) {
    try {
      const id = parseInt(request.params.id, 10);
      if (isNaN(id)) {
        return response.status(400).json({ message: "Invalid course ID" });
      }

      const course = await this.courseRepository.findOneBy({ courseID: id });
      if (!course) {
        return response.status(404).json({ message: "Course not found" });
      }

      return response.json({
        courseID: course.courseID,
        courseName: course.courseName,
      });
    } catch (err) {
      console.error("Error in CoursesController.findById:", err);
      return response.status(500).json({ message: "Failed to fetch course" });
    }
  }
}
