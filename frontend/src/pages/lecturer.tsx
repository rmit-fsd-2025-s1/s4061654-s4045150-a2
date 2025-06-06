import Nav from "../components/NavBar";
import Footer from "../components/Footer";

import { useState, useEffect } from "react";
import { userApi } from "../services/api";
import ApplicationListCard from "@/components/ApplicationList";
import InfoDetailsCard from "../components/InfoDetailsCard";
import { useAuth } from "../context/authContext";
import { ApplicationInfo } from "../types/application";
import { course } from "../types/course";
import { User } from "../types/user";

export default function Lecturer() {
  const [tutorsList, setTutorsList] = useState<ApplicationInfo[]>([]);
  const [searchName, setSearchName] = useState("");
  const [searchSkills, setSearchSkills] = useState("");
  const [courseFilter, setCourseFilter] = useState<string[]>([]);
  const [availFilter, setAvailFilter] = useState<string[]>([]);
  const [positionFilter, setPositionFilter] = useState<string[]>([]);
  const [showInfoTutor, setShowInfoTutor] = useState<
    ApplicationInfo[] | undefined
  >(undefined);
  const { user } = useAuth();

  // All courses from backend as { courseID, courseName }
  const [courses, setCourses] = useState<course[]>([]);
  // Which courseIDs this lecturer is assigned to
  const [lecturerCourseIDs, setLecturerCourseIDs] = useState<number[]>([]);
  // Once courses, applications, and lecturerCourseIDs are loaded, we can stop loading
  const [isLoading, setIsLoading] = useState(true);

  // ─────────────────────────────────────────────────────────────────────────────
  // 1. Fetch course list on mount
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        // getAllCourses() returns something like [{ id, courseName }, …]
        const data = await userApi.getAllCourses();
        const formatted: course[] = data
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
        setCourses(formatted);
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      }
    };
    fetchCourses();
  }, []);

  // ─────────────────────────────────────────────────────────────────────────────
  // 2. Fetch all applications on mount, then convert each to a full ApplicationInfo
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        // a) Fetch the minimal application rows
        const rawApps = await userApi.getAllApplications();
        // rawApps is an array of { applicationID, applicant: number, position, availability, skills }

        // b) Turn each raw row into a full ApplicationInfo
        const fullApps: ApplicationInfo[] = await Promise.all(
          rawApps.map(async (r) => {
            const courseRows = await userApi.getApplicationCoursesByAppID(
              r.applicationID
            );
            const courseIds: number[] = courseRows.map(
              (cr) => cr.course.courseID
            );
            const coursesAppliedObj: course[] = courseRows.map(
              (cr) => cr.course
            );

            // Fetch the full applicant object usin// Fetch the full applicant ob

            return {
              applicationID: r.applicationID,
              position: r.position,
              availability: r.availability,
              skills: r.skills,
              applicant: r.applicant, 
              coursesApplied: courseIds,
              coursesAppliedObj: coursesAppliedObj,
              experience: (r as any).experiences ?? [],
              academics: (r as any).academics ?? [],
            };
          })
        );

        setTutorsList(fullApps);
      } catch (err) {
        console.error("Failed to fetch tutor applications:", err);
      }
    };

    fetchApplications();
  }, []);

  // ─────────────────────────────────────────────────────────────────────────────
  // 3. Fetch which courses the current lecturer is assigned to
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

  // ─────────────────────────────────────────────────────────────────────────────
  // 4. Once courses, tutorsList, and lecturerCourseIDs are populated, we can stop loading
  useEffect(() => {
    if (
      courses.length > 0 &&
      tutorsList.length >= 0 &&
      lecturerCourseIDs.length >= 0
    ) {
      // All three arrays have at least been attempted to load
      setIsLoading(false);
    }
  }, [courses, tutorsList, lecturerCourseIDs]);

  /**
   * Given an application’s `coursesApplied: number[]`, look up the matching
   * `course` object from our `courses` state.
   */
  const normalizeCoursesApplied = (app: ApplicationInfo): course[] => {
    // Either coursesApplied is number[] or course[]
    const ids = (app.coursesApplied as Array<number | course>).map((item) =>
      typeof item === "number" ? item : item.courseID
    );

    return ids
      .map((cid) => courses.find((c) => c.courseID === cid))
      .filter((c): c is course => !!c);
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // When “Show info” is clicked on a card, we pass the ApplicationInfo into state
  const handleShowInfo = (name: string, course: course) => {
    const matched = tutorsList.filter((t) => {
      const fullName = `${t.applicant.firstName} ${t.applicant.lastName}`;
      if (fullName !== name) return false;
      return t.coursesApplied.some(
        (c: number | course) =>
          (typeof c === "number" ? c : c.courseID) === course.courseID
      );
    });
    setShowInfoTutor(matched.length > 0 ? matched : undefined);
  };

 // ─────────────────────────────────────────────────────────────────────────────
  // Filter tutorsList according to:
  //  1) At least one course is taught by this lecturer (if lecturerCourseIDs is not empty)
  //  2) Name matches searchName
  //  3) At least one skill matches searchSkills
  //  4) Course‐checkbox filter (by courseName)
  //  5) Availability filter
  //  6) Position filter
  const filteredTutors = tutorsList.filter((applicant) => {
    // 1) If lecturerCourseIDs is set, must have at least one course that this lecturer teaches
    if (lecturerCourseIDs.length > 0) {
      const appliedCourses = normalizeCoursesApplied(applicant);
      const hasMatchingCourse = appliedCourses.some((c) =>
        lecturerCourseIDs.includes(c.courseID)
      );
      if (!hasMatchingCourse) return false;
    }

    // 2) Name filter (case-insensitive, partial match)
    const fullName = `${applicant.applicant.firstName} ${applicant.applicant.lastName}`.toLowerCase();
    if (searchName.trim() && !fullName.includes(searchName.toLowerCase().trim()))
      return false;

    // 3) Skills filter (case-insensitive, partial match, any skill)
    if (
      searchSkills.trim() &&
      !applicant.skills.some((skill) =>
        skill.toLowerCase().includes(searchSkills.toLowerCase().trim())
      )
    ) {
      return false;
    }

    // 4) Course‐checkbox filter (by courseName)
    if (courseFilter.length > 0) {
      const appliedCourseNames = normalizeCoursesApplied(applicant).map(
        (c) => c.courseName
      );
      if (!courseFilter.some((filterName) => appliedCourseNames.includes(filterName))) {
        return false;
      }
    }

    // 5) Availability filter (case-insensitive, matches any selected)
    if (availFilter.length > 0) {
      const availability = (applicant.availability || "").toLowerCase();
      if (!availFilter.some((a) => availability.includes(a))) {
        return false;
      }
    }

    // 6) Position filter (case-insensitive, matches any selected)
    if (positionFilter.length > 0) {
      const position = (applicant.position || "").toLowerCase();
      if (!positionFilter.some((p) => position === p.toLowerCase())) {
        return false;
      }
    }

    return true;
  });

  const [selected, setSelected] = useState<{ [key: string]: boolean }>({});
  const [ranked, setRanked] = useState<{ [key: string]: boolean }>({});

  // Sorting state
  const [sortBy, setSortBy] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Helper to sort application-course pairs
  const getSortedAppCoursePairs = () => {
    // Flatten filteredTutors to [{ app, courseObj }]
    const pairs = filteredTutors.flatMap((app) => {
      const appliedCourses = normalizeCoursesApplied(app);
      return appliedCourses.map((courseObj) => ({ app, courseObj }));
    });
    if (sortBy === "courseName") {
      pairs.sort((a, b) => {
        const cmp = a.courseObj.courseName.localeCompare(b.courseObj.courseName);
        return sortOrder === "asc" ? cmp : -cmp;
      });
    } else if (sortBy === "availability") {
      pairs.sort((a, b) => {
        const availA = (a.app.availability || "").toLowerCase();
        const availB = (b.app.availability || "").toLowerCase();
        const cmp = availA.localeCompare(availB);
        return sortOrder === "asc" ? cmp : -cmp;
      });
    }
    return pairs;
  };

  // Flattened structure for displaying in the dashboard
  const flattenedApps = tutorsList.flatMap((app) => {
    // Normalize to array of course objects
    const appliedCourses = normalizeCoursesApplied(app);
    return appliedCourses.map((courseObj) => ({
      app,
      courseObj,
    }));
  });

  if (isLoading) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <p>Loading applications...</p>
      </div>
    );
  }

  return (
    <div>
      <Nav />

      <div className="pageHeader" style={{ padding: "1rem 2rem" }}>
        <h1>Dashboard</h1>
        <p>
          Logged in as <strong>{user?.name}</strong>
        </p>
      </div>

      {/* Filter Bar */}
      <div
        className="filterBar"
        style={{ padding: "0 2rem", marginBottom: "1rem" }}
      >
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
                {courses.map((c, idx) => (
                  <li key={idx}>
                    <input
                      type="checkbox"
                      name={c.courseName}
                      value={c.courseName}
                      onChange={(e) => {
                        const value = e.target.value;
                        setCourseFilter((prev) =>
                          e.target.checked
                            ? [...prev, value]
                            : prev.filter((item) => item !== value)
                        );
                      }}
                    />
                    <label htmlFor={c.courseName}>{c.courseName}</label>
                  </li>
                ))}
              </ol>
            </form>
          </div>
        </details>

        <label className="availabilityLabel" style={{ marginLeft: "1rem" }}>
          <input
            type="checkbox"
            value="full-time"
            onChange={(e) => {
              const val = e.target.value;
              setAvailFilter((prev) =>
                e.target.checked
                  ? [...prev, val]
                  : prev.filter((v) => v !== val)
              );
            }}
          />
          Full-Time
        </label>

        <label className="availabilityLabel" style={{ marginLeft: "1rem" }}>
          <input
            type="checkbox"
            value="part-time"
            onChange={(e) => {
              const val = e.target.value;
              setAvailFilter((prev) =>
                e.target.checked
                  ? [...prev, val]
                  : prev.filter((v) => v !== val)
              );
            }}
          />
          Part-Time
        </label>

        <label className="availabilityLabel" style={{ marginLeft: "1rem" }}>
          <input
            type="checkbox"
            value="Tutor"
            onChange={(e) => {
              const val = e.target.value;
              setPositionFilter((prev) =>
                e.target.checked
                  ? [...prev, val]
                  : prev.filter((v) => v !== val)
              );
            }}
          />
          Tutor
        </label>
        <label className="availabilityLabel" style={{ marginLeft: "1rem" }}>
          <input
            type="checkbox"
            value="Lab Assistant"
            onChange={(e) => {
              const val = e.target.value;
              setPositionFilter((prev) =>
                e.target.checked
                  ? [...prev, val]
                  : prev.filter((v) => v !== val)
              );
            }}
          />
          Lab Assistant
        </label>
      </div>

      {/* Content Section */}
      <div className="dashboardContainer" style={{ padding: "0 2rem" }}>
        <div className="pageContentCenter">
          {/* Sort Buttons */}
          <div style={{ marginBottom: "1rem", display: "flex", gap: "1rem", justifyContent: "center", alignItems: "center" }}>
            <button
              type="button"
              onClick={() => {
                if (sortBy === "courseName") {
                  setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                } else {
                  setSortBy("courseName");
                  setSortOrder("asc");
                }
              }}
            >
              Sort by Course Name {sortBy === "courseName" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
            </button>
            <button
              type="button"
              onClick={() => {
                if (sortBy === "availability") {
                  setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                } else {
                  setSortBy("availability");
                  setSortOrder("asc");
                }
              }}
            >
              Sort by Availability {sortBy === "availability" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
            </button>
          </div>
          {getSortedAppCoursePairs().length === 0 ? (
            <p></p>
          ) : (
            getSortedAppCoursePairs().map(({ app, courseObj }) => {
              const fullName = `${app.applicant.firstName} ${app.applicant.lastName}`;
              return (
                <ApplicationListCard
                  key={`${app.applicationID}-${courseObj.courseID}`}
                  name={fullName}
                  course={courseObj}
                  applicantId={app.applicant.userid}
                  position={app.position}
                  isSelected={false}
                  isRanked={false}
                  onToggleSelect={() => {}}
                  onToggleRank={() => {}}
                  handleShowInfo={handleShowInfo}
                />
              );
            })
          )}
        </div>

        <div className="pageContentRight">
          <InfoDetailsCard showInfoTut={showInfoTutor} />
        </div>
      </div>

      <Footer />
    </div>
  );
}