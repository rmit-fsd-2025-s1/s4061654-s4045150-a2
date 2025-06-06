import Nav from "../components/NavBar";
import Header from "../components/header";
import Footer from "../components/Footer";
import { experience } from "../types/experience";
import { qualification } from "../types/qualification";
import { ApplicationInfo } from "../types/application";
import { course } from "../types/course";

import { useState, useEffect } from "react";
import { userApi } from "../services/api";
import { UserInformation } from "../types/loginCreds";

export default function Lecturer() {
  //useState of type applicationInfo to store all values in one state and then store in localStorage.
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
  // For success messages and error messages
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

  //Store filteredCourses according to filter option usage in lecturer page.
  const [courses, setCourses] = useState<course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<course[]>([]);

  useEffect(() => {
    userApi.getAllCourses().then((courseArray) => {
      const typedCourses = courseArray as course[];
      setCourses(courseArray as course[]);
      setFilteredCourses(courseArray as course[]);
    });

    const id = localStorage.getItem("loggedIn");
    if (id) {
      setApplicantProfile((prev) => ({
        ...prev,
        applicant: JSON.parse(id).userid,
      }));
    }

    // Filter out the courses already applied for
    // const alreadyApplied = allApplicants
    //   .filter((app: ApplicationInfo) => app.name === applicantName)
    //   .map((app: ApplicationInfo) => app.coursesApplied);

    // const filtered = courses.filter(
    //   (course) => !alreadyApplied.includes(course)
    // );
    // setFilteredCourses(filtered);
  }, []);

  /*This function handles ticking checkboxes to select from available courses.
    The function looks updates the state from its previous value of empty array.
    If the course already exists in the array, get rid of the course (checkbox functionality)*/
  const handleCourseApplied = (e: React.ChangeEvent<HTMLInputElement>) => {
    const courseName = e.target.value;
    const courseObj = courses.find((c) => c.courseName === courseName);
    if (!courseObj) return;

    setApplicantProfile((prev) => {
      const alreadySelected = prev.coursesApplied.includes(courseObj.courseID);
      return {
        ...prev,
        coursesApplied: alreadySelected
          ? prev.coursesApplied.filter((id) => id !== courseObj.courseID)
          : [...prev.coursesApplied, courseObj.courseID],
      };
    });
  };

  /*This function handles the radio buttons to choose availability.
    It changes the state of it from previous value to new target.value*/
  const handleAvailability = (e: React.ChangeEvent<HTMLInputElement>) => {
    setApplicantProfile((prev) => ({
      ...prev,
      availability: e.target.value,
    }));
  };

  /*Handles choosing experience and storing the object in applicantInfo object*/
  const handleExperience = () => {
    if (experience.position && experience.company && experience.description) {
      setApplicantProfile((prev) => ({
        ...prev,
        experience: [...(prev.experience || []), experience],
      }));

      setAffirmation((prev) => ({
        ...prev,
        experienceAffirm: "Added to application profile!",
      }));
      setTimeout(
        () => setAffirmation((prev) => ({ ...prev, experienceAffirm: "" })),
        3000
      );
    } else {
      setError((prev) => ({
        ...prev,
        experienceError: "Please fill out every detail before submitting.",
      }));
      setTimeout(
        () => setError((prev) => ({ ...prev, experienceError: "" })),
        3000
      );
    }
  };
  /*Handles choosing academics and storing the object in applicantInfo object*/
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
        () => setAffirmation((prev) => ({ ...prev, academicsAffirm: "" })),
        3000
      );
    } else {
      setError((prev) => ({
        ...prev,
        academicsError: "Please fill out every detail before submitting.",
      }));
      setTimeout(
        () => setError((prev) => ({ ...prev, academicsError: "" })),
        3000
      );
    }
  };

  /*
    Changes state from previous default value in real time, and if the skill exists, gets rid of it and vice versa*/
  const handleSkills = () => {
    if (skill && !applicantProfile.skills.includes(skill)) {
      setApplicantProfile((prev) => ({
        ...prev,
        skills: [...prev.skills, skill],
      }));
      setSkill("");
    }
  };

  const handlePositionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setApplicantProfile((prev) => ({
      ...prev,
      position: e.target.value,
    }));
  };

  /*Finally after storing all the application information, the submission button can be clicked to store the applicantInfo object in localStorage.*/
  const handleSubmit = async () => {
    try {
      alert(
        "Submitting application: " + JSON.stringify(applicantProfile, null, 2)
      );
      applicantProfile.applicant = JSON.parse(
        localStorage.getItem("loggedIn") || "{}"
      ).userid;
      await userApi.saveApplication(applicantProfile);
    } catch (error) {
      console.error("Error saving application:", error);
    }

    window.location.reload();
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
            htmlFor="position"
            style={{ color: "#003366" }}
          >
            Lab Assistant
          </label>
          <h2>Available courses this semester</h2>

          {/*Details HTML tag used  handily to make a collapseable list of courses and skills that can be checked*/}

          <details className="coursesAvail">
            <summary>Available courses this semester</summary>

            <div className="courseAvailContent">
              <form>
                {/*Pre-populated courses array has been mapped into a list with checkbox input for selection*/}
                <ol>
                  {filteredCourses.map((course) => (
                    <li key={course.courseID}>
                      <input
                        id={`course-${course.courseID}`}
                        type="radio"
                        name="course"
                        value={course.courseID}
                        checked={
                          applicantProfile.coursesApplied[0] === course.courseID
                        }
                        onChange={(e) => {
                          setApplicantProfile((prev) => ({
                            ...prev,
                            coursesApplied: [Number(e.target.value)],
                          }));
                        }}
                      />
                      <label htmlFor={`course-${course.courseID}`}>
                        {course.courseName}
                      </label>
                    </li>
                  ))}
                </ol>
              </form>
            </div>
          </details>

          <br />
          {/*Rest of the inputs are being handled by the functions above*/}
          {/*Availability portion of the form*/}
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
          {/*Previous experience portion of the form*/}
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
          {/*This button will add the experience to the applicant profile*/}
          {/*If the experience is added, it will show a success message. Error message otherwise.*/}

          {affirmation.experienceAffirm && (
            <p className="fieldsPopulated">{affirmation.experienceAffirm}</p>
          )}
          {error.experienceError && (
            <p className="fieldsNotPopulated">{error.experienceError}</p>
          )}
          {/*Skills portion of the form*/}
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
          {/*Qualifications portion of the form*/}
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
            type="text"
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
              ? "Tutor Application profile"
              : applicantProfile.position === "Lab Assistant"
                ? "Lab Assistant Application profile"
                : "Application profile"}
          </h1>

          <h2>Course Selected</h2>
          {/*This is to change the state in real time for making the applicant profile on the side.
        If length > 0, it will map it onto a li element*/}

          {applicantProfile.coursesApplied.length > 0 ? (
            <ul>
              {applicantProfile.coursesApplied.map((id) => {
                const course = courses.find((c) => c.courseID === id);
                return (
                  <li key={id} className="courseName-green">
                    {course ? course.courseName : id}
                  </li>
                );
              })}
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
              //Call handleSubmit function, then reload the page.
              handleSubmit();
              window.location.reload();
            }}
          />
        </div>
      </div>
      <Footer />
    </div>
  );
}
