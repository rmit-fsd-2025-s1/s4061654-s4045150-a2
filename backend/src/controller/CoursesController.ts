import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Courses } from "../entity/Courses";

export class CoursesController {
  private courseRepository = AppDataSource.getRepository(Courses);

  async all(request: Request, response: Response) {
    const courses = await this.courseRepository.find();
    return response.json(courses);
  }
}
