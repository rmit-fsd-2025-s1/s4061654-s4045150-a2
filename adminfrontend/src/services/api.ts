import { gql } from "@apollo/client";
import { client } from "./apollo-client";

// GraphQL Queries

export const userApi = {
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

  addCourse: async (courseName: string): Promise<any> => {
    const { data } = await client.mutate({
      mutation: gql`
        mutation AddCourse($courseName: String!) {
          addCourse(courseName: $courseName) {
            courseID
            courseName
          }
        }
      `,
      variables: { courseName },
    });
  },

  getAllCourses: async (): Promise<any[]> => {
    const { data } = await client.query({
      query: gql`
        query GetAllCourses {
          getAllCourses {
            courseID
            courseName
          }
        }
      `,
    });
    return data.getAllCourses;
  },

  removeCourse: async (courseID: number): Promise<boolean> => {
    const { data } = await client.mutate({
      mutation: gql`
        mutation RemoveCourse($courseID: ID!) {
          removeCourse(courseID: $courseID)
        }
      `,
      variables: { courseID },
    });
    return data.removeCourse;
  },

  editCourse: async (courseID: number, courseName: string): Promise<any> => {
    const { data } = await client.mutate({
      mutation: gql`
        mutation EditCourse($courseID: ID!, $courseName: String!) {
          editCourse(courseID: $courseID, courseName: $courseName) {
            courseID
            courseName
          }
        }
      `,
      variables: { courseID, courseName },
    });
  },
};
