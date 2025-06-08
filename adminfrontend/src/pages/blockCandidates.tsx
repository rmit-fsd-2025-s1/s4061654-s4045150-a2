import BlockCandidate from "@/components/BlockCandidate";
import ShowBlockedCandidates from "@/components/ShowBlockedCandidates";
import Navbar from "@/components/Navbar";
import { useEffect } from "react";

export default function LecturerCourses() {
  useEffect(() => {
    // Check if the user is logged in
    const loggedIn = localStorage.getItem("AdminloggedIn");
    if (!loggedIn) {
      // If not logged in, redirect to the home page
      window.location.href = "/";
    }
  }, []);
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-50 flex flex-col">
      <Navbar />
      <main className="flex flex-col md:flex-row gap-10 w-full max-w-6xl mx-auto mt-10 p-6 rounded-lg shadow-lg bg-white">
        <section className="w-full md:w-1/2 flex flex-col gap-6">
          <BlockCandidate />
        </section>
        <section className="w-full md:w-1/2 flex flex-col gap-6">
          <ShowBlockedCandidates />
        </section>
      </main>
    </div>
  );
}
