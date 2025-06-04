// import userEvent from "@testing-library/user-event";
// import { render, screen } from "@testing-library/react";
// import InfoDetailsCard from "../src/components/InfoDetailsCard";

// import { AuthProvider } from "../src/context/authContext";
// import { experience } from "../src/types/experience";
// import { qualification } from "../src/types/qualification";

// import "@testing-library/jest-dom";
// import ApplicationListCard from "../src/components/ApplicationList";

// describe("LecturerPage dashboard", () => {
//   it("adds a comment, also throws an error if nothing is typed in", async () => {
//     // Mock applicatInfo object to simulate the application data
//     const mockCandidate = [
//       {
//         name: "Rishi Kumar",
//         coursesApplied: "COSC4043 Full Stack Development",
//         availability: "Full-time",
//         prevExp: [
//           {
//             position: "Software Engineer",
//             company: "ABC Corp",
//             description: "Worked on web applications",
//           },
//         ],
//         skills: ["JavaScript", "React"],
//         academics: [
//           {
//             degree: "Bachelor of Computer Science",
//             university: "RMIT University",
//             year: "2027",
//           },
//         ],
//         comment: [],
//       },
//     ];

//     render(
//       <AuthProvider>
//         <InfoDetailsCard showInfoTut={mockCandidate} />
//       </AuthProvider>
//     );

//     // Find the comment input field and type a comment
//     const commentInput = screen.getByPlaceholderText("Add a comment");
//     await userEvent.type(commentInput, "He's so good");

//     // Click the submit button to add the comment
//     await userEvent.click(
//       screen.getByRole("button", { name: "Submit Comment" })
//     );

//     // Check if the comment is displayed in the document
//     expect(await screen.findByText("He's so good")).toBeInTheDocument();

//     //If comment is added and displayed, it's working properly.

//     //If the user doesn't type anything in the comment box, it should throw an error.
//     // So we clear the input field and click the submit button again.
//     await userEvent.clear(commentInput);
//     await userEvent.click(
//       screen.getByRole("button", { name: "Submit Comment" })
//     );

//     //Should throw an error if the comment is empty.
//     expect(
//       await screen.findByText("Comment cannot be empty!")
//     ).toBeInTheDocument();

//     //Test passes if both of these conditions are met.
//   });

//   it("displays existing comments", () => {
//     // Mock application data with existing comment in it
//     const mockCandidate = [
//       {
//         name: "Smith Alone",
//         coursesApplied: "COSC4043 Full Stack Development",
//         availability: "Full-time",
//         prevExp: [],
//         skills: [],
//         academics: [],
//         comment: [
//           {
//             username: "Matt Hayward",
//             text: "Excellent candidate! I like him",
//             timestamp: "2025-04-13 10:00 AM",
//           },
//         ],
//       },
//     ];

//     render(
//       <AuthProvider>
//         <InfoDetailsCard showInfoTut={mockCandidate} />
//       </AuthProvider>
//     );

//     // Check if the existing comment is displayed
//     expect(
//       screen.getByText("Excellent candidate! I like him")
//     ).toBeInTheDocument();
//     expect(screen.getByText("Matt Hayward")).toBeInTheDocument();
//     expect(screen.getByText("(2025-04-13 10:00 AM)")).toBeInTheDocument();
//   });

//   it("check if when not selected, the add to ranking button stays disabled or not", () => {
//     render(
//       <ApplicationListCard
//         name="JameSon"
//         course="COSC4043 Course Thingy"
//         clickSelect={jest.fn()}
//         selectedKeys={[]}
//         rank={false}
//         handleRanking={jest.fn()}
//         handleShowInfo={jest.fn()}
//       />
//     );

//     // Check that the "Add to rankings" button is disabled
//     expect(screen.getByTestId("Rank")).toBeDisabled();
//   });
// });
