import { userApi } from "../services/api";
import React, { useState, useEffect } from "react";
import { course } from "../types/course";

export default function AvailableCourses() {
  const [courses, setCourses] = useState<course[]>([]);
  const [editCourse, setEditCourse] = useState<string>("");

  useEffect(() => {
    userApi.getAllCourses().then((data: course[]) => {
      setCourses(data);
    });
  }, []);

  const handleRemoveCourse = (c: number) => {
    userApi.removeCourse(c);
    alert("Course removed successfully");
    window.location.reload();
  };

  const handleEditCourse = (c: number) => {
    const courseToEdit = courses.find((course) => course.courseID === c);
    if (!courseToEdit) {
      return;
    }

    setEditCourse(courseToEdit.courseName);

    userApi.editCourse(c);
  };

  return (
    <div className="bg-white shadow rounded-lg p-6 w-full max-w-md h-full flex flex-col items-center justify-center min-h-screen ">
      <h2 className="text-xl font-semibold mb-4 text-black">
        Available Courses
      </h2>
      <p className="text-gray-600">List of courses available for applicants.</p>
      {courses.map((c) => (
        <div key={c.courseID} className="border-b border-gray-200 py-4">
          <h3 className="text-lg font-medium text-black">{c.courseName}</h3>
          <button
            className="text-black border p-2"
            onClick={() => handleRemoveCourse(c.courseID)}
          >
            Remove
          </button>
          <button
            className="text-black border p-2"
            onClick={() => handleEditCourse(c.courseID)}
          >
            Edit
          </button>
          {editCourse && editCourse === c.courseName && (
            <input
              type="text"
              value={editCourse}
              onChange={(e) => setEditCourse(e.target.value)}
              className="border p-2 mt-2 w-full"
            />
          )}
        </div>
      ))}
    </div>
  );
}
