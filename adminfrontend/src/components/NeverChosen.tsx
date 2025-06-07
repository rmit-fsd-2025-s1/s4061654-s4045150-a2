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
  const [NeverChosen, setNeverChosen] = useState<String[]>([]);
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
    const allNeverChosen: string[] = [];

    // Collect all candidate names from all courses
    for (let i = 0; i < chosenCandidates.length; i++) {
      const course = chosenCandidates[i];
      for (let j = 0; j < course.candidates.length; j++) {
        allNeverChosen.push(course.candidates[j]);
      }
    }

    // Count occurrences
    const countMap: { [name: string]: number } = {};
    allNeverChosen.forEach((name) => {
      countMap[name] = (countMap[name] || 0) + 1;
    });

    const overChosen = Object.keys(countMap).filter(
      (name) => countMap[name] > 3
    );

    setMoreThanThreeChosen(overChosen);
  };
  const checkNeverChosen = () => {
    const allChosen: string[] = [];
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
  };

  useEffect(() => {
    typeof window !== "undefined";
    fetchAllCandidates();
    fetchChosenCandidates();
  }, []);

  useEffect(() => {
    if (chosenCandidates.length > 0) {
      checkMoreThanThreeChosen();
    }
  }, [chosenCandidates]);

  useEffect(() => {
    if (candidates.length > 0 && chosenCandidates.length > 0) {
      checkNeverChosen();
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
