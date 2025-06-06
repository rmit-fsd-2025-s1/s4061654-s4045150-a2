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
  const [showInfoClicked, setShowInfoClicked] = useState(false);

  return (
    <div className="tutorCard">
      <div className="inline-name">
        <h2>{name}</h2>
      </div>

      <Button name="Show info" func={() => handleShowInfo(name, course)} />
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

      {/* Ranking controls, only enabled if selected */}
      <div style={{ marginTop: 8 }}>
        <label>Ranking:&nbsp;</label>
        {[1, 2, 3].map((rank) => (
          <button
            key={rank}
            disabled={!isSelected || (isRanked && currentRank !== rank)}
            style={{
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
