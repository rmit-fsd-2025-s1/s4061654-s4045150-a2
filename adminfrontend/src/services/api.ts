import { gql } from "@apollo/client";
import { client } from "./apollo-client";

// Our typescript interface for a pet
export interface Pet {
  pet_id: string;
  name: string;
  profiles?: {
    profile_id: string;
    email: string;
    first_name: string;
    last_name: string;
  }[];
}

// GraphQL Queries
const GET_PETS = gql`
  query GetPets {
    pets {
      pet_id
      name
    }
  }
`;

export const userApi = {
  getAllPets: async (): Promise<Pet[]> => {
    const { data } = await client.query({ query: GET_PETS });
    return data.pets;
  },

  getAllLecturerCourses: async (): Promise<any[]> => {
    const { data } = await client.query({
      query: gql`
        query GetAllLecturerCourses {
          lecturerCourses {
            rowId
            lecturerId
            courseId
          }
        }
      `,
    });
    return data.lecturerCourses;
  },
  getAllUsers: async (): Promise<any[]> => {
    const { data } = await client.query({
      query: gql`
        query GetAllUsers {
          userInformation {
            userid
            firstName
            email
          }
        }
      `,
    });
    return data.userInformation;
  },
};
