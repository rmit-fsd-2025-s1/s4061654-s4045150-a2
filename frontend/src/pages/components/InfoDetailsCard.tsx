import { useState } from "react";
import { useAuth } from "../context/authContext";
import { ApplicationInfo } from "../types/application";
import "../../styles/detailscard.css";

// Props for the component
type InfoProps = {
  showInfoTut?: ApplicationInfo[];
};

// Component to display detailed info about an application
function InfoDetailsCard({ showInfoTut }: InfoProps) {
  const [comment, setComment] = useState<string>("");
  const [noComment, setNoComment] = useState(false);
  const { user } = useAuth();

  // Function to handle submitting a comment for a specific application
  const handleSubmitComment = (application: ApplicationInfo) => {
    // Check if textarea is empty, if so, show error message
    if (!comment.trim()) {
      setNoComment(true);
      setTimeout(() => setNoComment(false), 1000);
      return;
    }

    if (!user) {
      alert("You must be signed in to add a comment.");
      return;
    }

    if (!application.comment) {
      application.comment = [];
    }

    //Storing the comment in comment object from types folder
    const userComment = {
      username: user.name,
      text: comment,
      timestamp: new Date().toLocaleString(),
    };

    // Add the new comment to the application's comment list
    application.comment.push(userComment);

    // Retrieve existing applications from localStorage
    const storedApplications = JSON.parse(
      localStorage.getItem("applicantInfo") || "[]"
    );

    // Update the comments for the matching application
    const updatedApplications = storedApplications.map(
      (app: ApplicationInfo) =>
        app.name === application.name &&
        app.coursesApplied === application.coursesApplied
          ? { ...app, comment: application.comment }
          : app
    );

    // Save updated applications back to localStorage
    localStorage.setItem("applicantInfo", JSON.stringify(updatedApplications));

    setComment(""); // Clear the comment input field
  };

  // Show message if no candidate is selected
  if (!showInfoTut || showInfoTut.length === 0) {
    return (
      <div
        className="infoCard"
        style={{ fontWeight: "bold", color: "#36454F" }}
      >
        Click 'Show info' to view more details.
      </div>
    );
  }

  return (
    // Displays detailed information about the selected application with formatting, as well as a comment section for lecturers to use.
    <div className="infoCard2">
      <h2 style={{ fontSize: "2.1rem" }}>{showInfoTut[0].name}</h2>
      {showInfoTut.map((application, index) => (
        <div key={index} style={{ marginBottom: "20px" }}>
          <p className="pStyle">Course Applied</p>
          <p>{application.coursesApplied}</p>
          <div className="margin">
            <p className="pStyle">Availability</p>
            <p>{application.availability}</p>
          </div>
          <div className="margin">
            <p className="pStyle">Previous Experience</p>
            {(application.prevExp ?? []).length > 0 ? (
              <ul>
                {(application.prevExp ?? []).map((exp, index) => (
                  <li key={index} className="listItem">
                    <p className="p2">
                      <strong>{exp.position}</strong> at {exp.company}
                    </p>
                    <span style={{ fontSize: "0.9rem", color: "##64ffda" }}>
                      {exp.description}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="p2">No experience</p>
            )}
          </div>
          <div className="margin">
            <p className="pStyle">Skills</p>
            <p>{application.skills.join(", ")}</p>
          </div>
          <div className="margin">
            <p className="pStyle">Academic Details</p>
            {application.academics.length > 0 ? (
              <ul>
                {application.academics.map((academics, index) => (
                  <li className="listItem" key={index}>
                    <strong>{academics.degree}</strong> from{" "}
                    <strong>{academics.university}</strong> ({academics.year})
                  </li>
                ))}
              </ul>
            ) : (
              <p className="p2">No academics added</p>
            )}
          </div>
          {/* Comments section */}
          <p className="pStyle">Comments</p>
          {application.comment && application.comment.length > 0 ? (
            <div className="margin">
              {application.comment.map((comment, index) => (
                <div key={index} className="commentBox">
                  <p>
                    {comment.username} <span>({comment.timestamp})</span>
                  </p>
                  <p>{comment.text}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>No Comments</p>
          )}
          <br />
          <textarea
            style={{
              textAlign: "center",
            }}
            placeholder="Add a comment"
            rows={4}
            cols={50}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          {/* Error message for empty comment */}
          {noComment && (
            <p style={{ color: "red", fontWeight: "bold" }}>
              Comment cannot be empty!
            </p>
          )}
          <br />
          <button onClick={() => handleSubmitComment(application)}>
            Submit Comment
          </button>
          <br />
          {index < showInfoTut.length - 1 && <hr />}{" "}
        </div>
      ))}
    </div>
  );
}

export default InfoDetailsCard;
