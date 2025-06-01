import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { ApplicantCourses } from "../entity/ApplicantCourses";
import { UserInformation } from "../entity/UserInformation";
import { Courses } from "../entity/Courses";
import { Applications } from "../entity/Applications";

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
    const { id, applicantId, courseId, applicationID } = request.body;
    if (!applicantId || !courseId || !applicationID) {
      return response.status(400).json({ error: "Missing required fields." });
    }

    const userID = await this.userRepository.findOne({
      where: { userid: applicantId },
    });
    const course = await this.courseRepository.findOne({
      where: { courseID: courseId },
    });
    const application = await AppDataSource.getRepository(Applications).findOne(
      {
        where: { applicationID: applicationID },
      }
    );
    if (!course) {
      return response.status(404).json({ error: "Course not found" });
    }

    if (!userID) {
      return response.status(404).json({ error: "Applicant not found" });
    }
    if (!application) {
      return response.status(404).json({ error: "Application not found" });
    }

    const alreadyExists = await this.applicantCoursesRepository.findOne({
      where: {
        applicantID: userID,
        courseID: course,
        applicationID: applicationID,
      },
    });
    if (alreadyExists) {
      return response.status(409).json({ error: "This entry already exists" });
    }

    const applicantCourse: ApplicantCourses = {
      id: Math.floor(Math.random() * 1000000),
      applicantID: userID,
      courseID: course,
      applicationID: applicationID,
    };
    const savedApplicantCourse = await this.applicantCoursesRepository.save(
      applicantCourse
    );
    return response.status(201).json(savedApplicantCourse);
  }
}
