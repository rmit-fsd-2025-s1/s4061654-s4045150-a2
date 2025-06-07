import { gql } from "@apollo/client";
import { client } from "./apollo-client";

// GraphQL Queries

export const userApi = {
  getAllLecturerCourses: async (): Promise<
    {
      rowId: number;
      lecturerId: number;
      courseId: number;
    }[]
  > => {
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

  getAllUsers: async (): Promise<Candidate[]> => {
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

  addCourse: async (courseName: string): Promise<Course> => {
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
    return data.addCourse;
  },

  getAllCourses: async (): Promise<Course[]> => {
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

  editCourse: async (courseID: number, courseName: string): Promise<Course> => {
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
    return data.editCourse;
  },

  getLecturerCourses: async (): Promise<LecturerCourses[]> => {
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

  adminLogin: async (username: string, password: string): Promise<string> => {
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

  getAllLecturers: async (): Promise<Lecturer[]> => {
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
    return data.userInformation.filter(
      (user: Lecturer) => user.role == "Lecturer"
    );
  },

  assignLecturerCourse: async (
    lecturerId: number,
    courseId: number
  ): Promise<LecturerCourses> => {
    const { data } = await client.mutate({
      mutation: gql`
        mutation AssignLecturerCourse($lecturerId: ID!, $courseId: ID!) {
          assignLecturerCourse(lecturerId: $lecturerId, courseId: $courseId) {
            rowId
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
      variables: { lecturerId, courseId },
    });
    return data.assignLecturerCourse;
  },

  getAllCandidates: async (): Promise<Candidate[]> => {
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
      (user: Candidate) => user.role === "Candidate"
    );
  },

  blockCandidate: async (
    userid: number,
    isBlocked: boolean
  ): Promise<Candidate> => {
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
    return data.blockCandidate;
  },

  getChosenCandidatesByCourse: async (): Promise<ChosenCandidates[]> => {
    const { data } = await client.query({
      query: gql`
        query GetChosenCandidatesByCourse {
          getChosenCandidatesByCourse {
            courseID
            courseName
            candidates
          }
        }
      `,
    });
    return data.getChosenCandidatesByCourse;
  },
};

// Candidate type
export interface Candidate {
  userid: number;
  firstName: string;
  lastName: string;
  role: string;
  isBlocked: boolean;
}

// Course type
export interface Course {
  courseID: number;
  courseName: string;
}

// ChosenCandidates type
export interface ChosenCandidates {
  courseID: number;
  courseName: string;
  candidates: string[];
}

// Lecturer type
export interface Lecturer {
  userid: number;
  firstName: string;
  lastName: string;
  role: string;
}

type LecturerCourses = {
  rowId: number;
  lecturer: {
    userid: number;
    firstName: string;
    lastName: string;
  };
  course: {
    courseID: number;
    courseName: string;
  };
};
