import React, { useEffect, useState } from "react";
import { userApi } from "../services/api";

export default function AddLecturerCourse() {
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

  const [lecturerCourses, setLecturerCourses] = useState<LecturerCourses[]>([]);

  useEffect(() => {
    userApi.getLecturerCourses().then((data: LecturerCourses[]) => {
      setLecturerCourses(data);
    });
  }, []);

  return (
    <div>
      <div className="bg-white shadow rounded-lg p-6 w-full max-w-md h-full flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-xl font-semibold mb-4 text-black">
          Lecturer Dashboard
        </h2>

        {lecturerCourses.length > 0 ? (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-black">
                  Lecturer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-black">
                  Course
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {lecturerCourses.map((lc) => (
                <tr key={lc.rowId}>
                  <td className="px-6 py-4 whitespace-nowrap text-black">
                    {lc.lecturer.firstName} {lc.lecturer.lastName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-black">
                    {lc.course.courseName}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-600">No courses assigned to lecturers.</p>
        )}
      </div>
    </div>
  );
}
