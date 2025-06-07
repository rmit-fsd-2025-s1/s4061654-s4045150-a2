import React, { useEffect, useState } from "react";
import { userApi } from "../services/api";

export default function ChosenCandidatesEach({}) {
  type Courses = {
    courseID: string;
    courseName: string;
  };

  type ChosenCandidates = {
    courseID: string;
    courseName: string;
    candidates: string[];
  };
  useEffect(() => {
    fetchCourses();
    fetchChosenCandidates();
  }, []);

  const [allCourses, setAllCourses] = useState<Courses[]>([]);
  const [chosenCandidates, setChosenCandidates] = useState<ChosenCandidates[]>(
    []
  );

  const fetchCourses = async () => {
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
      const response = await userApi
        .getChosenCandidatesByCourse()
        .then((data) => {
          setChosenCandidates(data);
        });

      console.log(response);
    } catch (error) {
      console.error("Error fetching chosen candidates:", error);
    }
  };

  return (
    <div className="flex items-center justify-between p-2 border-b">
      <div>
        <h1 className="text-2xl font-bold mb-4 text-black">
          Chosen Candidates for Each Course
        </h1>
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
