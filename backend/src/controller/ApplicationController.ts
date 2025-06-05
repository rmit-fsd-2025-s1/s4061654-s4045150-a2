import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Courses } from "../entity/Courses";
import { ApplicationCourses } from "../entity/ApplicationCourses";
import { UserInformation } from "../entity/UserInformation";
import { Applications } from "../entity/Applications";
import { Experience } from "../entity/Experience";
import { Academics } from "../entity/Academics";

export class ApplicationController {
  private userRepository = AppDataSource.getRepository(UserInformation);
  private applicantCoursesRepository =
    AppDataSource.getRepository(ApplicationCourses);
  private applicationsRepository = AppDataSource.getRepository(Applications);
  private experienceRepository = AppDataSource.getRepository(Experience);
  private academicsRepository = AppDataSource.getRepository(Academics);

  async all(request: Request, response: Response) {
    const allApplications = await this.applicationsRepository.find({
      relations: ["applicant", "experiences", "academics"],
    });
    return response.json(allApplications);
  }

  async save(request: Request, response: Response) {
    try {
      const {
        applicationID,
        position,
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
        position: position,
        availability: availability,
        experience: experience,
        skills: skills,
        applicant: userID,
        academics: academics,
      });
      const savedApp: Applications = await this.applicationsRepository.save(
        application
      );

      // If the application is saved successfully, we can also save the applicant's courses

      for (const courseID of coursesApplied) {
        const course = await AppDataSource.getRepository(Courses).findOne({
          where: { courseID },
        });
        const applicantID = await this.userRepository.findOne({
          where: { userid: applicant },
        });
        if (course && applicantID && savedApp) {
          const applicantCourse = new ApplicationCourses();
          applicantCourse.course = course;
          applicantCourse.application = savedApp;
          await this.applicantCoursesRepository.save(applicantCourse);
        }
      }

      for (const exp of experience) {
        const newExperience = new Experience();
        newExperience.position = exp.position;
        newExperience.company = exp.company;
        newExperience.description = exp.description;
        newExperience.application = savedApp;
        await this.experienceRepository.save(newExperience);
      }

      for (const aca of academics) {
        const newAcademics = new Academics();

        newAcademics.degree = aca.degree;
        newAcademics.year = aca.year;
        newAcademics.university = aca.university;
        newAcademics.application = savedApp;
        await this.academicsRepository.save(newAcademics);
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
