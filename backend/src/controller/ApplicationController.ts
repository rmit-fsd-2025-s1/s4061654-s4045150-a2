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
    try {
      // Get filters and sorting from query params
      const {
        name,
        skills,
        course,
        availability,
        position,
        sortBy,
        sortOrder,
        lecturerCourseIDs,
      } = request.query;

      // Start query builder
      let qb = this.applicationsRepository
        .createQueryBuilder("app")
        .leftJoinAndSelect("app.applicant", "applicant")
        .leftJoinAndSelect("app.applicantCourses", "applicantCourses")
        .leftJoinAndSelect("applicantCourses.course", "course")
        .leftJoinAndSelect("app.experiences", "experiences")
        .leftJoinAndSelect("app.academics", "academics");

      // Name filter (case-insensitive, partial match)
      if (name && typeof name === "string" && name.trim() !== "") {
        qb = qb.andWhere(
          "LOWER(CONCAT(applicant.firstName, ' ', applicant.lastName)) LIKE :name",
          { name: `%${name.toLowerCase()}%` }
        );
      }
      // Skills filter (case-insensitive, partial match, any skill)
      if (skills && typeof skills === "string" && skills.trim() !== "") {
        // Defensive: Only run this filter if app.skills is not null and array is not empty
        const skillArr = skills
          .split(",")
          .map((s) => s.trim().toLowerCase())
          .filter(Boolean);
        if (skillArr.length > 0) {
          qb = qb.andWhere(
            `array_length(app.skills, 1) > 0 AND EXISTS (SELECT 1 FROM unnest(app.skills) AS skill WHERE ` +
              skillArr.map((_, i) => `LOWER(skill) LIKE :skill${i}`).join(" OR ") +
              ")",
            Object.fromEntries(skillArr.map((s, i) => ["skill" + i, `%${s}%`]))
          );
        }
      }
      // Course filter (by courseName, can be comma-separated for multiple)
      if (course && typeof course === "string" && course.trim() !== "") {
        const courseArr = course.split(",").map((c) => c.trim());
        qb = qb.andWhere("course.courseName IN (:...courseArr)", { courseArr });
      }
      // Availability filter (case-insensitive, matches any selected)
      if (availability && typeof availability === "string" && availability.trim() !== "") {
        const availArr = availability.split(",").map((a) => a.trim().toLowerCase());
        qb = qb.andWhere("LOWER(app.availability) IN (:...availArr)", { availArr });
      }
      // Position filter (case-insensitive, matches any selected)
      if (position && typeof position === "string" && position.trim() !== "") {
        const posArr = position.split(",").map((p) => p.trim().toLowerCase());
        qb = qb.andWhere("LOWER(app.position) IN (:...posArr)", { posArr });
      }
      // Lecturer Course IDs filter
      if (lecturerCourseIDs) {
        // Accepts either a single ID or an array of IDs
        const ids = Array.isArray(lecturerCourseIDs)
          ? lecturerCourseIDs.map(Number)
          : String(lecturerCourseIDs).split(",").map(Number);
        qb = qb.andWhere("course.courseID IN (:...ids)", { ids });
      }
      // Sorting
      if (sortBy && typeof sortBy === "string") {
        let orderField = undefined;
        if (sortBy === "courseName") orderField = "course.courseName";
        else if (sortBy === "availability") orderField = "app.availability";
        if (orderField) {
          qb = qb.orderBy(orderField, sortOrder === "desc" ? "DESC" : "ASC");
        }
      }
      const results = await qb.getMany();
      return response.json(results);
    } catch (err) {
      console.error("Error in ApplicationController.all (filter/sort):", err);
      return response.status(500).json({ message: "Failed to fetch applications" });
    }
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
