import "@testing-library/jest-dom";
import { getByLabelText, render, screen } from "@testing-library/react";
import TutorPage from "../src/pages/candidate";
import { AuthProvider } from "@/context/authContext";
import userEvent from "@testing-library/user-event";

describe("Apply for tutor page, application submitting", () => {
  it("shows error when required fields are missing", async () => {
    render(
      <AuthProvider>
        <TutorPage />
      </AuthProvider>
    );

    //No fields are filled in, so clicking the add to profile button should show an error message.
    userEvent.click(screen.getByTestId("prevExpBtn"));

    //If error is shown and is picked up by the test, it means the test passes.
    expect(
      await screen.findByText("Please fill out every detail before submitting.")
    ).toBeInTheDocument();
  });

  it("adds skills to the applicant profile", async () => {
    render(
      <AuthProvider>
        <TutorPage />
      </AuthProvider>
    );

    // Add skills
    const skillsInput = screen.getByPlaceholderText(
      "Press enter to add skills"
    );
    await userEvent.type(skillsInput, "Leadership{enter}");
    await userEvent.type(skillsInput, "Time Management{enter}");

    // Check if the skills are added
    expect(await screen.findByText("Leadership")).toBeInTheDocument();
    expect(await screen.findByText("Time Management")).toBeInTheDocument();
  });
});
