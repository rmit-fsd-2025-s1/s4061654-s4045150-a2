import Nav from "../components/NavBar";
import Footer from "../components/Footer";

import { useState, useEffect } from "react";
import { userApi } from "../services/api";
import ApplicationListCard from "@/components/ApplicationList";
import InfoDetailsCard from "../components/InfoDetailsCard";
import { useAuth } from "../context/authContext";
import { ApplicationInfo } from "../types/application";

export default function Lecturer() {
  // All state hooks stay inside the component
  const [tutorsList, setTutorsList] = useState<ApplicationInfo[]>([]);
  const [searchName, setSearchName] = useState("");
  const [searchSkills, setSearchSkills] = useState("");
  const [courseFilter, setCourseFilter] = useState<string[]>([]);
  const [availFilter, setAvailFilter] = useState<string[]>([]);
  const [showInfoTutor, setShowInfoTutor] = useState<ApplicationInfo[] | undefined>(undefined);
  const { user } = useAuth();

  // courses come from backend as { courseID, courseName }
  const [courses, setCourses] = useState<{ courseID: number; courseName: string }[]>([]);

  // Fetch course list on mount
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await userApi.getAllCourses(); // should return something like [{ id, courseName }, …]
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

  // Fetch all applications on mount, then filter out any missing applicant
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const data = await userApi.getAllApplications();
        // Remove any application that doesn’t have an applicant object
        const validApps = data.filter((app) => app.applicant != null);
        setTutorsList(validApps);
      } catch (err) {
        console.error("Failed to fetch tutor applications:", err);
      }
    };
    fetchApplications();
  }, []);

  // When “Show info” is clicked, match by fullName + courseID
  const handleShowInfo = (name: string, course: string) => {
    const courseId = Number(course);
    const matched = tutorsList.filter(
      (t) =>
        t.applicant != null &&
        `${t.applicant.firstName} ${t.applicant.lastName}` === name &&
        t.coursesApplied.includes(courseId)
    );
    setShowInfoTutor(matched.length > 0 ? matched : undefined);
  };

  const [lecturerCourseIDs, setLecturerCourseIDs] = useState<number[]>([]);

  useEffect(() => {
    const fetchLecturerCourses = async () => {
      if (!user) return;

      try {
        const data = await userApi.getCoursesByLecturer(user.id); // returns [{ courseID, courseName }]
        const ids = data.map((c) => c.courseID);
        setLecturerCourseIDs(ids);
      } catch (err) {
        console.error("Failed to fetch lecturer courses", err);
      }
    };

    fetchLecturerCourses();
  }, [user]);


  // Build filteredTutors array, guarding applicant access
  const filteredTutors = tutorsList
  .filter((applicant) => {
    // Make sure there's an applicant object
    if (!applicant.applicant) return false;

    // Step 1: Check if at least one of the applicant's courses is assigned to this lecturer
    const hasMatchingCourse = applicant.coursesApplied.some((cid) =>
      lecturerCourseIDs.includes(cid)
    );
    if (!hasMatchingCourse) return false;

    // Step 2: Apply name filter
    const fullName = `${applicant.applicant.firstName} ${applicant.applicant.lastName}`.toLowerCase();
    const filterSearch = fullName.includes(searchName.toLowerCase());

    // Step 3: Apply skill filter
    const filterSearchSkills = applicant.skills.some((skill) =>
      skill.toLowerCase().includes(searchSkills.toLowerCase())
    );

    // Step 4: Apply course name filter (from checkboxes)
    const appliedCourseNames = applicant.coursesApplied
      .map((id) => courses.find((c) => c.courseID === id)?.courseName)
      .filter((name): name is string => !!name);

    const filterCourse =
      courseFilter.length === 0 ||
      courseFilter.some((c) => appliedCourseNames.includes(c));

    // Step 5: Apply availability filter
    const availability = applicant.availability || "";
    const filterAvailability =
      availFilter.length === 0 ||
      availFilter.includes(availability.toLowerCase());

    return filterSearch && filterSearchSkills && filterCourse && filterAvailability;
  });


  /*
  // Sorting logic (commented out per request)
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
      return sortState.order === "asc"
        ? aCourse.localeCompare(bCourse)
        : bCourse.localeCompare(aCourse);
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
                        const value = e.target.value;
                        setCourseFilter((prev) =>
                          e.target.checked
                            ? [...prev, value]
                            : prev.filter((c) => c !== value)
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
          {filteredTutors.map((app) => {
            if (!app.applicant) return null;

            const fullName = `${app.applicant.firstName} ${app.applicant.lastName}`;

            return app.coursesApplied
              .filter((courseID) => lecturerCourseIDs.includes(courseID)) // ✅ Only render courses assigned to this lecturer
              .map((courseID, idx) => (
                <ApplicationListCard
                  key={`${app.applicationID}-${courseID}-${idx}`}
                  name={fullName}
                  course={courseID.toString()}
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
