import { describe, it, expect, jest } from "@jest/globals";
import { resolvers } from "../src/graphql/resolvers";
import * as repo from "../src/data-source";
import { course } from "../src/types/course";
const dummyCourse = {
  courseID: 0,
  courseName: "",
  applicantCourses: [],
  lecturerCourses: [],
};

describe("Mutation.removeCourse", () => {
  it("should return false if course not found", async () => {
    const findOneMock = jest
      .spyOn(repo.coursesRepository, "findOne")
      .mockResolvedValue(null);
    const course = { courseID: 999, courseName: "Nonexistent Course" };
    const result = await resolvers.Mutation.removeCourse(course, {
      courseID: "999",
    });
    expect(result).toBe(false);

    findOneMock.mockRestore();
  });

  it("should return true if course is successfully removed", async () => {
    jest
      .spyOn(repo.lecturerCoursesRepository, "delete")
      .mockResolvedValue({ affected: 1, raw: {} });
    jest
      .spyOn(repo.applicationCoursesRepository, "delete")
      .mockResolvedValue({ affected: 1, raw: {} });

    const mockCourse = {
      courseID: 1,
      courseName: "Test Course",
      applicantCourses: [],
      lecturerCourses: [],
    };
    const findOneMock = jest
      .spyOn(repo.coursesRepository, "findOne")
      .mockResolvedValue(mockCourse);

    const deleteMock = jest
      .spyOn(repo.coursesRepository, "delete")
      .mockResolvedValue({ affected: 1, raw: {} });

    const result = await resolvers.Mutation.removeCourse(mockCourse, {
      courseID: "1",
    });
    expect(result).toBe(true);

    findOneMock.mockRestore();
    deleteMock.mockRestore();
  });

  it("should remove related lecturer and application courses", async () => {
    const dummyCourseEntity = {
      courseID: 1,
      courseName: "COSC4253 Programming Studio 2",
      applicantCourses: [],
      lecturerCourses: [],
    };
    jest
      .spyOn(repo.coursesRepository, "findOne")
      .mockResolvedValue(dummyCourseEntity);

    jest
      .spyOn(repo.coursesRepository, "delete")
      .mockResolvedValue({ affected: 1, raw: {} });

    const deleteLecturerMock = jest
      .spyOn(repo.lecturerCoursesRepository, "delete")
      .mockResolvedValue({ affected: 1, raw: {} });

    const deleteApplicationMock = jest
      .spyOn(repo.applicationCoursesRepository, "delete")
      .mockResolvedValue({ affected: 1, raw: {} });

    await resolvers.Mutation.removeCourse(dummyCourseEntity, { courseID: "1" });

    expect(deleteLecturerMock).toHaveBeenCalledWith({
      course: dummyCourseEntity,
    });
    expect(deleteApplicationMock).toHaveBeenCalledWith({
      course: dummyCourseEntity,
    });

    deleteLecturerMock.mockRestore();
    deleteApplicationMock.mockRestore();
  });
});

describe("Mutation.editCourse", () => {
  it("should update the course name and return the updated course", async () => {
    const mockCourse = {
      courseID: 1,
      courseName: "Old Name",
      applicantCourses: [],
      lecturerCourses: [],
    };
    const findOneMock = jest
      .spyOn(repo.coursesRepository, "findOne")
      .mockResolvedValue(mockCourse);

    const saveMock = jest
      .spyOn(repo.coursesRepository, "save")
      .mockResolvedValue({
        ...mockCourse,
        courseName: "New Name",
        applicantCourses: [],
        lecturerCourses: [],
      });

    const course = { courseID: 999, courseName: "Nonexistent Course" };
    const result = await resolvers.Mutation.editCourse(course, {
      courseID: "1",
      courseName: "New Name",
    });
    expect(result.courseName).toBe("New Name");

    findOneMock.mockRestore();
    saveMock.mockRestore();
  });
});

describe("Mutation.addCourse", () => {
  it("should add a new course and return it", async () => {
    const newCourse = {
      courseID: 1,
      courseName: "New Course",
      applicantCourses: [],
      lecturerCourses: [],
    };
    const createMock = jest
      .spyOn(repo.coursesRepository, "create")
      .mockReturnValue(newCourse);
    const saveMock = jest
      .spyOn(repo.coursesRepository, "save")
      .mockResolvedValue(newCourse);

    const result = await resolvers.Mutation.addCourse(dummyCourse, {
      courseName: "New Course",
    });

    expect(result.courseName).toBe("New Course");

    createMock.mockRestore();
    saveMock.mockRestore();
  });

  it("should throw an error if the course already exists", async () => {
    const newCourse = {
      courseID: 1,
      courseName: "New Course",
      applicantCourses: [],
      lecturerCourses: [],
    };

    const createMock = jest
      .spyOn(repo.coursesRepository, "findOne")
      .mockResolvedValue(newCourse);

    await expect(
      resolvers.Mutation.addCourse(dummyCourse, {
        courseName: "Existing Course",
      })
    ).rejects.toThrow("Course with this name already exists");

    createMock.mockRestore();
  });
});
