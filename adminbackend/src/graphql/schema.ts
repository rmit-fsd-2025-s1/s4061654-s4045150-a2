import gql from "graphql-tag";

export const typeDefs = gql`
  type LecturerCourse {
    rowId: ID!
    lecturer: UserInformation!
    course: Courses!
  }

  type UserInformation {
    userid: ID!
    firstName: String!
    lastName: String!
    email: String!
    role: String!
    isBlocked: Boolean!
  }

  type Courses {
    courseID: ID!
    courseName: String!
  }

  type Query {
    lecturerCourses: [LecturerCourse!]!
    userInformation: [UserInformation!]!
    getAllCourses: [Courses!]!
    getLecturerCourses: [LecturerCourse!]!
  }

  type Mutation {
    addCourse(courseName: String!): Courses!
    removeCourse(courseID: ID!): Boolean!
    editCourse(courseID: ID!, courseName: String!): Courses!
  }
`;
