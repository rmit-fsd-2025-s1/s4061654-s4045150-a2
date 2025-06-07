import React, { useEffect, useState } from "react";

import ShowLecturerCourses from "../components/ShowLecturerCourses";
import AddCourses from "../components/AddCourses";
import AvailableCourses from "../components/AvailableCourses";
import AddLecturerCourse from "../components/AddLecturerCourse";
import BlockCandidate from "../components/BlockCandidate";
import ShowBlockedCandidates from "../components/ShowBlockedCandidates";

export default function Lecturer() {
  return (
    <div>
      <AddCourses />
      <AvailableCourses />
      <ShowLecturerCourses />
      <AddLecturerCourse />
      <BlockCandidate />
      <ShowBlockedCandidates />
    </div>
  );
}
