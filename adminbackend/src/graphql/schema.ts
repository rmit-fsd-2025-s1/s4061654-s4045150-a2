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

  type Courses {
    courseID: ID!
    courseName: String!
  }

  type Query {
    lecturerCourses: [LecturerCourse!]!
    userInformation: [UserInformation!]!
    getAllCourses: [Courses!]!
  }

  type Mutation {
    addCourse(courseName: String!): Courses!
    removeCourse(courseID: ID!): Boolean!
    editCourse(courseID: ID!, courseName: String!): Courses!
  }
`;
