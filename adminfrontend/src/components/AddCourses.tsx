import { userApi } from "../services/api";
import { useState } from "react";

export default function AddCourses() {
  //Course name state to hold the name
  const [courseName, setCourseName] = useState("");
  //States to manage error and success messages
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    //Check if course name is empty
    if (!courseName) {
      setError("Course name cannot be empty.");
      return;
    }
    //Call the API to add the course
    userApi.addCourse(courseName);
    if (!userApi.addCourse) {
      setError("Failed to add course. Please try again.");
    } else {
      setSuccess("Course added successfully.");
      window.location.reload();
    }
  };

  return (
    <div className="w-full max-w-sm bg-white p-6 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-blue-700">Add Course</h1>
      <label
        className="block text-sm font-medium text-black mb-2"
        htmlFor="courseName"
      >
        Course Name
      </label>
      <input
        type="text"
        id="courseName"
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500 text-black mb-4"
        placeholder="Enter course name"
        value={courseName}
        onChange={(e) => {
          setError("");
          setCourseName(e.target.value);
        }}
        required
      />
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200"
        onClick={handleClick}
      >
        Add Course
      </button>
      {error && <p className="text-red-500 mt-3 text-center">{error}</p>}
      {success && <p className="text-green-600 mt-3 text-center">{success}</p>}
    </div>
  );
}
