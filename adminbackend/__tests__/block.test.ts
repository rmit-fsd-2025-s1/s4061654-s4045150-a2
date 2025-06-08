import { describe, it, expect, jest } from "@jest/globals";
import { resolvers } from "../src/graphql/resolvers";
import * as repo from "../src/data-source";
import { course } from "../src/types/course";

describe("Mutation.blockCandidate", () => {
  it("should return false if candidate not found", async () => {
    // Mock the findOne method to return null, simulating a user being found
    const findOneMock = jest
      .spyOn(repo.userInformationRepository, "findOne")
      .mockResolvedValue(null);

    // We call the blockCandidate mutation with a non-existing userID
    await expect(
      resolvers.Mutation.blockCandidate(
        { userID: "1" },
        { userid: "1", isBlocked: true }
      )
      //It throws an error because the user is not found
    ).rejects.toThrow("User not found");
  });
});
