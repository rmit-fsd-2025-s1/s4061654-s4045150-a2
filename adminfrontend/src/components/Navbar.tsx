import Link from "next/link";
import { useAuth } from "@/context/adminAuth";
export default function Navbar() {
  const { user, logout } = useAuth();
  return (
    <header className="w-full bg-white shadow-md px-8 py-4 flex items-center justify-between">
      <div className="text-2xl font-bold text-blue-600">Admin Panel</div>
      <nav className="flex gap-8">
        <Link
          href="/course"
          className="text-black hover:text-blue-600 font-medium transition border-b-2 border-transparent hover:border-blue-600"
        >
          Course Management
        </Link>
        <Link
          href="/lecturerCourses"
          className="text-black hover:text-blue-600 font-medium transition border-b-2 border-transparent hover:border-blue-600"
        >
          Assign Courses to Lecturers
        </Link>
        <Link
          href="/blockCandidates"
          className="text-black hover:text-blue-600 font-medium transition border-b-2 border-transparent hover:border-blue-600"
        >
          Block Candidates
        </Link>
        <Link
          href="/Reports"
          className="text-black hover:text-blue-600 font-medium transition border-b-2 border-transparent hover:border-blue-600"
        >
          Reports
        </Link>
        <Link
          href="/"
          className="text-red-600 hover:text-red-800 font-medium transition border-b-2 border-transparent hover:border-red-800"
          onClick={(e) => {
            e.preventDefault();
            logout();
            window.location.href = "/";
          }}
        >
          Logout
        </Link>
      </nav>
    </header>
  );
}
