import ChosenCandidatesEach from "@/components/ChosenCandidatesEach";
import MoreThanThreeChosen from "@/components/MoreThanThreeChosen";
import NeverChosen from "@/components/NeverChosen";
import Navbar from "@/components/Navbar";

export default function Reports() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-50 flex flex-col">
      <Navbar />
      <main className="flex flex-col md:flex-row gap-10 w-full max-w-6xl mx-auto mt-10 p-6 rounded-lg shadow-lg bg-white">
        <section className="w-full md:w-1/2 flex flex-col items-start gap-6">
          <ChosenCandidatesEach />
        </section>
        <section className="w-full md:w-1/2 flex flex-col items-start gap-6">
          <MoreThanThreeChosen />
          <NeverChosen />
        </section>
      </main>
    </div>
  );
}
