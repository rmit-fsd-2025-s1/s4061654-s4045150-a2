// src/controller/ApplicationController.ts

import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
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

  // ─────────────────────────────────────────────────────────────────────────────
  // GET /api/applications
  // Return a fully populated ApplicationInfo[] (including applicant and coursesApplied)
  async all(request: Request, response: Response) {
    try {
      // 1) Find all Applications, eagerly loading:
      //    - "applicant" relation (UserInformation)
      //    - "experience" relation (Experience[])
      //    - "academics" relation (Academics[])
      const allApplications = await this.applicationsRepository.find({
        relations: ["applicant", "experiences", "academics"],
      });


      // 2) For each application, fetch its join‐rows in ApplicationCourses to build a number[] of courseIDs
      const result = await Promise.all(
        allApplications.map(async (app) => {
          // a) Query ApplicationCourses where applicationID == app.applicationID
          const courseRows = await this.applicantCoursesRepository.find({
            where: { application: { applicationID: app.applicationID } },
            relations: ["course"],
          });

          // b) Extract just the numeric courseIDs
          const coursesApplied = courseRows.map(r => ({
            courseID: r.course.courseID,
            courseName: r.course.courseName
          }));

          // c) Construct the object matching your front‐end's ApplicationInfo type
          return {
            applicationID: app.applicationID,
            position: app.position,
            availability: app.availability,
            skills: app.skills,

            // Nested applicant object (UserInformation)
            applicant: {
              userid: app.applicant.userid,
              firstName: app.applicant.firstName,
              lastName: app.applicant.lastName,
              email: app.applicant.email,
              role: app.applicant.role,
            },

            // Numeric array of courseIDs
            coursesApplied,

            // Experience[] and Academics[] (already loaded via relations; possibly empty)
            experience: app.experiences || [],
            academics: app.academics || [],
          };
        })
      );

      // 3) Return the array of fully shaped objects
      return response.json(result);
    } catch (error) {
      console.error("Error in ApplicationController.all:", error);
      return response.status(500).json({ message: "Failed to fetch applications" });
    }
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // POST /api/applications
  // Save a new application, plus its experience, academics, and join‐rows
  async save(request: Request, response: Response) {
    try {
      const {
        position,
        availability,
        experience: expArr,
        skills,
        academics: acadArr,
        applicant,
        coursesApplied,
      } = request.body;

      // 1) Save the Applications row
      const newApp = new Applications();
      newApp.applicant = await this.userRepository.findOneByOrFail({ userid: applicant });
      newApp.position = position;
      newApp.availability = availability;
      newApp.skills = skills; // if this is a string[] column
      const savedApp = await this.applicationsRepository.save(newApp);

      // 2) Save ApplicationCourses join‐rows
      if (Array.isArray(coursesApplied)) {
        for (const courseID of coursesApplied) {
          const ac = new ApplicationCourses();
          ac.application = savedApp;
          // We only know courseID; TypeORM will link by primary key
          ac.course = { courseID } as any;
          await this.applicantCoursesRepository.save(ac);
        }
      }

      // 3) Save Experience entries
      if (Array.isArray(expArr)) {
        for (const exp of expArr) {
          const newExp = new Experience();
          newExp.position = exp.position;
          newExp.company = exp.company;
          newExp.description = exp.description;
          newExp.application = savedApp;
          await this.experienceRepository.save(newExp);
        }
      }

      // 4) Save Academics entries
      if (Array.isArray(acadArr)) {
        for (const aca of acadArr) {
          const newAcad = new Academics();
          newAcad.degree = aca.degree;
          newAcad.university = aca.university;
          newAcad.year = aca.year;
          newAcad.application = savedApp;
          await this.academicsRepository.save(newAcad);
        }
      }

      return response.status(201).json({
        message: "Application saved successfully",
        application: savedApp,
      });
    } catch (error) {
      console.error("Error saving application:", error);
      return response.status(500).json({ message: "Error saving application" });
    }
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // (If you have other methods like getById, update, delete, etc., leave them unchanged.)
}
