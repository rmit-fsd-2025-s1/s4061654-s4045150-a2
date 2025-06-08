import React, { useEffect, useState } from "react";
import { userApi } from "../services/api";

type Candidate = {
  userid: number;
  firstName: string;
  lastName: string;
  role: string;
  isBlocked: boolean;
};

type ChosenCandidates = {
  courseID: number;
  courseName: string;
  candidates: string[];
};

export default function NeverChosen() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [chosenCandidates, setChosenCandidates] = useState<ChosenCandidates[]>(
    []
  );
  // State to hold candidates who have never been chosen
  const [NeverChosen, setNeverChosen] = useState<string[]>([]);

  const fetchAllCandidates = async () => {
    try {
      // Fetching all candidates from the API
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
      // Fetching chosen candidates for each course
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

  useEffect(() => {
    // Fetching all candidates and chosen candidates when the component mounts
    fetchAllCandidates();
    fetchChosenCandidates();
  }, []);

  useEffect(() => {
    // Checking if there are candidates who have never been chosen
    if (candidates.length > 0 && chosenCandidates.length > 0) {
      const allChosen: string[] = [];
      // Collecting all chosen candidates from each course
      for (let i = 0; i < chosenCandidates.length; i++) {
        const course = chosenCandidates[i];
        for (let j = 0; j < course.candidates.length; j++) {
          allChosen.push(course.candidates[j]);
        }
      }

      const chosenSet = new Set(allChosen);

      const neverChosen = candidates
        .map((c) => `${c.firstName} ${c.lastName}`)
        .filter((fullName) => !chosenSet.has(fullName));

      setNeverChosen(neverChosen);
    }
  }, [candidates, chosenCandidates]);

  return (
    <div className="w-full bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-blue-700">
        Candidates Who Have Never Been Chosen
      </h2>
      {candidates.length === 0 || chosenCandidates.length === 0 ? (
        <p className="text-gray-500">Loading...</p>
      ) : NeverChosen.length > 0 ? (
        <ul className="list-disc pl-5">
          {NeverChosen.map((candidate, index) => (
            <li key={index} className="text-black">
              {candidate}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">
          All candidates have been chosen at least once.
        </p>
      )}
    </div>
  );
}
