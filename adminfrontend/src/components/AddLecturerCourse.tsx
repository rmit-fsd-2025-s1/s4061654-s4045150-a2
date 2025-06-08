import { userApi } from "../services/api";
import { useEffect, useState } from "react";

export default function AddLecturerCourse() {
  //All the required types for the component
  // These types are used to define the structure of the data being fetched and manipulated
  type LecturerCourses = {
    rowId: number;
    lecturer: {
      userid: number;
      firstName: string;
      lastName: string;
    };
    course: {
      courseID: number;
      courseName: string;
    };
  };
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
  // States to hold the fetched data and user selections
  const [allLecturers, setAllLecturers] = useState<AllLecturers[]>([]);
  const [selectedLecturer, setSelectedLecturer] = useState<string>();
  const [selectedCourse, setSelectedCourse] = useState<string>();
  const [availableCourses, setAvailableCourses] = useState<AllCourses[]>();
  // State to hold all the lecturer courses
  const [lecturerCourses, setLecturerCourses] = useState<LecturerCourses[]>([]);

  // States to manage error and success messages
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  useEffect(() => {
    fetchLecturersAndCourses();

    userApi.getLecturerCourses().then(setLecturerCourses);
  }, []);

  const fetchLecturersAndCourses = async () => {
    try {
      // Fetching all lecturers and courses from the API to show in dropdown
      const response = await userApi.getAllLecturers();
      setAllLecturers(response);
    } catch (error) {
      console.error("Error fetching lecturers:", error);
    }
    try {
      // Fetching all courses from the API to show in dropdown
      const response = await userApi.getAllCourses();
      setAvailableCourses(response);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    //If no lecturer or course is selected, show an error
    if (!selectedLecturer) {
      setError("Please select a lecturer.");
      return;
    }
    if (!selectedCourse) {
      setError("Please select a course.");
      return;
    }
    // Validation: Check if this course is already assigned to this lecturer
    const alreadyAssigned = lecturerCourses.some(
      (lc) =>
        lc.lecturer.userid.toString() === selectedLecturer &&
        lc.course.courseID.toString() === selectedCourse
    );
    // If already assigned, show an alert and return
    if (alreadyAssigned) {
      setError("This course is already assigned to the selected lecturer.");
      return;
    }
    try {
      // Call the API to assign the course to the lecturer
      await userApi.assignLecturerCourse(
        Number(selectedLecturer),
        Number(selectedCourse)
      );
      // If the assignment is successful, show a success message and reload the page
      setSuccess("Course assigned to lecturer!");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      setError("Error assigning course: " + error);
    }
  };

  return (
    <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-blue-700">
        Assign Lecturer to Course
      </h1>
      <form onSubmit={handleSubmit}>
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
            value={selectedLecturer}
            onChange={(e) => {
              setError("");
              setSelectedLecturer(e.target.value);
            }}
          >
            <option value="">Select Lecturer</option>
            {allLecturers.map((lecturer) => (
              <option key={lecturer.userid} value={lecturer.userid.toString()}>
                {lecturer.firstName} {lecturer.lastName}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label
            className="block text-sm font-medium text-black mb-2"
            htmlFor="courseName"
          >
            Course
          </label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500 text-black"
            id="courseName"
            value={selectedCourse}
            onChange={(e) => {
              setError("");
              setSelectedCourse(e.target.value);
            }}
          >
            <option value="">Select Course</option>
            {(availableCourses ?? []).map((course) => (
              <option key={course.courseID} value={course.courseID.toString()}>
                {course.courseName}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200 font-semibold"
        >
          Assign Course
        </button>
        {error && <p className="text-red-500 mt-3 text-center">{error}</p>}
        {success && (
          <p className="text-green-600 mt-3 text-center">{success}</p>
        )}
      </form>
    </div>
  );
}
