import Nav from "../components/NavBar";
import Header from "../components/header";
import Footer from "../components/Footer";
import { experience } from "../types/experience";
import { qualification } from "../types/qualification";
import { ApplicationInfo } from "../types/application";
import { course } from "../types/course";
import { UserInformation } from "../types/loginCreds";

import { useState, useEffect } from "react";
import { userApi } from "../services/api";

export default function Lecturer() {
  // State for building a single application submission
  const [applicantProfile, setApplicantProfile] = useState<ApplicationInfo>({
    applicationID: Math.floor(Math.random() * 1000000),
    position: "",
    applicant: {} as UserInformation,
    coursesApplied: [],
    availability: null,
    experience: [] as experience[],
    skills: [],
    academics: [],
  });

  const [experience, setExperience] = useState<experience>({
    position: "",
    company: "",
    description: "",
  });

  const [academics, setAcademics] = useState<qualification>({
    degree: "",
    year: 0,
    university: "",
  });

  const [skill, setSkill] = useState("");
  // For success and error messages
  const [affirmation, setAffirmation] = useState({
    experienceAffirm: "",
    academicsAffirm: "",
    applicationSubmitted: "",
  });

  const [error, setError] = useState({
    experienceError: "",
    academicsError: "",
    applicationCannotSubmit: "",
  });

  // All courses from backend
  const [courses, setCourses] = useState<course[]>([]);
  // If you ever want a filtered subset (e.g. search), you can keep this; for now it will mirror `courses`
  const [filteredCourses, setFilteredCourses] = useState<course[]>([]);

  // Fetch courses once on mount; populate both `courses` and `filteredCourses`
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const courseArray = await userApi.getAllCourses(); // returns [{ id, courseName }, …]
        const fixedCourses: course[] = courseArray.map((c) => ({
          courseID: c.id,
          courseName: c.courseName,
        }));
        setCourses(fixedCourses);
        setFilteredCourses(fixedCourses);
      } catch (err) {
        console.error("Failed to fetch courses:", err);
      }
    };

    fetchCourses();
  }, []);

  /* 
    Handles ticking checkboxes to select/unselect courses.
    Because `coursesApplied` is now `course[]`, we push/pull the full `course` object.
  */
  const handleCourseApplied = (e: React.ChangeEvent<HTMLInputElement>) => {
    const courseName = e.target.value;
    const courseObj = courses.find((c) => c.courseName === courseName);
    if (!courseObj) return;

    setApplicantProfile((prev) => {
      const alreadySelected = prev.coursesApplied.some(
        (c) => c.courseID === courseObj.courseID
      );
      return {
        ...prev,
        coursesApplied: alreadySelected
          ? prev.coursesApplied.filter((c) => c.courseID !== courseObj.courseID)
          : [...prev.coursesApplied, courseObj],
      };
    });
  };

  /* Handles availability radio buttons */
  const handleAvailability = (e: React.ChangeEvent<HTMLInputElement>) => {
    setApplicantProfile((prev) => ({
      ...prev,
      availability: e.target.value,
    }));
  };

  /* Adds an experience object into the application */
  const handleExperience = () => {
    if (
      experience.position &&
      experience.company &&
      experience.description
    ) {
      setApplicantProfile((prev) => ({
        ...prev,
        experience: [...(prev.experience || []), experience],
      }));
      setAffirmation((prev) => ({
        ...prev,
        experienceAffirm: "Added to application profile!",
      }));
      setTimeout(
        () =>
          setAffirmation((prev) => ({ ...prev, experienceAffirm: "" })),
        3000
      );
    } else {
      setError((prev) => ({
        ...prev,
        experienceError: "Please fill out every detail before submitting.",
      }));
      setTimeout(
        () =>
          setError((prev) => ({ ...prev, experienceError: "" })),
        3000
      );
    }
  };

  /* Adds an academics object into the application */
  const handleAcademics = () => {
    if (academics.degree && academics.university && academics.year) {
      setApplicantProfile((prev) => ({
        ...prev,
        academics: [...prev.academics, academics],
      }));
      setAffirmation((prev) => ({
        ...prev,
        academicsAffirm: "Added to application profile!",
      }));
      setTimeout(
        () =>
          setAffirmation((prev) => ({ ...prev, academicsAffirm: "" })),
        3000
      );
    } else {
      setError((prev) => ({
        ...prev,
        academicsError: "Please fill out every detail before submitting.",
      }));
      setTimeout(
        () =>
          setError((prev) => ({ ...prev, academicsError: "" })),
        3000
      );
    }
  };

  /*
    Adds a skill string to the `skills` array in the application.
  */
  const handleSkills = () => {
    if (skill && !applicantProfile.skills.includes(skill)) {
      setApplicantProfile((prev) => ({
        ...prev,
        skills: [...prev.skills, skill],
      }));
      setSkill("");
    }
  };

  /* Handles changing the position radio */
  const handlePositionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setApplicantProfile((prev) => ({
      ...prev,
      position: e.target.value,
    }));
  };

  /*
    Submits the application object to the backend
  */
  const handleSubmit = async () => {
    try {
      alert(
        "Submitting application: " +
          JSON.stringify(applicantProfile, null, 2)
      );
      // Assume `loggedIn` in localStorage is something like { id: 123, ... }
      applicantProfile.applicant = JSON.parse(
        localStorage.getItem("loggedIn") || "{}"
      ).id;
      await userApi.saveApplication(applicantProfile);
      setAffirmation((prev) => ({
        ...prev,
        applicationSubmitted: "Application submitted successfully!",
      }));
    } catch (error) {
      console.error("Error saving application:", error);
      setError((prev) => ({
        ...prev,
        applicationCannotSubmit: "Failed to submit application.",
      }));
      setTimeout(
        () =>
          setError((prev) => ({
            ...prev,
            applicationCannotSubmit: "",
          })),
        3000
      );
    }

    // If you truly want a reload, you can call window.location.reload(),
    // but consider just clearing the form instead of reloading the page.
  };

  return (
    <div>
      <Nav />
      <Header />
      <div className="tutorFormBox">
        <h1>Who is a tutor?</h1>
        <p className="p1">
          A tutor is more than just a teacher — they’re a guide, a mentor, and a
          supporter of dreams. They light the path for others by sharing
          knowledge, building confidence, and inspiring growth. Every time a
          student understands something they once found impossible, it’s because
          a tutor believed in them. Being a tutor means choosing to make a
          difference, one learner at a time.
        </p>
      </div>
      <div className="form-container">
        <div className="box">
          <h1>Apply To Become A Tutor / Lab Assistant</h1>
          <input
            className="Tutor"
            type="radio"
            name="position"
            value="Tutor"
            onChange={handlePositionChange}
          />
          <label className="tutor" htmlFor="Tutor" style={{ color: "#003366" }}>
            Tutor
          </label>
          <br />

          <input
            type="radio"
            name="position"
            value="Lab Assistant"
            onChange={handlePositionChange}
          />
          <label
            className="labAssistant"
            htmlFor="Lab Assistant"
            style={{ color: "#003366" }}
          >
            Lab Assistant
          </label>

          <h2>Available courses this semester</h2>
          <details className="coursesAvail">
            <summary>Available courses this semester</summary>
            <div className="courseAvailContent">
              <form>
                <ol>
                  {courses.map((course, index) => (
                    <li key={course.courseID}>
                      <input
                        id={course.courseName}
                        type="checkbox"
                        name="course"
                        value={course.courseName}
                        onChange={handleCourseApplied}
                      />
                      <label htmlFor={course.courseName}>
                        {course.courseName}
                      </label>
                    </li>
                  ))}
                </ol>
              </form>
            </div>
          </details>

          <br />
          <h2>Availability</h2>
          <input
            className="Full-time"
            type="radio"
            name="availability"
            value="Full-time"
            onChange={handleAvailability}
          />
          <label
            className="Full-time"
            htmlFor="Full-time"
            style={{ color: "#003366" }}
          >
            Full-time
          </label>
          <br />

          <input
            type="radio"
            name="availability"
            value="Part-time"
            onChange={handleAvailability}
          />
          <label
            className="Part-time"
            htmlFor="Part-time"
            style={{ color: "#003366" }}
          >
            Part-time
          </label>

          <h2>Previous Experience (If any)</h2>
          <input
            data-testid="position"
            className="inputBox"
            type="text"
            placeholder="Position"
            value={experience.position}
            onChange={(e) =>
              setExperience({ ...experience, position: e.target.value })
            }
          />

          <input
            data-testid="company"
            className="inputBox"
            type="text"
            placeholder="Company/Institution"
            value={experience.company}
            onChange={(e) =>
              setExperience({ ...experience, company: e.target.value })
            }
          />

          <input
            data-testid="description"
            className="inputBox"
            type="text"
            placeholder="Short Description"
            value={experience.description}
            onChange={(e) =>
              setExperience({ ...experience, description: e.target.value })
            }
          />

          <button
            data-testid="prevExpBtn"
            className="addButton"
            onClick={handleExperience}
          >
            Add to applicant profile
          </button>

          {affirmation.experienceAffirm && (
            <p className="fieldsPopulated">{affirmation.experienceAffirm}</p>
          )}
          {error.experienceError && (
            <p className="fieldsNotPopulated">{error.experienceError}</p>
          )}

          <h2>Your Skillsets</h2>
          <input
            className="inputBox"
            type="text"
            placeholder="Press enter to add skills"
            size={50}
            value={skill}
            onChange={(e) => setSkill(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSkills();
              }
            }}
          />

          <h2>Your Academic Qualifications</h2>
          <input
            data-testid="degree"
            className="inputBox"
            type="text"
            placeholder="Degree / Certification"
            value={academics.degree}
            onChange={(e) =>
              setAcademics({ ...academics, degree: e.target.value })
            }
          />
          <input
            data-testid="university"
            className="inputBox"
            type="text"
            placeholder="Institution"
            value={academics.university}
            onChange={(e) =>
              setAcademics({ ...academics, university: e.target.value })
            }
          />
          <input
            data-testid="year"
            className="inputBox"
            type="number"
            placeholder="Year"
            value={academics.year}
            onChange={(e) =>
              setAcademics({ ...academics, year: Number(e.target.value) })
            }
          />
          <button className="addButton" onClick={handleAcademics}>
            Add to applicant profile
          </button>
          {affirmation.academicsAffirm && (
            <p className="fieldsPopulated">{affirmation.academicsAffirm}</p>
          )}
          {error.academicsError && (
            <p className="fieldsNotPopulated">{error.academicsError}</p>
          )}
        </div>

        <div className="applicantBox">
          <h1>
            {applicantProfile.position === "Tutor"
              ? "Tutor Application Profile"
              : applicantProfile.position === "Lab Assistant"
              ? "Lab Assistant Application Profile"
              : "Application Profile"}
          </h1>

          <h2>Course Selected</h2>
          {applicantProfile.coursesApplied.length > 0 ? (
            <ul>
              {applicantProfile.coursesApplied.map((course) => (
                <li key={course.courseID} className="courseName-green">
                  {course.courseName}
                </li>
              ))}
            </ul>
          ) : (
            <p className="p2">No course selected</p>
          )}

          <h2>Availability</h2>
          <p className="p2">
            {applicantProfile.availability
              ? applicantProfile.availability
              : "Not specified"}
          </p>

          <h2>Previous Experience</h2>
          {(applicantProfile.experience || []).length > 0 ? (
            <ul>
              {(applicantProfile.experience || []).map((exp, index) => (
                <li key={index} className="listItem">
                  <p className="p2">
                    <strong>{exp.position}</strong> at {exp.company}
                  </p>
                  <span style={{ color: "#36454F", fontWeight: "bold" }}>
                    {exp.description}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="p2">No experience</p>
          )}

          <h2>Relevant Skillset</h2>
          {applicantProfile.skills.length > 0 ? (
            <ul>
              {applicantProfile.skills.map((skill, index) => (
                <li key={index} className="listItem">
                  <strong>{skill}</strong>
                </li>
              ))}
            </ul>
          ) : (
            <p className="p2">No relevant skills selected</p>
          )}

          <h2>Academic Qualifications</h2>
          {applicantProfile.academics.length > 0 ? (
            <ul>
              {applicantProfile.academics.map((academics, index) => (
                <li className="listItem" key={index}>
                  <strong>{academics.degree}</strong> from{" "}
                  <strong>{academics.university}</strong> ({academics.year})
                </li>
              ))}
            </ul>
          ) : (
            <p className="p2">No academics added</p>
          )}

          <br />
          <br />
          <input
            data-testid="applyButton"
            type="button"
            value="Apply"
            className="applyButton"
            disabled={
              applicantProfile.coursesApplied.length == 0 ||
              !applicantProfile.availability ||
              applicantProfile.skills.length == 0 ||
              applicantProfile.academics.length == 0
            }
            onClick={() => {
              handleSubmit();
              window.location.reload();
            }}
          />
          {affirmation.applicationSubmitted && (
            <p className="fieldsPopulated">{affirmation.applicationSubmitted}</p>
          )}
          {error.applicationCannotSubmit && (
            <p className="fieldsNotPopulated">{error.applicationCannotSubmit}</p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
