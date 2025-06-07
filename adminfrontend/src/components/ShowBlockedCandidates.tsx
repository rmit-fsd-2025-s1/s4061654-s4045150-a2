import React, { useEffect, useState } from "react";
import { userApi } from "../services/api";

export default function ShowBlockedCandidates() {
  type Candidate = {
    userid: number;
    firstName: string;
    lastName: string;
    role: string;
    isBlocked: boolean;
  };
  const [blockedCandidates, setBlockedCandidates] = useState<Candidate[]>([]);

  useEffect(() => {
    typeof window !== "undefined";
    const fetchBlockedCandidates = async () => {
      try {
        userApi.getAllCandidates().then((candidates: Candidate[]) => {
          const blocked = candidates.filter(
            (candidate: Candidate) => candidate.isBlocked
          );
          setBlockedCandidates(blocked);
        });
      } catch (error) {
        console.error("Error fetching blocked candidates:", error);
      }
    };

    fetchBlockedCandidates();
  }, []);

  const handleUnblock = async (userid: number) => {
    try {
      await userApi.blockCandidate(userid, false);
      setBlockedCandidates((prev) =>
        prev.filter((candidate) => candidate.userid !== userid)
      );
      alert("Candidate unblocked successfully!");
      window.location.reload();
    } catch (error) {
      console.error("Error unblocking candidate:", error);
    }
  };

  return (
    <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-red-700">
        Blocked Candidates
      </h2>
      <div className="overflow-y-auto" style={{ maxHeight: "350px" }}>
        {blockedCandidates.length > 0 ? (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-black">
                  Name
                </th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {blockedCandidates.map((l) => (
                <tr key={l.userid}>
                  <td className="px-6 py-4 whitespace-nowrap text-black">
                    {l.firstName} {l.lastName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleUnblock(l.userid)}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 font-semibold transition"
                    >
                      Unblock
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-600">No candidates have been blocked.</p>
        )}
      </div>
    </div>
  );
}
