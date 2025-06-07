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

// import { PubSub } from "graphql-subscriptions";
// const pubsub = new PubSub();
// const CANDIDATE_UNAVAILABLE = "CANDIDATE_UNAVAILABLE";

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

  //   profile: async (_: any, { id }: { id: string }) => {
  //     return await profileRepository.findOne({
  //       where: { profile_id: parseInt(id) },
  //     });
  //   },
  //   pets: async () => {
  //     return await petRepository.find();
  //   },
  //   pet: async (_: any, { id }: { id: string }) => {
  //     return await petRepository.findOne({ where: { pet_id: parseInt(id) } });
  //   },
  // },
  Mutation: {
    addCourse: async (_: course, { courseName }: { courseName: string }) => {
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

  // Subscription: {
  //   candidateUnavailable: {
  //     subscribe: () => pubsub.asyncIterator([CANDIDATE_UNAVAILABLE]),
  //   },
  // },

  //   updateProfile: async (
  //     _: any,
  //     { id, ...args }: { id: string } & Partial<Profile>
  //   ) => {
  //     await profileRepository.update(id, args);
  //     return await profileRepository.findOne({
  //       where: { profile_id: parseInt(id) },
  //     });
  //   },
  //   deleteProfile: async (_: any, { id }: { id: string }) => {
  //     const result = await profileRepository.delete(id);
  //     return result.affected !== 0;
  //   },
  //   createPet: async (_: any, { name }: { name: string }) => {
  //     const pet = petRepository.create({ name });
  //     return await petRepository.save(pet);
  //   },
  //   updatePet: async (_: any, { id, name }: { id: string; name: string }) => {
  //     await petRepository.update(id, { name });
  //     return await petRepository.findOne({ where: { pet_id: parseInt(id) } });
  //   },
  //   deletePet: async (_: any, { id }: { id: string }) => {
  //     const result = await petRepository.delete(id);
  //     return result.affected !== 0;
  //   },
  //   addPetToProfile: async (
  //     _: any,
  //     { profileId, petId }: { profileId: string; petId: string }
  //   ) => {
  //     const profile = await profileRepository.findOne({
  //       where: { profile_id: parseInt(profileId) },
  //       relations: ["pets"],
  //     });
  //     const pet = await petRepository.findOne({
  //       where: { pet_id: parseInt(petId) },
  //     });
  //     if (!profile || !pet) {
  //       throw new Error("Profile or Pet not found");
  //     }
  //     profile.pets = [...profile.pets, pet];
  //     return await profileRepository.save(profile);
  //   },
  //   removePetFromProfile: async (
  //     _: any,
  //     { profileId, petId }: { profileId: string; petId: string }
  //   ) => {
  //     const profile = await profileRepository.findOne({
  //       where: { profile_id: parseInt(profileId) },
  //       relations: ["pets"],
  //     });
  //     if (!profile) {
  //       throw new Error("Profile not found");
  //     }
  //     profile.pets = profile.pets.filter(
  //       (pet) => pet.pet_id !== parseInt(petId)
  //     );
  //     return await profileRepository.save(profile);
  //   },
  // };

  // When a candidate becomes unavailable, publish the event:
  //   export const notifyCandidateUnavailable = (candidate) => {
  //     pubsub.publish(CANDIDATE_UNAVAILABLE, {
  //       candidateUnavailable: {
  //         candidateId: candidate.userid,
  //         name: `${candidate.firstName} ${candidate.lastName}`,
  //         reason: "Candidate is unavailable for hiring at the start of the semester.",
  //       },
  //     });
  //   };
  // };
};
