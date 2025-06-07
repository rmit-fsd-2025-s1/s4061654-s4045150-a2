import React, { useEffect, useState } from "react";
import { userApi } from "../services/api";

export default function ShowLecturerCourses() {
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

  const [allLecturers, setAllLecturers] = useState<AllLecturers[]>([]);

  const [lecturerCourses, setLecturerCourses] = useState<LecturerCourses[]>([]);

  useEffect(() => {
    userApi.getAllLecturers().then((data: AllLecturers[]) => {
      setAllLecturers(data);
    });
    userApi.getLecturerCourses().then((data: LecturerCourses[]) => {
      setLecturerCourses(data);
    });
  }, []);

  return (
    <div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-blue-700">
        Courses Assigned to Lecturers
      </h2>
      <div
        className="overflow-x-auto"
        style={{ maxHeight: "400px", overflowY: "auto" }}
      >
        {lecturerCourses.length > 0 ? (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-black">
                  Lecturer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-black">
                  Courses
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {allLecturers.length > 0 ? (
                allLecturers.map((l) => {
                  const courses = lecturerCourses
                    .filter(
                      (lc: LecturerCourses) => lc.lecturer.userid === l.userid
                    )
                    .map((lc) => lc.course.courseName);

                  return (
                    <tr key={l.userid}>
                      <td className="px-6 py-4 whitespace-nowrap text-black">
                        {l.firstName} {l.lastName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-black">
                        {courses.length > 0
                          ? courses.map((course, index) => (
                              <div key={index}>{course}</div>
                            ))
                          : "No course assigned"}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={2}
                    className="px-6 py-4 text-center text-gray-600"
                  >
                    No lecturers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-600">No courses assigned to lecturers.</p>
        )}
      </div>
    </div>
  );
}
