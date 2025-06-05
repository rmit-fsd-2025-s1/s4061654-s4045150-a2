import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { ApplicationCourses } from "../entity/ApplicationCourses";
import { UserInformation } from "../entity/UserInformation";
import { Courses } from "../entity/Courses";
import { Applications } from "../entity/Applications";

export class ApplicantCoursesController {
  private applicantCoursesRepository =
    AppDataSource.getRepository(ApplicationCourses);

  private userRepository = AppDataSource.getRepository(UserInformation);

  private courseRepository = AppDataSource.getRepository(Courses);

  async all(request: Request, response: Response) {
    const applicantCourses = await this.applicantCoursesRepository.find({
      relations: ["applicant", "course"],
    });
    return response.json(applicantCourses);
  }

  async save(request: Request, response: Response) {
    const { id, applicant, course, application } = request.body;
    if (!applicant || !course || !application) {
      return response.status(400).json({ error: "Missing required fields." });
    }

    const applicantID = await this.userRepository.findOne({
      where: { userid: applicant.userid },
    });
    const courseID = await this.courseRepository.findOne({
      where: { courseID: course.courseID },
    });
    const applicationID = await AppDataSource.getRepository(
      Applications
    ).findOne({
      where: { applicationID: application.applicationID },
    });
    if (!courseID) {
      return response.status(404).json({ error: "Course not found" });
    }

    if (!applicantID) {
      return response.status(404).json({ error: "Applicant not found" });
    }
    if (!applicationID) {
      return response.status(404).json({ error: "Application not found" });
    }

    const alreadyExists = await this.applicantCoursesRepository.findOne({
      where: {
        course: courseID,
        application: applicationID,
      },
    });
    if (alreadyExists) {
      return response.status(409).json({ error: "This entry already exists" });
    }

    const applicantCourse: ApplicationCourses = {
      id: Math.floor(Math.random() * 1000000),

      course: courseID,
      application: applicationID,
    };
    const savedApplicantCourse = await this.applicantCoursesRepository.save(
      applicantCourse
    );
    return response.status(201).json(savedApplicantCourse);
  }

  async findByApplicationId(request: Request, response: Response) {
    try {
      // parse applicationId from query string
      const appIdRaw = request.query.applicationId;
      if (!appIdRaw) {
        return response.status(400).json({ message: "Missing applicationId" });
      }

      const applicationId = parseInt(appIdRaw as string, 10);
      if (isNaN(applicationId)) {
        return response.status(400).json({ message: "Invalid applicationId" });
      }

      // Use the correct repository and field name (applicationID)
      const rows = await this.applicantCoursesRepository.find({
        where: { application: { applicationID: applicationId } },
        relations: ["course"],
      });

      return response.json(rows);
    } catch (error) {
      console.error(
        "Error in ApplicationCoursesController.findByApplicationId:",
        error
      );
      return response
        .status(500)
        .json({ message: "Failed to fetch application-courses" });
    }
  }
}
