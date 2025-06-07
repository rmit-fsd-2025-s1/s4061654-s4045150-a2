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
    <div>
      <div className="bg-white shadow rounded-lg p-6 w-full max-w-md h-full flex flex-col items-center justify-center min-h-screen float-right display-inline-block">
        {blockedCandidates.length > 0 ? (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-black">
                  Blocked candidates
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {blockedCandidates.map((l) => (
                <tr key={l.userid}>
                  <td className="px-6 py-4 whitespace-nowrap text-black">
                    {l.firstName} {l.lastName}
                    <button
                      onClick={() => handleUnblock(l.userid)}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                      Unblock
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-600">No candidates have been blocked</p>
        )}
      </div>
    </div>
  );
}
