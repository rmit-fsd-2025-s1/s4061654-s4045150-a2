import React, { useEffect, useState } from "react";

import AddLecturerCourse from "../components/AddLecturerCourse";
import AddCourses from "../components/AddCourses";
import AvailableCourses from "../components/AvailableCourses";

export default function Lecturer() {
  return (
    <div>
      <AddCourses />
      <AvailableCourses />
    </div>
  );
}
