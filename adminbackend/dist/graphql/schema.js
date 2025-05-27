"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeDefs = void 0;
const graphql_tag_1 = __importDefault(require("graphql-tag"));
exports.typeDefs = (0, graphql_tag_1.default) `
  type Pet {
    pet_id: ID!
    name: String!
    profiles: [Profile!]
  }

  type Profile {
    profile_id: ID!
    email: String!
    first_name: String!
    last_name: String!
    mobile: String
    street: String
    city: String
    state: String
    postcode: String
    pets: [Pet!]
  }

  type Query {
    profiles: [Profile!]!
    profile(id: ID!): Profile
    pets: [Pet!]!
    pet(id: ID!): Pet
  }

  type Mutation {
    createProfile(
      email: String!
      first_name: String!
      last_name: String!
      mobile: String
      street: String
      city: String
      state: String
      postcode: String
    ): Profile!

    updateProfile(
      id: ID!
      email: String
      first_name: String
      last_name: String
      mobile: String
      street: String
      city: String
      state: String
      postcode: String
    ): Profile!

    deleteProfile(id: ID!): Boolean!

    createPet(name: String!): Pet!
    updatePet(id: ID!, name: String!): Pet!
    deletePet(id: ID!): Boolean!

    addPetToProfile(profileId: ID!, petId: ID!): Profile!
    removePetFromProfile(profileId: ID!, petId: ID!): Profile!
  }
`;
//# sourceMappingURL=schema.js.map