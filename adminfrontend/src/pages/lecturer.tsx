import ShowLecturerCourses from "../components/ShowLecturerCourses";

import AddLecturerCourse from "../components/AddLecturerCourse";
import BlockCandidate from "../components/BlockCandidate";
import ShowBlockedCandidates from "../components/ShowBlockedCandidates";
import ChosenEach from "../components/ChosenCandidatesEach";
import MoreThanThreeChosen from "../components/MoreThanThreeChosen";
import NeverChosen from "../components/NeverChosen";
import Navbar from "../components/Navbar";
export default function Lecturer() {
  return (
    <div className="flex flex-row min-h-screen bg-gray-100">
      {/* Left Column */}
      <div className="w-1/3 p-4 space-y-6">
        <Navbar />
        <AddLecturerCourse />
      </div>
      {/* Center Column */}
      <div className="w-2/3 p-4 flex justify-center items-start">
        <ShowLecturerCourses />
      </div>

      <BlockCandidate />
      <ShowBlockedCandidates />
    </div>
  );
}
