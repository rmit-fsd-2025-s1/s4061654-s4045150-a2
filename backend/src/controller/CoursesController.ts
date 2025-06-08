import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Courses } from "../entity/Courses";

export class CoursesController {
  // Repository for Courses entity
  private courseRepository = AppDataSource.getRepository(Courses);

  async all(request: Request, response: Response) {
    const courses = await this.courseRepository.find();
    return response.json(courses);
  }
  // Get all courses with their IDs and names
  async findById(request: Request, response: Response) {
    try {
      // Parse the course ID from the request parameters
      const id = parseInt(request.params.id, 10);
      // Validate the ID to ensure it's a number
      if (isNaN(id)) {
        return response.status(400).json({ message: "Invalid course ID" });
      }
      // Find the course by ID
      const course = await this.courseRepository.findOneBy({ courseID: id });
      if (!course) {
        return response.status(404).json({ message: "Course not found" });
      }
      // Return the course ID and name
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
