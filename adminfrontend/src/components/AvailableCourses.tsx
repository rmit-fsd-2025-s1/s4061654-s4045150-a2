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
    <div className="min-h-screen bg-gray-100 flex items-start justify-start px-10 py-10">
      <div className="w-full max-w-sm bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-2 text-black">
          Available Courses
        </h2>
        <p className="text-gray-600 mb-4">
          List of courses available for applicants.
        </p>
        {courses.map((c) =>
          editingCourseId === c.courseID ? (
            <div key={c.courseID} className="mb-4">
              <input
                type="text"
                value={editCourseName}
                onChange={(e) => setEditCourseName(e.target.value)}
                className="border p-2 w-full text-black mb-2"
              />
              <div className="flex gap-2">
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded"
                  onClick={() => handleRemoveCourse(c.courseID)}
                >
                  Remove
                </button>
                <button
                  className="bg-green-500 text-white px-3 py-1 rounded"
                  onClick={() => saveEditCourse(c.courseID)}
                >
                  Save
                </button>
                <button
                  className="bg-gray-400 text-white px-3 py-1 rounded"
                  onClick={() => {
                    setEditingCourseId(null);
                    setEditCourseName("");
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div
              key={c.courseID}
              className="mb-4 border-b border-gray-200 pb-2"
            >
              <h3 className="text-lg font-medium text-black">{c.courseName}</h3>
              <div className="flex gap-2 mt-2">
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded"
                  onClick={() => handleRemoveCourse(c.courseID)}
                >
                  Remove
                </button>
                <button
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                  onClick={() => startEditCourse(c.courseID)}
                >
                  Edit
                </button>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
