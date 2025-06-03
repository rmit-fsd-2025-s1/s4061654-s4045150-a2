import gql from "graphql-tag";

export const typeDefs = gql`
  type LecturerCourse {
    rowId: ID!
    lecturerId: Int!
    courseId: Int!
  }

  type UserInformation {
    userid: ID!
    firstName: String!
    email: String!
  }

  type Query {
    lecturerCourses: [LecturerCourse!]!
    userInformation: [UserInformation!]!
  }
`;
