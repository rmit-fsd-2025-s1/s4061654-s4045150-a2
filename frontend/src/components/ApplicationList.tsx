import React from "react";
import Button from "./Button";
import { useState } from "react";

// Props type for the ApplicationListCard component
type CardProps = {
  name: string;
  course: string;
  clickSelect: () => void;
  selectedKeys: string[];
  rank: boolean;
  handleRanking: (name: string) => void;
  handleShowInfo: (name: string, course: string) => void;
};

// Component for displaying each applicant card
function ApplicationListCard({
  name,
  course,
  clickSelect,
  selectedKeys,
  rank,
  handleRanking,
  handleShowInfo,
}: CardProps) {
  // Local state to track if Show Info button was clicked
  const [showInfoClicked, setShowInfoClicked] = useState(false);

  const key = `${name}|${course}`;

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

      {/* Course info */}
      <p>Courses Applied: {course}</p>
      <br />

      {/* Select/Deselect button */}
      <button data-testid="Select" onClick={clickSelect}>
        {selectedKeys.includes(key)
          ? "Deselect this candidate"
          : "Select this candidate"}
      </button>

      {/* Rank/Unrank button */}
      <button
        data-testid="Rank"
        className="rankButton"
        onClick={() => handleRanking(name)}
        disabled={!selectedKeys.includes(key)}
      >
        {rank ? "Delete from ranking" : "Add to rankings"}
      </button>
    </div>
  );
}

export default ApplicationListCard;
