import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { ApplicantCourses } from "../entity/ApplicantCourses";
import { UserInformation } from "../entity/UserInformation";
import { Courses } from "../entity/Courses";

export class ApplicantCoursesController {
  private applicantCoursesRepository =
    AppDataSource.getRepository(ApplicantCourses);

  private userRepository = AppDataSource.getRepository(UserInformation);

  private courseRepository = AppDataSource.getRepository(Courses);

  async all(request: Request, response: Response) {
    const applicantCourses = await this.applicantCoursesRepository.find({
      relations: ["applicant", "course"],
    });
    return response.json(applicantCourses);
  }

  async save(request: Request, response: Response) {
    const { id, applicantId, courseId } = request.body;
    const userID = await this.userRepository.findOne({
      where: { userid: applicantId },
    });
    const course = await this.courseRepository.findOne({
      where: { courseID: courseId },
    });
    if (!course) {
      return response.status(404).json({ error: "Course not found" });
    }

    if (!userID) {
      return response.status(404).json({ error: "Applicant not found" });
    }

    const applicantCourse: ApplicantCourses = {
      id: Math.floor(Math.random() * 1000000),
      applicantID: userID,
      courseID: course,
    };
    const savedApplicantCourse = await this.applicantCoursesRepository.save(
      applicantCourse
    );
    return response.status(201).json(savedApplicantCourse);
  }
}
