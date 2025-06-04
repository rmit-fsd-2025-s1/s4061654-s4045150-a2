import Nav from "../components/NavBar";
import Footer from "../components/Footer";

import { useState, useEffect } from "react";
import { userApi } from "../services/api";
import ApplicationListCard from "@/components/ApplicationList";
import InfoDetailsCard from "../components/InfoDetailsCard";
import { useAuth } from "../context/authContext";
import { ApplicationInfo } from "../types/application";

export default function Lecturer() {
  const [tutorsList, setTutorsList] = useState<ApplicationInfo[]>([]);
  const [searchName, setSearchName] = useState("");
  const [searchSkills, setSearchSkills] = useState("");
  const [courseFilter, setCourseFilter] = useState<string[]>([]);
  const [availFilter, setAvailFilter] = useState<string[]>([]);
  const [showInfoTutor, setShowInfoTutor] = useState<ApplicationInfo[]>();
  const { user } = useAuth();

  const [courses, setCourses] = useState<{ courseID: number; courseName: string }[]>([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await userApi.getAllCourses(); // returns { id, courseName }
        const formatted = data.map((c: { id: number; courseName: string }) => ({
          courseID: c.id,
          courseName: c.courseName,
        }));
        setCourses(formatted);
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      }
    };
    fetchCourses();
  }, []);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const data = await userApi.getAllApplications();
        setTutorsList(data);
      } catch (err) {
        console.error("Failed to fetch tutor applications:", err);
      }
    };
    fetchApplications();
  }, []);

  const handleShowInfo = (name: string, course: string) => {
    const courseId = Number(course);
    const matched = tutorsList.filter(
      (t) =>
        t.applicant.firstName + " " + t.applicant.lastName === name &&
        t.coursesApplied.includes(courseId)
    );
    setShowInfoTutor(matched.length > 0 ? matched : undefined);
  };

  const filteredTutors = tutorsList.filter((applicant) => {
    const fullName = `${applicant.applicant.firstName} ${applicant.applicant.lastName}`.toLowerCase();
    const filterSearch = fullName.includes(searchName.toLowerCase());

    const filterSearchSkills = applicant.skills.some((skill) =>
      skill.toLowerCase().includes(searchSkills.toLowerCase())
    );

    const appliedCourseNames = applicant.coursesApplied
      .map((id) => courses.find((c) => c.courseID === id)?.courseName)
      .filter((name): name is string => !!name);

    const filterCourse =
      courseFilter.length === 0 ||
      courseFilter.some((c) => appliedCourseNames.includes(c));

    const availability = applicant.availability || "";
    const filterAvailability =
      availFilter.length === 0 ||
      availFilter.includes(availability.toLowerCase());

    return filterSearch && filterSearchSkills && filterCourse && filterAvailability;
  });

  /*
  // Sorting logic is commented out for now
  if (sortState.type === "availability") {
    filteredTutors.sort((a, b) => {
      const aAvail = a.availability?.toLowerCase() || "";
      const bAvail = b.availability?.toLowerCase() || "";
      return sortState.order === "asc"
        ? aAvail.localeCompare(bAvail)
        : bAvail.localeCompare(aAvail);
    });
  } else if (sortState.type === "course") {
    const getFirstCourseName = (app: ApplicationInfo) =>
      courses.find((c) => c.courseID === app.coursesApplied[0])?.courseName?.toLowerCase() || "";
    filteredTutors.sort((a, b) => {
      const aCourse = getFirstCourseName(a);
      const bCourse = getFirstCourseName(b);
      return sortState.order === "asc" ? aCourse.localeCompare(bCourse) : bCourse.localeCompare(aCourse);
    });
  }
  */

  return (
    <div>
      <Nav />

      <div className="pageHeader">
        <h1>Dashboard</h1>
      </div>

      {/* Filter Bar */}
      <div className="filterBar">
        <div className="filterItem">
          <p>Search By Name</p>
          <input
            type="text"
            placeholder="Input Name..."
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />
        </div>

        <div className="filterItem">
          <p>Search By Skills</p>
          <input
            type="text"
            placeholder="Input Skills..."
            value={searchSkills}
            onChange={(e) => setSearchSkills(e.target.value)}
          />
        </div>

        <details className="dropdown">
          <summary style={{ color: "#003366" }}>Filter by course</summary>
          <div className="dropdownContent">
            <form>
              <ol>
                {courses.map((course, index) => (
                  <li key={index}>
                    <input
                      type="checkbox"
                      name={course.courseName}
                      value={course.courseName}
                      onChange={(e) => {
                        const course = e.target.value;
                        setCourseFilter((prev) =>
                          e.target.checked
                            ? [...prev, course]
                            : prev.filter((c) => c !== course)
                        );
                      }}
                    />
                    <label htmlFor={course.courseName}>{course.courseName}</label>
                  </li>
                ))}
              </ol>
            </form>
          </div>
        </details>

        <label className="availabilityLabel">
          <input
            type="checkbox"
            value="full-time"
            onChange={(e) => {
              const value = e.target.value;
              setAvailFilter((prev) =>
                e.target.checked
                  ? [...prev, value]
                  : prev.filter((v) => v !== value)
              );
            }}
          />
          Full-Time
        </label>

        <label className="availabilityLabel">
          <input
            type="checkbox"
            value="part-time"
            onChange={(e) => {
              const value = e.target.value;
              setAvailFilter((prev) =>
                e.target.checked
                  ? [...prev, value]
                  : prev.filter((v) => v !== value)
              );
            }}
          />
          Part-Time
        </label>
      </div>

      {/* Content Section */}
      <div className="dashboardContainer">
        <div className="pageContentCenter">
          {/* 
          // Sorting buttons are commented for now
          <div className="sortButtons">
            <button
              onClick={() =>
                setSortState((prev) => ({
                  type: "availability",
                  order:
                    prev.type === "availability" && prev.order === "asc"
                      ? "desc"
                      : "asc",
                }))
              }
              className="sortButton"
            >
              Sort by Availability
            </button>

            <button
              onClick={() =>
                setSortState((prev) => ({
                  type: "course",
                  order:
                    prev.type === "course" && prev.order === "asc"
                      ? "desc"
                      : "asc",
                }))
              }
              className="sortButton"
            >
              Sort by Course Name
            </button>
          </div>
          */}

          {filteredTutors.map((app) => {
            const fullName = `${app.applicant.firstName} ${app.applicant.lastName}`;
            return app.coursesApplied.map((course, idx) => (
              <ApplicationListCard
                key={`${app.applicationID}-${course}-${idx}`}
                name={fullName}
                course={course.toString()}
                applicantId={app.applicant.userid}
                isSelected={false}
                isRanked={false}
                onToggleSelect={() => {}}
                onToggleRank={() => {}}
                handleShowInfo={handleShowInfo}
              />
            ));
          })}
        </div>

        <div className="pageContentRight">
          <InfoDetailsCard showInfoTut={showInfoTutor} />
        </div>
      </div>

      {/* 
      // Commented out until backend ranking is implemented
      <div className="candidate-stats-container">
        <div className="candidate-box ranking">
          <h3>Ranking</h3>
          {rankedCandidates.length > 0 ? (
            <ol>
              {rankedCandidates.map((name, index) => (
                <li key={index}>{name}</li>
              ))}
            </ol>
          ) : (
            <p>No Tutors Ranked</p>
          )}
        </div>
      </div>
      */}

      <Footer />
    </div>
  );
}
