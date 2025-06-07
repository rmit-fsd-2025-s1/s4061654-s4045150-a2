import { userApi } from "../services/api";
import React, { useState, useEffect } from "react";
import { course } from "../types/course";

export default function AvailableCourses() {
  const [courses, setCourses] = useState<course[]>([]);
  const [editingCourseId, setEditingCourseId] = useState<number | null>(null);
  const [editCourseName, setEditCourseName] = useState<string>("");

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

  const startEditCourse = (c: number) => {
    const courseToEdit = courses.find((course) => course.courseID === c);
    if (!courseToEdit) return;
    setEditingCourseId(c);
    setEditCourseName(courseToEdit.courseName);
  };

  const saveEditCourse = async (c: number) => {
    await userApi.editCourse(c, editCourseName);
    setEditingCourseId(null);
    setEditCourseName("");
    window.location.reload();
  };

  return (
    <div className="bg-white shadow rounded-lg p-6 w-full max-w-md h-full flex flex-col items-center justify-center min-h-screen display-inline-block">
      <h2 className="text-xl font-semibold mb-4 text-black">
        Available Courses
      </h2>
      <p className="text-gray-600">List of courses available for applicants.</p>

      {courses.map((c) =>
        editingCourseId === c.courseID ? (
          <div key={c.courseID}>
            <input
              type="text"
              value={editCourseName}
              onChange={(e) => setEditCourseName(e.target.value)}
              className="border p-2 mt-2 w-full text-black"
            />
            <button
              className="text-black border p-2"
              onClick={() => handleRemoveCourse(c.courseID)}
            >
              Remove
            </button>
            <button
              className="text-black border p-2"
              onClick={() => saveEditCourse(c.courseID)}
            >
              Save
            </button>
            <button
              className="text-black border p-2"
              onClick={() => {
                setEditingCourseId(null);
                setEditCourseName("");
              }}
            >
              Cancel
            </button>
          </div>
        ) : (
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
              onClick={() => startEditCourse(c.courseID)}
            >
              Edit
            </button>
          </div>
        )
      )}
    </div>
  );
}
