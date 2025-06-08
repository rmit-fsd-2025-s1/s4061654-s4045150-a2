import React from "react";
import { userApi } from "../services/api";
import { useEffect, useState } from "react";

type ChosenCandidates = {
  courseID: number;
  courseName: string;
  candidates: string[];
};

export default function MoreThanThreeChosen() {
  //State to hold all chosen candidates
  const [chosenCandidates, setChosenCandidates] = useState<ChosenCandidates[]>(
    []
  );
  //State to hold candidates chosen more than three times
  const [MoreThanThreeChosen, setMoreThanThreeChosen] = useState<string[]>([]);

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
    // Fetching chosen candidates when the component mounts
    fetchChosenCandidates();
  }, []);

  useEffect(() => {
    // Checking if any candidates have been chosen more than three times
    if (chosenCandidates.length > 0) {
      const allChosen: string[] = [];
      //GOing through each course and collecting all chosen candidates
      for (let i = 0; i < chosenCandidates.length; i++) {
        const course = chosenCandidates[i];
        for (let j = 0; j < course.candidates.length; j++) {
          allChosen.push(course.candidates[j]);
        }
      }
      //Counting the occurrences of each candidate
      //If a candidate is chosen more than three times, add them to the MoreThanThreeChosen state
      const countMap: { [name: string]: number } = {};
      allChosen.forEach((name) => {
        countMap[name] = (countMap[name] || 0) + 1;
      });
      //Filtering candidates who are chosen more than three times
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
