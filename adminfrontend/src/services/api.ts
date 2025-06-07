import { gql } from "@apollo/client";
import { client } from "./apollo-client";
import { get } from "http";
import BlockCandidate from "@/components/BlockCandidate";

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
            lastName
            email
            role
            isBlocked
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

  getLecturerCourses: async (): Promise<any[]> => {
    const { data } = await client.query({
      query: gql`
        query {
          getLecturerCourses {
            lecturer {
              userid
              firstName
              lastName
            }
            course {
              courseID
              courseName
            }
          }
        }
      `,
    });
    return data.getLecturerCourses;
  },

  adminLogin: async (username: string, password: string): Promise<any> => {
    const { data } = await client.mutate({
      mutation: gql`
        mutation AdminLogin($username: String!, $password: String!) {
          adminLogin(username: $username, password: $password)
        }
      `,
      variables: { username, password },
    });
    return data.adminLogin;
  },

  getAllLecturers: async (): Promise<any[]> => {
    const { data } = await client.query({
      query: gql`
        query GetAllLecturers {
          userInformation {
            userid
            firstName
            lastName
            role
          }
        }
      `,
    });
    return data.userInformation.filter((user: any) => user.role == "Lecturer");
  },

  assignLecturerCourse: async (
    lecturerId: number,
    courseId: number
  ): Promise<any> => {
    const { data } = await client.mutate({
      mutation: gql`
        mutation AssignLecturerCourse($lecturerId: ID!, $courseId: ID!) {
          assignLecturerCourse(lecturerId: $lecturerId, courseId: $courseId) {
            rowId
            lecturer {
              userid
            }
            course {
              courseID
            }
          }
        }
      `,
      variables: { lecturerId, courseId },
    });
  },

  getAllCandidates: async (): Promise<any[]> => {
    const { data } = await client.query({
      query: gql`
        query GetAllCandidates {
          userInformation {
            userid
            firstName
            lastName
            role
            isBlocked
          }
        }
      `,
    });
    return data.userInformation.filter(
      (user: any) => user.role === "Candidate"
    );
  },

  blockCandidate: async (userid: number, isBlocked: boolean): Promise<any> => {
    const { data } = await client.mutate({
      mutation: gql`
        mutation BlockCandidate($userid: ID!, $isBlocked: Boolean!) {
          blockCandidate(userid: $userid, isBlocked: $isBlocked) {
            userid
            isBlocked
          }
        }
      `,
      variables: { userid, isBlocked },
    });
  },
};
