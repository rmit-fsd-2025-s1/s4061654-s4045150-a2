import { useEffect } from "react";
import { useState } from "react";
import { userApi } from "../services/api";
export default function BlockCandidate() {
  type Candidate = {
    userid: number;
    firstName: string;
    lastName: string;
    role: string;
    isBlocked: boolean;
  };

  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<string>("");

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        userApi.getAllCandidates().then((candidates) => {
          const notYetBlocked = candidates.filter(
            (candidate: Candidate) => !candidate.isBlocked
          );
          setCandidates(notYetBlocked);
        });
      } catch (error) {
        console.error("Error fetching candidates:", error);
      }
    };

    fetchCandidates();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedCandidate) {
      alert("Please select a candidate.");
      return;
    }
    userApi
      .blockCandidate(Number(selectedCandidate), true) // Convert to number here
      .then(() => {
        alert("Candidate blocked successfully!");
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error blocking candidate:", error);
      });
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-black">Block Candidate</h1>
      <p className="mb-4 text-black">
        This feature allows you to block candidates from applying for courses.
      </p>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label
            htmlFor="candidateEmail"
            className="block text-sm font-medium text-gray-700"
          >
            Select Candidate to Block
          </label>
          <select
            id="candidateEmail"
            onChange={(e) => {
              console.log("Selected:", e.target.value);
              setSelectedCandidate(e.target.value);
            }}
            value={selectedCandidate}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-red-500 focus:ring-red-500 text-black"
            required
          >
            <option value="">Select a candidate</option>
            {candidates.map((candidate) => (
              <option key={candidate.userid} value={candidate.userid.toString()}>
                {candidate.firstName} {candidate.lastName}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          disabled={!selectedCandidate}
        >
          Block Candidate
        </button>
      </form>
    </div>
  );
}
