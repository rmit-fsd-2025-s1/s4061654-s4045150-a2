import { useState, useEffect } from "react";
import { useAuth } from "../context/authContext";
import { ApplicationInfo } from "../types/application";
import { userApi } from "@/services/api";
import { Comment } from "@/types/comment";

type InfoProps = {
  showInfoTut?: ApplicationInfo[];
};

function InfoDetailsCard({ showInfoTut }: InfoProps) {
  const [comment, setComment] = useState<string>("");
  const [noComment, setNoComment] = useState(false);
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    const fetchComments = async () => {
      if (showInfoTut && showInfoTut.length > 0) {
        try {
          const res = await userApi.getCommentsByApplication(
            showInfoTut[0].applicationID
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
      const newComment = await userApi.addComment(
        application.applicationID,
        user.id,
        comment
      );


      setComments((prev) => [newComment, ...prev]);
      setComment("");
    } catch (err) {
      console.error("Error submitting comment:", err);
    }
  };

  const [courses, setCourses] = useState<{ id: number; courseName: string }[]>([]);

  useEffect(() => {
    const fetchCourses = async () => {
      const data = await userApi.getAllCourses(); 
      setCourses(data);
    };
    fetchCourses();
  }, []);


  if (!showInfoTut || showInfoTut.length === 0) {
    return (
      <div className="infoCard" style={{ fontWeight: "bold", color: "#36454F" }}>
        Click 'Show info' to view more details.
      </div>
    );
  }

  const application = showInfoTut[0];

  return (
    <div className="infoCard2">
      <h2 style={{ fontSize: "2.1rem" }}>
        {application.applicant.firstName} {application.applicant.lastName}
      </h2>


      <p className="pStyle">Course(s) Applied</p>
      <p>
        {application.coursesApplied
          .map((id) => courses.find((c) => c.id === id)?.courseName || `Course ${id}`)
          .join(", ")}
      </p>


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
        {application.academics.length > 0 ? (
          <ul>
            {application.academics.map((acad, index) => (
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
                {c.lecturer?.firstName ?? "Lecturer"} {c.lecturer?.lastName ?? ""}{" "}
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
