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
  //Selected candidate to block
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<string>("");

  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  useEffect(() => {
    //Fetching all candidates on component mount
    const fetchCandidates = async () => {
      try {
        //Then filtering out the candidates who are already blocked
        userApi.getAllCandidates().then((candidates) => {
          const notYetBlocked = candidates.filter(
            (candidate: Candidate) => !candidate.isBlocked
          );
          //After filtering, setting the candidates state
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
    //When the form is submitted, check if a candidate is selected
    if (!selectedCandidate) {
      setError("Please select a candidate to block.");
      return;
    }
    //If a candidate is selected, call the API to block the candidate
    userApi
      .blockCandidate(Number(selectedCandidate), true)
      .then(() => {
        setSuccess("Candidate blocked successfully.");
        setTimeout(() => {
          window.location.reload();
        }, 1000);
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
        {error && <p className="text-red-500 mt-3 text-center">{error}</p>}
        {success && (
          <p className="text-green-600 mt-3 text-center">{success}</p>
        )}
      </form>
    </div>
  );
}
