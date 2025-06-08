import { AppDataSource } from "../data-source";

import { UserInformation } from "../entity/UserInformation";
import { Applications } from "../entity/Applications";
import { Courses } from "../entity/Courses";
import { ApplicationCourses } from "../entity/ApplicationCourses";
import { LecturerCourses } from "../entity/LecturerCourses";
import { Selections } from "../entity/Selections";
import { Rankings } from "../entity/Rankings";
import { Comments } from "../entity/Comments";
import { course } from "../types/course";
import { get } from "http";

const userInformationRepository = AppDataSource.getRepository(UserInformation);
const applicationsRepository = AppDataSource.getRepository(Applications);
const coursesRepository = AppDataSource.getRepository(Courses);
const applicationCoursesRepository =
  AppDataSource.getRepository(ApplicationCourses);
const lecturerCoursesRepository = AppDataSource.getRepository(LecturerCourses);
const selectionsRepository = AppDataSource.getRepository(Selections);
const rankingsRepository = AppDataSource.getRepository(Rankings);
const commentsRepository = AppDataSource.getRepository(Comments);

export const resolvers = {
  Query: {
    lecturerCourses: async () => {
      return await lecturerCoursesRepository.find();
    },
    userInformation: async () => {
      return await userInformationRepository.find();
    },
    getAllCourses: async () => {
      return await coursesRepository.find();
    },

    getLecturerCourses: async () => {
      return await lecturerCoursesRepository.find({
        relations: ["lecturer", "course"],
      });
    },

    getChosenCandidatesByCourse: async () => {
      const selections = await selectionsRepository.find({
        relations: [
          "application",
          "application.applicant",
          "application.applicantCourses",
          "application.applicantCourses.course",
        ],
      });

      const coursesWithCandidates: {
        courseID: number;
        courseName: string;
        candidates: string[];
      }[] = [];

      selections.forEach((s) => {
        s.application.applicantCourses.forEach((applicationCourse) => {
          const course = applicationCourse.course;
          let courseEntry = coursesWithCandidates.find(
            (c) => c.courseID === course.courseID
          );
          if (!courseEntry) {
            courseEntry = {
              courseID: course.courseID,
              courseName: course.courseName,
              candidates: [],
            };
            coursesWithCandidates.push(courseEntry);
          }

          const fullName = `${s.application.applicant.firstName} ${s.application.applicant.lastName}`;
          if (!courseEntry.candidates.includes(fullName)) {
            courseEntry.candidates.push(fullName);
          }
        });
      });

      return coursesWithCandidates;
    },
  },

  Mutation: {
    addCourse: async (_: course, { courseName }: { courseName: string }) => {
      if (!courseName || courseName.trim() == "") {
        throw new Error("Course name cannot be empty");
      }
      const alreadyExists = await coursesRepository.findOne({
        where: { courseName: courseName.trim() },
      });

      if (alreadyExists) {
        throw new Error("Course with this name already exists");
      }
      const course = coursesRepository.create({ courseName });
      return await coursesRepository.save(course);
    },
    removeCourse: async (_: course, { courseID }: { courseID: string }) => {
      // Find the course entity
      const course = await coursesRepository.findOne({
        where: { courseID: parseInt(courseID) },
      });
      if (!course) return false;

      // Remove related LecturerCourses and ApplicationCourses
      await lecturerCoursesRepository.delete({ course: course });
      await applicationCoursesRepository.delete({ course: course });

      // Remove the course itself
      const result = await coursesRepository.delete(courseID);
      return result.affected !== 0;
    },

    editCourse: async (
      _: course,
      { courseID, courseName }: { courseID: string; courseName: string }
    ) => {
      const course = await coursesRepository.findOne({
        where: { courseID: parseInt(courseID) },
      });
      if (!course) throw new Error("Course not found");

      course.courseName = courseName;
      return await coursesRepository.save(course);
    },
    adminLogin: async (
      _: any,
      { username, password }: { username: string; password: string }
    ) => {
      if (username == "admin" && password == "admin") {
        return true;
      } else {
        return false;
      }
    },

    assignLecturerCourse: async (
      _: any,
      { lecturerId, courseId }: { lecturerId: string; courseId: string }
    ) => {
      const lecturer = await userInformationRepository.findOne({
        where: { userid: parseInt(lecturerId) },
      });
      const course = await coursesRepository.findOne({
        where: { courseID: parseInt(courseId) },
      });

      if (!lecturer || !course) {
        throw new Error("Lecturer or Course not found");
      }

      const lecturerCourse = lecturerCoursesRepository.create({
        lecturer,
        course,
      });
      return await lecturerCoursesRepository.save(lecturerCourse);
    },

    blockCandidate: async (
      _: any,
      { userid, isBlocked }: { userid: string; isBlocked: boolean }
    ) => {
      const userId = parseInt(userid);
      let user = await userInformationRepository.findOne({
        where: { userid: userId },
      });
      if (!user) {
        throw new Error("User not found");
      }

      user.isBlocked = isBlocked;
      await userInformationRepository.save(user);

      user = await userInformationRepository.findOne({
        where: { userid: userId },
      });
      return user;
    },
  },
};
