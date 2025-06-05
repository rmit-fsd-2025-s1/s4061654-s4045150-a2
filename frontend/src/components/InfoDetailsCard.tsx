import { useState, useEffect } from "react";
import { useAuth } from "../context/authContext";
import { ApplicationInfo } from "../types/application";
import { userApi } from "@/services/api";
import { Comment } from "@/types/comment";
import { course } from "@/types/course";

type InfoProps = {
  showInfoTut?: ApplicationInfo[];
};

function InfoDetailsCard({ showInfoTut }: InfoProps) {
  const [comment, setComment] = useState<string>("");
  const [noComment, setNoComment] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [allCourses, setAllCourses] = useState<course[]>([]);
  const { user } = useAuth();

  // Fetch all courses once on mount
  useEffect(() => {
    userApi.getAllCourses().then((data) => {
      // getAllCourses returns { id, courseID?: number, courseName }
      const formatted = data
        .map((c: { id?: number; courseID?: number; courseName: string }) => {
          const courseID = c.courseID ?? c.id;
          if (typeof courseID === "number") {
            return {
              courseID,
              courseName: c.courseName,
            };
          }
          return null;
        })
        .filter((c): c is course => c !== null);
      setAllCourses(formatted);
    });
  }, []);

  // Fetch all comments for the application (no course filtering)
  useEffect(() => {
    const fetchComments = async () => {
      if (showInfoTut && showInfoTut.length > 0) {
        const application = showInfoTut[0];
        try {
          const res = await userApi.getCommentsByApplication(
            application.applicationID
          );
          setComments(res);
        } catch (err) {
          console.error("Failed to fetch comments:", err);
        }
      }
    };

    fetchComments();
  }, [showInfoTut]);

  const handleSubmitComment = async (application: ApplicationInfo) => {
    if (!comment.trim()) {
      setNoComment(true);
      setTimeout(() => setNoComment(false), 1000);
      return;
    }

    if (!user) {
      alert("You must be signed in to add a comment.");
      return;
    }

    try {
      await userApi.addComment(
        application.applicationID,
        user.id,
        comment
      );
      // Fetch all comments again to get full lecturer info
      const res = await userApi.getCommentsByApplication(application.applicationID);
      setComments(res);
      setComment("");
    } catch (err) {
      console.error("Error submitting comment:", err);
    }
  };

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

  const application = showInfoTut[0];

  // Map course IDs to course objects using allCourses
  const coursesApplied: course[] = (application.coursesApplied ?? []).map(
    (c: any) => {
      if (typeof c === "object" && c.courseID && c.courseName) return c;
      // If c is an ID, find the course object
      return (
        allCourses.find((course) => course.courseID === c) || {
          courseID: c,
          courseName: "Unknown Course",
        }
      );
    }
  );

  return (
    <div className="infoCard2">
      <h2 style={{ fontSize: "2.1rem" }}>
        {application.applicant.firstName} {application.applicant.lastName}
      </h2>

      <p className="pStyle">Position Applied For</p>
      <p>{application.position}</p>

      <p className="pStyle">Course(s) Applied</p>
      <ul>
        {coursesApplied.map((course) => (
          <li key={course.courseID}>
            <strong>{course.courseName}</strong>
          </li>
        ))}
      </ul>

      <div className="margin">
        <p className="pStyle">Availability</p>
        <p>{application.availability}</p>
      </div>

      <div className="margin">
        <p className="pStyle">Previous Experience</p>
        {(application.experience ?? []).length > 0 ? (
          <ul>
            {(application.experience ?? []).map((exp, index) => (
              <li key={index} className="listItem">
                <p className="p2">
                  <strong>{exp.position}</strong> at {exp.company}
                </p>
                <span style={{ fontSize: "0.9rem" }}>{exp.description}</span>
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
        {(application.academics ?? []).length > 0 ? (
          <ul>
            {(application.academics ?? []).map((acad, index) => (
              <li className="listItem" key={index}>
                <strong>{acad.degree}</strong> from{" "}
                <strong>{acad.university}</strong> ({acad.year})
              </li>
            ))}
          </ul>
        ) : (
          <p className="p2">No academics added</p>
        )}
      </div>

      {/* Comments section */}
      <p className="pStyle">Comments</p>
      {comments.length > 0 ? (
        <div className="margin">
          {comments.map((c, index) => (
            <div key={index} className="commentBox">
              <p>
                {c.lecturer?.firstName ?? "Lecturer"}{" "}
                {c.lecturer?.lastName ?? ""}{" "}
                <span>({new Date(c.createdAt).toLocaleString()})</span>
              </p>
              <p>{c.content}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No Comments</p>
      )}
      <br />
      <textarea
        placeholder="Add a comment"
        rows={4}
        cols={50}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        style={{ textAlign: "center" }}
      />
      {noComment && (
        <p style={{ color: "red", fontWeight: "bold" }}>
          Comment cannot be empty!
        </p>
      )}
      <br />
      <button onClick={() => handleSubmitComment(application)}>
        Submit Comment
      </button>
    </div>
  );
}

export default InfoDetailsCard;
