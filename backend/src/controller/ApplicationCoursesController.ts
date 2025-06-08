import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { ApplicationCourses } from "../entity/ApplicationCourses";
import { UserInformation } from "../entity/UserInformation";
import { Courses } from "../entity/Courses";
import { Applications } from "../entity/Applications";

export class ApplicantCoursesController {
  // Using AppDataSource to get the repositories for ApplicationCourses, UserInformation, and Courses
  private applicantCoursesRepository =
    AppDataSource.getRepository(ApplicationCourses);

  private userRepository = AppDataSource.getRepository(UserInformation);

  private courseRepository = AppDataSource.getRepository(Courses);

  async all(request: Request, response: Response) {
    // Fetch all applicant courses with relations to applicant and course
    const applicantCourses = await this.applicantCoursesRepository.find({
      relations: ["applicant", "course"],
    });
    return response.json(applicantCourses);
  }

  async save(request: Request, response: Response) {
    const { id, applicant, course, application } = request.body;
    //Validation to ensure all required fields are present
    if (!applicant || !course || !application) {
      return response.status(400).json({ error: "Missing required fields." });
    }
    //Validation to ensure applicant, course, and application are objects with the required properties
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
    //If course is not found, return a 404 error
    if (!courseID) {
      return response.status(404).json({ error: "Course not found" });
    }
    //If applicant or application is not found, return a 404 error
    if (!applicantID) {
      return response.status(404).json({ error: "Applicant not found" });
    }
    // If application is not found, return a 404 error
    if (!applicationID) {
      return response.status(404).json({ error: "Application not found" });
    }
    // Check if the entry already exists to prevent duplicates
    const alreadyExists = await this.applicantCoursesRepository.findOne({
      where: {
        course: courseID,
        application: applicationID,
      },
    });
    // If the entry already exists, return a 409 error
    if (alreadyExists) {
      return response.status(409).json({ error: "This entry already exists" });
    }
    // Create a new ApplicationCourses object and save it
    const applicantCourse: ApplicationCourses = {
      id: Math.floor(Math.random() * 1000000),
      course: courseID,
      application: applicationID,
    };
    const savedApplicantCourse = await this.applicantCoursesRepository.save(
      applicantCourse
    );
    //After saving, we can return the saved applicant course
    return response.status(201).json(savedApplicantCourse);
  }

  async findByApplicationId(request: Request, response: Response) {
    try {
      // parse applicationId from query string
      const appIdRaw = request.query.applicationId;
      if (!appIdRaw) {
        return response.status(400).json({ message: "Missing applicationId" });
      }
      // Ensure applicationId is a valid number
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
