import { describe, it, expect, jest } from "@jest/globals";
import { resolvers } from "../src/graphql/resolvers";
import * as repo from "../src/data-source";
import { course } from "../src/types/course";

//A place holder course object to use in the tests below
const placeholderCourse = {
  courseID: 0,
  courseName: "",
  applicantCourses: [],
  lecturerCourses: [],
};

//Firstly, we will test the removeCourse mutation
describe("Mutation.removeCourse", () => {
  //First test case: when a course is not found to be removed
  it("should return false if course is not found", async () => {
    //We mock the findOne method of the coursesRepository and make it return null
    //This simulates a course not being found in the database while attempting to remove it
    const findOneMock = jest
      .spyOn(repo.coursesRepository, "findOne")
      .mockResolvedValue(null);
    //We make a course object to pass into the removeCourse mutation
    const course = { courseID: 1, courseName: "This course does not exist" };
    //Calling the removeCourse mutation with the course object and a courseID
    const result = await resolvers.Mutation.removeCourse(course, {
      courseID: "1",
    });

    //Finally, the result should be false since the course was not found
    //We use expect to check the result
    expect(result).toBe(false);

    //Restoring the original findOne method
    findOneMock.mockRestore();
  });

  it("should remove related lecturer and application courses", async () => {
    //Just a course object to pass into the removeCourse mutation
    const dummyCourseEntity = {
      courseID: 1,
      courseName: "COSC4253 Programming Studio 2",
      applicantCourses: [],
      lecturerCourses: [],
    };
    //We mock the findOne method of the coursesRepository to return the dummyCourseEntity
    //This simulates a course being found in the database while attempting to remove it
    jest
      .spyOn(repo.coursesRepository, "findOne")
      .mockResolvedValue(dummyCourseEntity);
    //We mock the delete method of the coursesRepository to simulate a successful deletion of the course
    //from the database
    jest
      .spyOn(repo.coursesRepository, "delete")
      .mockResolvedValue({ affected: 1, raw: {} });
    //We mock the delete methods of the lecturerCoursesRepository and applicationCoursesRepository
    //to simulate successful deletion of courses from other related tables in database
    //LecturerCourses
    const deleteLecturerMock = jest
      .spyOn(repo.lecturerCoursesRepository, "delete")
      .mockResolvedValue({ affected: 1, raw: {} });
    //ApplicationCourses
    const deleteApplicationMock = jest
      .spyOn(repo.applicationCoursesRepository, "delete")
      .mockResolvedValue({ affected: 1, raw: {} });
    //Finally, we call the removeCourse mutation with the dummyCourseEntity and a courseID
    await resolvers.Mutation.removeCourse(dummyCourseEntity, { courseID: "1" });
    //We use expect to check if the delete methods were called with the correct course entity
    expect(deleteLecturerMock).toHaveBeenCalledWith({
      course: dummyCourseEntity,
    });
    //We also check if the delete method of the applicationCoursesRepository was called with the correct course entity
    expect(deleteApplicationMock).toHaveBeenCalledWith({
      course: dummyCourseEntity,
    });
    //Finally, we restore the mocked methods to their original implementations
    deleteLecturerMock.mockRestore();
    deleteApplicationMock.mockRestore();
  });
});

it("should return true if course is successfully removed", async () => {
  //We declare a Course object to pass it into the removeCourse mutation
  const Course = {
    courseID: 1,
    courseName: "COSC4253 Full Stack Development",
    applicantCourses: [],
    lecturerCourses: [],
  };
  //We mock the findOne method of the coursesRepository to return the Course object
  //This simulates a course being found in the database while attempting to remove it
  const findOneMock = jest
    .spyOn(repo.coursesRepository, "findOne")
    .mockResolvedValue(Course);

  //Mocking the delete method of the coursesRepository
  //This simulates a successful deletion of the course from the database
  const deleteMock = jest
    .spyOn(repo.coursesRepository, "delete")
    .mockResolvedValue({ affected: 1, raw: {} });

  //We mock the delete methods of the lecturerCoursesRepository and applicationCoursesRepository
  //to simulate successful deletion of courses from other related tables in database
  //LecturerCourses
  jest
    .spyOn(repo.lecturerCoursesRepository, "delete")
    .mockResolvedValue({ affected: 1, raw: {} });
  //ApplicationCourses
  jest
    .spyOn(repo.applicationCoursesRepository, "delete")
    .mockResolvedValue({ affected: 1, raw: {} });

  //Finally, we call the removeCourse mutation with the Course object and a courseID
  //If the course is successfully removed, the result should be true
  const result = await resolvers.Mutation.removeCourse(Course, {
    courseID: "1",
  });
  //We use expect to check the result
  expect(result).toBe(true);

  //Restoring the original methods
  findOneMock.mockRestore();
  deleteMock.mockRestore();
});

describe("Mutation.editCourse", () => {
  it("should update the course name and return the updated course", async () => {
    //Course object to be used in the test
    const Course = {
      courseID: 1,
      courseName: "COSC4453 Programming Studio 1",
      applicantCourses: [],
      lecturerCourses: [],
    };
    //We mock the findOne method of the coursesRepository to return the Course object
    //This simulates a course being found in the database while attempting to edit it
    //If found the course will be updated with the new course name
    const findOneMock = jest
      .spyOn(repo.coursesRepository, "findOne")
      .mockResolvedValue(Course);

    //We mock the save method of the coursesRepository to return the updated course
    //This simulates a successful update of the course in the database
    //We change the courseName to COSC2453 Computing Theory
    const saveMock = jest
      .spyOn(repo.coursesRepository, "save")
      .mockResolvedValue({
        ...Course,
        courseName: "COSC2453 Computing Theory",
        applicantCourses: [],
        lecturerCourses: [],
      });

    //We call the editCourse mutation with the Course object and a courseID
    //If the course is successfully updated, the result should be the updated course
    const result = await resolvers.Mutation.editCourse(placeholderCourse, {
      courseID: "1",
      courseName: "COSC2453 Computing Theory",
    });

    //We use expect to check the result
    expect(result.courseName).toBe("COSC2453 Computing Theory");

    //We also check if the findOne and save methods were called with the correct parameters
    //This ensures that the course was found and updated correctly as expected
    expect(findOneMock).toHaveBeenCalledWith({
      where: { courseID: parseInt("1") },
    });
    expect(saveMock).toHaveBeenCalledWith({
      ...Course,
      courseName: "COSC2453 Computing Theory",
    });

    //Finally, we restore the mocked methods to their original implementations
    findOneMock.mockRestore();
    saveMock.mockRestore();
  });
});

describe("Mutation.addCourse", () => {
  it("should throw an error if the course name already exists", async () => {
    //newCourse object to be used in the test
    const newCourse = {
      courseID: 1,
      courseName: "New Course",
      applicantCourses: [],
      lecturerCourses: [],
    };

    //We mock the findOne method of the coursesRepository to return the newCourse object
    //This simulates a course with the same name already existing in the database
    //If found, the addCourse mutation should throw an error
    const createMock = jest
      .spyOn(repo.coursesRepository, "findOne")
      .mockResolvedValue(newCourse);

    //We call the addCourse mutation with a courseName
    //If the course already exists, the mutation should throw an error
    await expect(
      resolvers.Mutation.addCourse(placeholderCourse, {
        courseName: "Existing Course",
      })
      //throws an error
    ).rejects.toThrow("Course with this name already exists");

    //Restoring the original findOne method
    createMock.mockRestore();
  });
});
