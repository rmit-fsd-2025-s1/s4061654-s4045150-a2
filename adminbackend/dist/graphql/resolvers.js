"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvers = void 0;
const data_source_1 = require("../data-source");
const Profile_1 = require("../entity/Profile");
const Pet_1 = require("../entity/Pet");
const profileRepository = data_source_1.AppDataSource.getRepository(Profile_1.Profile);
const petRepository = data_source_1.AppDataSource.getRepository(Pet_1.Pet);
exports.resolvers = {
    Query: {
        profiles: () => __awaiter(void 0, void 0, void 0, function* () {
            return yield profileRepository.find();
        }),
        profile: (_1, _a) => __awaiter(void 0, [_1, _a], void 0, function* (_, { id }) {
            return yield profileRepository.findOne({
                where: { profile_id: parseInt(id) },
            });
        }),
        pets: () => __awaiter(void 0, void 0, void 0, function* () {
            return yield petRepository.find();
        }),
        pet: (_1, _a) => __awaiter(void 0, [_1, _a], void 0, function* (_, { id }) {
            return yield petRepository.findOne({ where: { pet_id: parseInt(id) } });
        }),
    },
    Mutation: {
        createProfile: (_, args) => __awaiter(void 0, void 0, void 0, function* () {
            const profile = profileRepository.create(args);
            return yield profileRepository.save(profile);
        }),
        updateProfile: (_, _a) => __awaiter(void 0, void 0, void 0, function* () {
            var { id } = _a, args = __rest(_a, ["id"]);
            yield profileRepository.update(id, args);
            return yield profileRepository.findOne({
                where: { profile_id: parseInt(id) },
            });
        }),
        deleteProfile: (_1, _a) => __awaiter(void 0, [_1, _a], void 0, function* (_, { id }) {
            const result = yield profileRepository.delete(id);
            return result.affected !== 0;
        }),
        createPet: (_1, _a) => __awaiter(void 0, [_1, _a], void 0, function* (_, { name }) {
            const pet = petRepository.create({ name });
            return yield petRepository.save(pet);
        }),
        updatePet: (_1, _a) => __awaiter(void 0, [_1, _a], void 0, function* (_, { id, name }) {
            yield petRepository.update(id, { name });
            return yield petRepository.findOne({ where: { pet_id: parseInt(id) } });
        }),
        deletePet: (_1, _a) => __awaiter(void 0, [_1, _a], void 0, function* (_, { id }) {
            const result = yield petRepository.delete(id);
            return result.affected !== 0;
        }),
        addPetToProfile: (_1, _a) => __awaiter(void 0, [_1, _a], void 0, function* (_, { profileId, petId }) {
            const profile = yield profileRepository.findOne({
                where: { profile_id: parseInt(profileId) },
                relations: ["pets"],
            });
            const pet = yield petRepository.findOne({
                where: { pet_id: parseInt(petId) },
            });
            if (!profile || !pet) {
                throw new Error("Profile or Pet not found");
            }
            profile.pets = [...profile.pets, pet];
            return yield profileRepository.save(profile);
        }),
        removePetFromProfile: (_1, _a) => __awaiter(void 0, [_1, _a], void 0, function* (_, { profileId, petId }) {
            const profile = yield profileRepository.findOne({
                where: { profile_id: parseInt(profileId) },
                relations: ["pets"],
            });
            if (!profile) {
                throw new Error("Profile not found");
            }
            profile.pets = profile.pets.filter((pet) => pet.pet_id !== parseInt(petId));
            return yield profileRepository.save(profile);
        }),
    },
};
//# sourceMappingURL=resolvers.js.map