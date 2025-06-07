import React from "react";
import { userApi } from "../services/api";
import { useEffect, useState } from "react";

type ChosenCandidates = {
  courseID: number;
  courseName: string;
  candidates: string[];
};

export default function MoreThanThreeChosen() {
  const [chosenCandidates, setChosenCandidates] = useState<ChosenCandidates[]>(
    []
  );
  const [MoreThanThreeChosen, setMoreThanThreeChosen] = useState<string[]>([]);

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

  useEffect(() => {
    fetchChosenCandidates();
  }, []);

  useEffect(() => {
    if (chosenCandidates.length > 0) {
      const allChosen: string[] = [];
      for (let i = 0; i < chosenCandidates.length; i++) {
        const course = chosenCandidates[i];
        for (let j = 0; j < course.candidates.length; j++) {
          allChosen.push(course.candidates[j]);
        }
      }
      const countMap: { [name: string]: number } = {};
      allChosen.forEach((name) => {
        countMap[name] = (countMap[name] || 0) + 1;
      });
      const overChosen = Object.keys(countMap).filter(
        (name) => countMap[name] > 3
      );
      setMoreThanThreeChosen(overChosen);
    }
  }, [chosenCandidates]);

  return (
    <div className="w-full bg-white p-6 rounded-lg shadow-md mb-4">
      <h2 className="text-xl font-semibold mb-4 text-blue-700">
        Candidates Chosen More Than Three Times
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
  );
}
