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
// Importing the necessary repositories from TypeORM
// These repositories will be used to interact with the database entities
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
  //All Query and Mutation resolvers for the GraphQL API
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
    //Returns lecturerCourses with relations to lecturer and course
    getLecturerCourses: async () => {
      return await lecturerCoursesRepository.find({
        relations: ["lecturer", "course"],
      });
    },
    // Returns all applications with relations to applicant, applicationCourses and courses
    getChosenCandidatesByCourse: async () => {
      const selections = await selectionsRepository.find({
        relations: [
          "application",
          "application.applicant",
          "application.applicantCourses",
          "application.applicantCourses.course",
        ],
      });
      //The object to hold courses and their candidates
      const coursesWithCandidates: {
        courseID: number;
        courseName: string;
        candidates: string[];
      }[] = [];

      // Iterating through selections to populate coursesWithCandidates object
      selections.forEach((s) => {
        // Iterating through each applicationCourse to find the course and candidates
        s.application.applicantCourses.forEach((applicationCourse) => {
          const course = applicationCourse.course;
          // Checking if the course already exists in the coursesWithCandidates array
          let courseEntry = coursesWithCandidates.find(
            (c) => c.courseID === course.courseID
          );
          // If the course does not exist, create a new entry
          if (!courseEntry) {
            courseEntry = {
              courseID: course.courseID,
              courseName: course.courseName,
              candidates: [],
            };
            // Push the new course entry to the array, populating it with Course
            //and corresponding candidates
            coursesWithCandidates.push(courseEntry);
          }
          //Storing the full name since that is what is required in the response
          const fullName = `${s.application.applicant.firstName} ${s.application.applicant.lastName}`;
          if (!courseEntry.candidates.includes(fullName)) {
            courseEntry.candidates.push(fullName);
          }
        });
      });
      //Return the object containing courses and their candidates
      return coursesWithCandidates;
    },
  },

  Mutation: {
    // Mutation to add a new course to the database table "Courses"
    addCourse: async (_: course, { courseName }: { courseName: string }) => {
      // Validation to check if courseName is provided and not empty
      if (!courseName || courseName.trim() == "") {
        throw new Error("Course name cannot be empty");
      }
      // Validation to check if a course with the same name already exists
      const alreadyExists = await coursesRepository.findOne({
        where: { courseName: courseName.trim() },
      });
      // If a course with the same name exists, throw an error
      if (alreadyExists) {
        throw new Error("Course with this name already exists");
      }
      // Finally we create a new course entity and save it to the database
      const course = coursesRepository.create({ courseName });
      return await coursesRepository.save(course);
    },
    // Mutation to remove a course from the database table "Courses"
    removeCourse: async (_: course, { courseID }: { courseID: string }) => {
      // Find the course entity
      const course = await coursesRepository.findOne({
        where: { courseID: parseInt(courseID) },
      });
      // If the course does not exist, return false
      if (!course) return false;

      // Remove related LecturerCourses and ApplicationCourses first to avoid foreign key constraint errors
      await lecturerCoursesRepository.delete({ course: course });
      await applicationCoursesRepository.delete({ course: course });

      // Removing the course itself
      const result = await coursesRepository.delete(courseID);
      return result.affected !== 0;
    },
    // Mutation to edit an existing course in the database table "Courses"
    editCourse: async (
      _: course,
      { courseID, courseName }: { courseID: string; courseName: string }
    ) => {
      // Validation to check if courseName is provided and not empty
      const course = await coursesRepository.findOne({
        where: { courseID: parseInt(courseID) },
      });
      // If the course does not exist, throw an error
      if (!course) throw new Error("Course not found");
      // Validation to check if a course with the same name already exists
      course.courseName = courseName;
      //Finally, save the updated course entity to the database
      return await coursesRepository.save(course);
    },
    // Mutation to do adminLogin
    adminLogin: async (
      _: any,
      { username, password }: { username: string; password: string }
    ) => {
      // Simple admin login check
      if (username == "admin" && password == "admin") {
        return true;
      } else {
        return false;
      }
    },
    // Mutation to add a new entry to LecturerCourses and assign lecturers courses
    assignLecturerCourse: async (
      _: any,
      { lecturerId, courseId }: { lecturerId: string; courseId: string }
    ) => {
      // Validation to check if lecturerId and courseId are provided
      const lecturer = await userInformationRepository.findOne({
        where: { userid: parseInt(lecturerId) },
      });
      // Validation to check if courseId is provided
      const course = await coursesRepository.findOne({
        where: { courseID: parseInt(courseId) },
      });
      // If either lecturer or course does not exist, throw an error
      if (!lecturer || !course) {
        throw new Error("Lecturer or Course not found");
      }
      //Create a new LecturerCourses entity and save it to the database
      const lecturerCourse = lecturerCoursesRepository.create({
        lecturer,
        course,
      });

      return await lecturerCoursesRepository.save(lecturerCourse);
    },
    //Mutation to block or unblock a candidate
    blockCandidate: async (
      _: any,
      { userid, isBlocked }: { userid: string; isBlocked: boolean }
    ) => {
      // Validation to check if userid is provided
      const userId = parseInt(userid);
      let user = await userInformationRepository.findOne({
        where: { userid: userId },
      });
      // If the user does not exist, throw an error
      if (!user) {
        throw new Error("User not found");
      }
      // Update the user's isBlocked status
      user.isBlocked = isBlocked;
      await userInformationRepository.save(user);
      // Return the updated user information
      user = await userInformationRepository.findOne({
        where: { userid: userId },
      });
      return user;
    },
  },
};
