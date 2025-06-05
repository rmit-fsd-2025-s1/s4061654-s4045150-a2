import React, { useEffect, useState } from "react";

import AddLecturerCourse from "../components/AddLecturerCourse";

export default function Lecturer() {
  return (
    <div>
      <div className="bg-white shadow rounded-lg p-6 w-full max-w-md h-full flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-xl font-semibold mb-4 text-black">
          Lecturer Dashboard
        </h2>

        <AddLecturerCourse />
      </div>
    </div>
  );
}
