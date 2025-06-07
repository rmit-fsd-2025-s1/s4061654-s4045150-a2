import { userApi } from "../services/api";
import { useState } from "react";

export default function AddCourses() {
  const [courseName, setCourseName] = useState("");

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!courseName) {
      alert("Please enter a course name.");
      return;
    }
    userApi.addCourse(courseName);
    alert(courseName + " added successfully!");
    window.location.reload();
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
        onChange={(e) => setCourseName(e.target.value)}
        required
      />
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200"
        onClick={handleClick}
      >
        Add Course
      </button>
    </div>
  );
}
