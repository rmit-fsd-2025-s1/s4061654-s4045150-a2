import React, { useEffect, useState } from "react";
import { userApi } from "../services/api";

export default function ChosenCandidatesEach({}) {
  type Courses = {
    courseID: number;
    courseName: string;
  };

  type ChosenCandidates = {
    courseID: number;
    courseName: string;
    candidates: string[];
  };
  useEffect(() => {
    //Fetch all courses and chosen candidates when the component mounts
    fetchCourses();
    fetchChosenCandidates();
  }, []);

  const [allCourses, setAllCourses] = useState<Courses[]>([]);
  const [chosenCandidates, setChosenCandidates] = useState<ChosenCandidates[]>(
    []
  );

  // Function to fetch all courses from the API
  const fetchCourses = async () => {
    // Fetching all courses to display in the table
    userApi
      .getAllCourses()
      .then((response) => {
        setAllCourses(response);
      })
      .catch((error) => {
        console.error("Error fetching candidates:", error);
      });
  };

  const fetchChosenCandidates = async () => {
    try {
      // Fetching chosen candidates for each course
      const response = await userApi
        .getChosenCandidatesByCourse()
        .then((data) => {
          // Storing the chosen candidates for each course
          setChosenCandidates(data);
        });

      console.log(response);
    } catch (error) {
      console.error("Error fetching chosen candidates:", error);
    }
  };

  return (
    <div className="w-full bg-white p-6 rounded-lg shadow-md mb-4">
      <h1 className="text-2xl font-bold mb-4 text-blue-700">
        Chosen Candidates for Each Course
      </h1>
      <div
        className="overflow-x-auto"
        style={{ maxHeight: "350px", overflowY: "auto" }}
      >
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b text-black">Course Name</th>
              <th className="py-2 px-4 border-b text-black">
                Chosen Candidates
              </th>
            </tr>
          </thead>
          <tbody>
            {allCourses.map((course) => {
              const courseFound = chosenCandidates.find(
                (c) => c.courseID == course.courseID
              );
              return (
                <tr key={course.courseID}>
                  <td className="py-2 px-4 border-b text-black">
                    {course.courseName}
                  </td>
                  <td className="py-2 px-4 border-b text-black">
                    {courseFound && courseFound.candidates.length > 0
                      ? courseFound.candidates.join(", ")
                      : "No candidates chosen"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
