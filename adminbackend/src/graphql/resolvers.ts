import { AppDataSource } from "../data-source";

import { UserInformation } from "../entity/UserInformation";
import { Applications } from "../entity/Applications";
import { Courses } from "../entity/Courses";
import { ApplicantCourses } from "../entity/ApplicantCourses";
import { LecturerCourses } from "../entity/LecturerCourses";
import { Selections } from "../entity/Selections";
import { Rankings } from "../entity/Rankings";
import { Comments } from "../entity/Comments";

const userInformationRepository = AppDataSource.getRepository(UserInformation);
const applicationsRepository = AppDataSource.getRepository(Applications);
const coursesRepository = AppDataSource.getRepository(Courses);
const applicantCoursesRepository =
  AppDataSource.getRepository(ApplicantCourses);
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
  // Mutation: {
  //   createProfile: async (_: any, args: any) => {
  //     const profile = profileRepository.create(args);
  //     return await profileRepository.save(profile);
  //   },
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
  // },
};
