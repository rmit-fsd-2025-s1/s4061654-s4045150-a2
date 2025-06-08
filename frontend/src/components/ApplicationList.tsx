import React, { useState } from "react";
import Button from "./Button";
import { course } from "@/types/course";

type CardProps = {
  name: string;
  course: course; // changed from string
  applicantId: number;
  position?: string;
  isSelected: boolean;
  isRanked: boolean;
  currentRank?: 1 | 2 | 3;
  onToggleSelect: (applicantId: number, courseId: number) => void;
  onToggleRank: (applicantId: number, courseId: number) => void;
  onSetRank: (rank: 1 | 2 | 3) => void;
  onDeleteRank: () => void;
  handleShowInfo: (name: string, course: course) => void;
};

function ApplicationListCard({
  name,
  course,
  applicantId,
  position,
  isSelected,
  isRanked,
  currentRank,
  onToggleSelect,
  onToggleRank,
  onSetRank,
  onDeleteRank,
  handleShowInfo,
}: CardProps) {
  // State for toggling the show info button (not used for logic here)
  const [showInfoClicked, setShowInfoClicked] = useState(false);

  return (
    <div className="tutorCard">
      {/* Applicant name */}
      <div className="inline-name">
        <h2>{name}</h2>
      </div>

      {/* Show info button */}
      <Button name="Show info" func={() => handleShowInfo(name, course)} />
      <br />

      {/* Course and position info */}
      <p>Course: {course.courseName}</p>
      {position && <p>Position: {position}</p>}
      <br />

      {/* Select/deselect candidate button */}
      <button
        data-testid="Select"
        style={{ color: "#000" }}
        onClick={() => onToggleSelect(applicantId, course.courseID)}
      >
        {isSelected ? "Deselect this candidate" : "Select this candidate"}
      </button>

      {/* Ranking controls, only enabled if selected */}
      <div style={{ marginTop: 8 }}>
        <label>Ranking:&nbsp;</label>
        {[1, 2, 3].map((rank) => (
          <button
            key={rank}
            disabled={!isSelected || (isRanked && currentRank !== rank)}
            style={{
              color: "#000",
              fontWeight: currentRank === rank ? "bold" : undefined,
              marginRight: 4,
            }}
            onClick={() => {
              if (currentRank === rank) {
                onDeleteRank();
              } else {
                onSetRank(rank as 1 | 2 | 3);
              }
            }}
          >
            {currentRank === rank ? `Remove ${rank}` : `Set ${rank}`}
          </button>
        ))}
      </div>
    </div>
  );
}

export default ApplicationListCard;
