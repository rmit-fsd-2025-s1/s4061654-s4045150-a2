import { userApi } from "../services/api";
import { useEffect, useState } from "react";

export default function AddLecturerCourse() {
  type AllLecturers = {
    userid: number;
    firstName: string;
    lastName: string;
    role: string;
  };

  type AllCourses = {
    courseID: number;
    courseName: string;
  };

  const [allLecturers, setAllLecturers] = useState<AllLecturers[]>([]);
  const [selectedLecturer, setSelectedLecturer] = useState<number>();
  const [selectedCourse, setSelectedCourse] = useState<number>();
  const [availableCourses, setAvailableCourses] = useState<AllCourses[]>();

  useEffect(() => {
    fetchLecturersAndCourses();
  }, []);

  const fetchLecturersAndCourses = async () => {
    try {
      const response = await userApi.getAllLecturers();
      setAllLecturers(response);
    } catch (error) {
      console.error("Error fetching lecturers:", error);
    }
    try {
      const response = await userApi.getAllCourses();
      setAvailableCourses(response);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedLecturer) {
      alert("Please select a lecturer.");
      return;
    }
    if (!selectedCourse) {
      alert("Please select a course.");
      return;
    }
    try {
      await userApi.assignLecturerCourse(selectedLecturer, selectedCourse);
      alert("Course assigned to lecturer!");
      window.location.reload();
    } catch (error) {
      alert("Error assigning course: " + error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray display-inline-block">
      <h1 className="text-2xl font-bold mb-4">Assign Lecturers to Courses</h1>
      <form
        className="w-full max-w-md bg-white p-6 rounded-lg shadow-md"
        onSubmit={handleSubmit}
      >
        <div className="mb-4">
          <label
            className="block text-sm font-medium text-black mb-2"
            htmlFor="lecturerName"
          >
            Lecturer
          </label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500 text-black"
            id="lecturerName"
            value={selectedLecturer?.toString() || ""}
            onChange={(e) => setSelectedLecturer(Number(e.target.value))}
          >
            <option value="">Select Lecturer</option>
            {allLecturers.map((lecturer) => (
              <option key={lecturer.userid} value={lecturer.userid}>
                {lecturer.firstName} {lecturer.lastName}
              </option>
            ))}
          </select>

          <label
            className="block text-sm font-medium text-black mb-2"
            htmlFor="courseName"
          >
            Course
          </label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500 text-black"
            id="courseName"
            value={selectedCourse?.toString() || ""}
            onChange={(e) => setSelectedCourse(Number(e.target.value))}
          >
            <option value="">Select Courses</option>
            {(availableCourses ?? []).map((course) => (
              <option key={course.courseID} value={course.courseID}>
                {course.courseName}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4"></div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200"
        >
          Add Course
        </button>
      </form>
    </div>
  );
}
