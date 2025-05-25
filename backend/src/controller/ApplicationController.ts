import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Courses } from "../entity/Courses";
import { ApplicantCourses } from "../entity/ApplicantCourses";
import { UserInformation } from "../entity/UserInformation";
import { Applications } from "../entity/Applications";
import { experience } from "../types/experience";
import { qualification } from "../types/qualification";

export class ApplicationController {
  private userRepository = AppDataSource.getRepository(UserInformation);
  private applicantCoursesRepository =
    AppDataSource.getRepository(ApplicantCourses);
  private applicationsRepository = AppDataSource.getRepository(Applications);

  async all(request: Request, response: Response) {
    const allApplications = await this.applicationsRepository.find();
    return response.json(allApplications);
  }

  async save(request: Request, response: Response) {
    try {
      const {
        applicationID,
        availability,
        experience,
        skills,
        academics,
        applicant,
        coursesApplied,
      } = request.body;

      const userID = await this.userRepository.findOne({
        where: { userid: applicant },
      });
      if (!userID) {
        return response.status(400).json({ message: "Applicant not found" });
      }

      const application: Applications = Object.assign(new Applications(), {
        applicationID: applicationID,
        applicant: userID,
        availability: availability,
        experience: experience,
        skills: skills,
        academics: academics,
      });
      const savedApp: Applications = await this.applicationsRepository.save(
        application
      );

      // If the application is saved successfully, we can also save the applicant's courses

      for (const courseID of coursesApplied) {
        const course = await this.applicantCoursesRepository.findOne({
          where: { id: courseID },
        });
        if (course) {
          const applicantCourse: ApplicantCourses = Object.assign(
            new ApplicantCourses(),
            {
              course: course,
              applicant: savedApp.applicant,
            }
          );
          await this.applicantCoursesRepository.save(applicantCourse);
        }
      }

      return response.status(201).json({
        message: "Application saved successfully",
        application: savedApp,
      });
    } catch (error) {
      return response.status(500).json({ message: "Error saving application" });
    }
  }
}
