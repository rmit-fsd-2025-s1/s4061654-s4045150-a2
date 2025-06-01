import React, { useState } from "react";
import Button from "./Button";

type CardProps = {
  name: string;
  course: string;
  applicantId: number;
  isSelected: boolean;
  isRanked: boolean;
  onToggleSelect: (applicantId: number) => void;
  onToggleRank: (applicantId: number) => void;
  handleShowInfo: (name: string, course: string) => void;
};

function ApplicationListCard({
  name,
  course,
  applicantId,
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

      {/* Show info button */}
      <Button
        name="Show info"
        func={() => {
          handleShowInfo(name, course);
          setShowInfoClicked(!showInfoClicked);
        }}
      />
      <br />

      <p>Courses Applied: {course}</p>
      <br />

      {/* Select/Deselect button */}
      <button data-testid="Select" onClick={() => onToggleSelect(applicantId)}>
        {isSelected ? "Deselect this candidate" : "Select this candidate"}
      </button>

      {/* Rank/Unrank button */}
      <button
        data-testid="Rank"
        className="rankButton"
        onClick={() => onToggleRank(applicantId)}
        disabled={!isSelected}
      >
        {isRanked ? "Delete from ranking" : "Add to rankings"}
      </button>
    </div>
  );
}

export default ApplicationListCard;
