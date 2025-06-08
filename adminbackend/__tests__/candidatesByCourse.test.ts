import { describe, it, expect, jest } from "@jest/globals";
import { resolvers } from "../src/graphql/resolvers";
import * as repo from "../src/data-source";
import { course } from "../src/types/course";

describe("Mutation.getChosenCandidatesByCourse", () => {
  it("should return candidates grouped by course", async () => {
    // Mocking the selectionsRepository to return a a mock selection data
    const mockSelections = [
      {
        application: {
          //Required applicant object with userID, firstName, and lastName
          applicant: { userID: "1", firstName: "Shafkat", lastName: "Tashrif" },
          applicantCourses: [
            //Required applicantCourses array with course objects
            { course: { courseID: 101, courseName: "COSC2444 Course" } },
            { course: { courseID: 102, courseName: "COSC5433 Course2" } },
          ],
        },
      },
      {
        //Another mock selection to test multiple candidates
        application: {
          applicant: { userID: "2", firstName: "Waqar", lastName: "Ali" },
          applicantCourses: [
            { course: { courseID: 101, courseName: "COSC2444 Course" } },
          ],
        },
      },
    ];

    // Mocking the selectionsRepository's find method to return the mock selections

    jest
      .spyOn(repo.selectionsRepository, "find")
      .mockResolvedValue(mockSelections as any);

    // Calling the getChosenCandidatesByCourse resolver
    // This will invoke the mocked selectionsRepository.find method
    const result = await resolvers.Query.getChosenCandidatesByCourse();

    // Checking the result to ensure it groups candidates by course correctly
    // The expected result should group candidates by courseID and courseName
    expect(result).toEqual([
      {
        courseID: 101,
        courseName: "COSC2444 Course",
        candidates: ["Shafkat Tashrif", "Waqar Ali"],
      },
      {
        courseID: 102,
        courseName: "COSC5433 Course2",
        candidates: ["Shafkat Tashrif"],
      },
    ]);

    // Verifying that the selectionsRepository.find method was called with the correct relations
    expect(repo.selectionsRepository.find).toHaveBeenCalledWith({
      relations: [
        "application",
        "application.applicant",
        "application.applicantCourses",
        "application.applicantCourses.course",
      ],
    });
  });
});
