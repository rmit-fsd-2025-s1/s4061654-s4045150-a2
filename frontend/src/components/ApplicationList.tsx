import React, { useState } from "react";
import Button from "./Button";
import { course } from "@/types/course"; // Assuming this is the correct path

type CardProps = {
  name: string;
  course: course; // changed from string
  applicantId: number;
  position?: string;
  isSelected: boolean;
  isRanked: boolean;
  onToggleSelect: (applicantId: number, courseId: number) => void;
  onToggleRank: (applicantId: number, courseId: number) => void;
  handleShowInfo: (name: string, course: course) => void;
};

function ApplicationListCard({
  name,
  course,
  applicantId,
  position,
  isSelected,
  isRanked,
  onToggleSelect,
  onToggleRank,
  handleShowInfo,
}: CardProps) {
  const [showInfoClicked, setShowInfoClicked] = useState(false);

  return (
    <div className="tutorCard">
      <div className="inline-name">
        <h2>{name}</h2>
      </div>

      <Button
        name="Show info"
        func={() => {
          handleShowInfo(name, course);
          setShowInfoClicked(!showInfoClicked);
        }}
      />
      <br />

      <p>Course: {course.courseName}</p>
      {position && <p>Position: {position}</p>}
      <br />
  

      <button
        data-testid="Select"
        onClick={() => onToggleSelect(applicantId, course.courseID)}
      >
        {isSelected ? "Deselect this candidate" : "Select this candidate"}
      </button>

      <button
        data-testid="Rank"
        className="rankButton"
        onClick={() => onToggleRank(applicantId, course.courseID)}
        disabled={!isSelected}
      >
        {isRanked ? "Delete from ranking" : "Add to rankings"}
      </button>
    </div>
  );
}

export default ApplicationListCard;
