import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import LoginBox from "../src/pages/components/LoginBox";
import { AuthProvider } from "@/pages/context/authContext";
import userEvent from "@testing-library/user-event";

// Mocking router
const mockPush = jest.fn();

jest.mock("next/router", () => ({
  useRouter: jest.fn(() => ({
    push: mockPush,
  })),
}));

describe("LoginBox (Login component for user authentication)", () => {
  it("renders the login component fully", () => {
    render(
      <AuthProvider>
        <LoginBox />
      </AuthProvider>
    );

    //Check if email, password and login button are present in the document.
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Login" })).toBeInTheDocument();

    //If all these are present, it can be assumed that the login component is fully rendered.
  });

  it("clicking with an invalid email gives an error", async () => {
    render(
      <AuthProvider>
        <LoginBox />
      </AuthProvider>
    );

    // Type in the email and password fields, with the email being invalid.
    await userEvent.type(screen.getByLabelText("Email"), "invalid");
    await userEvent.type(screen.getByLabelText("Password"), "Password123");

    // After typing the email and password in, click on the login button.
    await userEvent.click(screen.getByRole("button", { name: "Login" }));

    // If the email is invalid, an error message should be displayed.
    expect(
      await screen.findByText("Please enter a valid email.")
    ).toBeInTheDocument();

    //Test passes if error message is displayed.
  });

  it("logging in with correct credentials routes to tutor page", async () => {
    render(
      <AuthProvider>
        <LoginBox />
      </AuthProvider>
    );

    // Type in the email and password fields, both of them valid and in localStorage.
    await userEvent.type(screen.getByLabelText("Email"), "fred@yahoo.com");
    await userEvent.type(screen.getByLabelText("Password"), "Password123");

    // After typing the email and password in, click on the login button.
    await userEvent.click(screen.getByRole("button", { name: "Login" }));

    // If the email and password are valid, a success message should be displayed.
    expect(
      await screen.getByText("Welcome user! Redirecting...")
    ).toBeInTheDocument();

    //If all passes, the user should be redirected to the apply for tutor page.
    // This is done by checking if the router push function was called with the correct URL.
    expect(await mockPush).toHaveBeenCalledWith("/tutor");
  });
});
