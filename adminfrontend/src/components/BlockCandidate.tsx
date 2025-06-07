import { useEffect, useState } from "react";
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
    typeof window !== "undefined";
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
      .blockCandidate(Number(selectedCandidate), true)
      .then(() => {
        alert("Candidate blocked successfully!");
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error blocking candidate:", error);
      });
  };

  return (
    <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-red-700">Block Candidate</h1>
      <p className="mb-4 text-gray-700">
        Block a candidate from applying for courses.
      </p>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label
            htmlFor="candidateEmail"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Select Candidate to Block
          </label>
          <select
            id="candidateEmail"
            onChange={(e) => setSelectedCandidate(e.target.value)}
            value={selectedCandidate}
            className="block w-full border border-gray-300 rounded-md shadow-sm focus:border-red-500 focus:ring-red-500 text-black px-3 py-2"
            required
          >
            <option value="">Select a candidate</option>
            {candidates.map((candidate) => (
              <option
                key={candidate.userid}
                value={candidate.userid.toString()}
              >
                {candidate.firstName} {candidate.lastName}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 font-semibold transition"
          disabled={!selectedCandidate}
        >
          Block Candidate
        </button>
      </form>
    </div>
  );
}
