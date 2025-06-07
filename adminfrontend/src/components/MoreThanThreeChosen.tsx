import React from "react";
import { userApi } from "../services/api";
import { useEffect, useState } from "react";

type Candidate = {
  userid: number;
  firstName: string;
  lastName: string;
  role: string;
  isBlocked: boolean;
};

type Courses = {
  courseID: string;
  courseName: string;
};

type ChosenCandidates = {
  courseID: string;
  courseName: string;
  candidates: string[];
};

export default function MoreThanThreeChosen() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [chosenCandidates, setChosenCandidates] = useState<ChosenCandidates[]>(
    []
  );
  const [MoreThanThreeChosen, setMoreThanThreeChosen] = useState<String[]>([]);

  const fetchAllCandidates = async () => {
    try {
      const response = await userApi.getAllCandidates().then((candidates) => {
        setCandidates(candidates);
      });
      return response;
    } catch (error) {
      console.error("Error fetching candidates:", error);
    }
  };

  const fetchChosenCandidates = async () => {
    try {
      const response = await userApi
        .getChosenCandidatesByCourse()
        .then((data) => {
          setChosenCandidates(data);
        });
      return response;
    } catch (error) {
      console.error("Error fetching chosen candidates:", error);
    }
  };

  const checkMoreThanThreeChosen = () => {
    const allChosen: string[] = [];

    // Collect all candidate names from all courses
    for (let i = 0; i < chosenCandidates.length; i++) {
      const course = chosenCandidates[i];
      for (let j = 0; j < course.candidates.length; j++) {
        allChosen.push(course.candidates[j]);
      }
    }

    // Count occurrences
    const countMap: { [name: string]: number } = {};
    allChosen.forEach((name) => {
      countMap[name] = (countMap[name] || 0) + 1;
    });

    // Find names chosen more than 3 times
    const overChosen = Object.keys(countMap).filter(
      (name) => countMap[name] > 3
    );

    setMoreThanThreeChosen(overChosen);
  };
  useEffect(() => {
    fetchAllCandidates();
    fetchChosenCandidates();
  }, []);

  useEffect(() => {
    if (chosenCandidates.length > 0) {
      checkMoreThanThreeChosen();
    }
  }, [chosenCandidates]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4 text-red-600">
          Candidates chosen more than three times
        </h2>
        {MoreThanThreeChosen.length > 0 ? (
          <ul className="list-disc pl-5">
            {MoreThanThreeChosen.map((candidate, index) => (
              <li key={index} className="text-black">
                {candidate}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">
            No candidates chosen more than three times.
          </p>
        )}
      </div>
    </div>
  );
}
