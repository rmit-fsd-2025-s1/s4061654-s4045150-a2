import { userApi } from "../services/api";
import React, { useState, useEffect } from "react";
import { course } from "../types/course";

export default function AvailableCourses() {
  // States to hold the list of courses, currently editing course ID, and the name for editing
  const [courses, setCourses] = useState<course[]>([]);
  const [editingCourseId, setEditingCourseId] = useState<number | null>(null);
  const [editCourseName, setEditCourseName] = useState<string>("");

  useEffect(() => {
    //On mount, fetch all courses from the API
    userApi.getAllCourses().then((data: course[]) => {
      setCourses(data);
    });
  }, []);

  const handleRemoveCourse = (c: number) => {
    //When remove is clicked, call the API to remove the course
    userApi.removeCourse(c);
    window.location.reload();
  };

  const startEditCourse = (c: number) => {
    //When edit is clicked, set the course to be edited
    //Finding the course by ID for editing
    const courseToEdit = courses.find((course) => course.courseID === c);
    //If course is not found, return
    if (!courseToEdit) {
      return;
    }
    //Set the editing course ID and the course name to be edited
    setEditingCourseId(c);
    setEditCourseName(courseToEdit.courseName);
  };

  const saveEditCourse = async (c: number) => {
    //When save is clicked, call the API to edit the course
    await userApi.editCourse(c, editCourseName);
    setEditingCourseId(null);
    setEditCourseName("");
    window.location.reload();
  };

  return (
    <div className="w-full max-w-sm bg-white p-6 rounded-lg shadow-md flex flex-col">
      <h2 className="text-xl font-semibold mb-2 text-blue-700">
        Available Courses
      </h2>
      <p className="text-gray-600 mb-4">
        List of courses available for applicants.
      </p>
      <div className="flex-1 overflow-y-auto" style={{ maxHeight: "400px" }}>
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
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  onClick={() => handleRemoveCourse(c.courseID)}
                >
                  Remove
                </button>
                <button
                  className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                  onClick={() => saveEditCourse(c.courseID)}
                >
                  Save
                </button>
                <button
                  className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500"
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
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  onClick={() => handleRemoveCourse(c.courseID)}
                >
                  Remove
                </button>
                <button
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
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
