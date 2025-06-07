import BlockCandidate from "@/components/BlockCandidate";
import ShowBlockedCandidates from "@/components/ShowBlockedCandidates";
import Navbar from "@/components/Navbar";

export default function LecturerCourses() {
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
