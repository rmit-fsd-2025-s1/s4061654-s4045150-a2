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
import { Ranking } from "../types/rankings";
import ApplicantBarChart from "../components/ApplicantBarChart";
import { useRouter } from 'next/router';

export default function Lecturer() {
  const router = useRouter();
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
  const [rankings, setRankings] = useState<Ranking[]>([]);

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
            const courseRows = await userApi.getApplicationCoursesByAppID(r.applicationID);
            const courseIds = courseRows.map((cr) => cr.course.courseID);
            const coursesAppliedObj = courseRows.map((cr) => cr.course);
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
    // Toggle: if already showing this info, hide it
    if (
      showInfoTutor &&
      matched.length === showInfoTutor.length &&
      matched.every((m, i) => m.applicationID === showInfoTutor[i].applicationID)
    ) {
      setShowInfoTutor(undefined);
    } else {
      setShowInfoTutor(matched.length > 0 ? matched : undefined);
    }
  };

  // Sorting state
  const [sortBy, setSortBy] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Fetch applications from backend with filters/sorting
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const filters: Record<string, any> = {
          name: searchName,
          skills: searchSkills,
          course: courseFilter,
          availability: availFilter,
          position: positionFilter,
          sortBy,
          sortOrder,
          lecturerCourseIDs, // <-- add this line
        };
        Object.keys(filters).forEach((key) => {
          if (
            (Array.isArray(filters[key]) && filters[key].length === 0) ||
            filters[key] === ""
          ) {
            delete filters[key];
          }
        });
        const rawApps = await userApi.getAllApplications(filters);
        // For each application, fetch its courses and academics if missing
        const fullApps: ApplicationInfo[] = await Promise.all(
          rawApps.map(async (r) => {
            const courseRows = await userApi.getApplicationCoursesByAppID(r.applicationID);
            const courseIds = courseRows.map((cr) => cr.course.courseID);
            const coursesAppliedObj = courseRows.map((cr) => cr.course);
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
  }, [searchName, searchSkills, courseFilter, availFilter, positionFilter, sortBy, sortOrder, lecturerCourseIDs]);

  // Replace filteredTutors and getSortedAppCoursePairs usage with tutorsList
  // For displaying, flatten tutorsList to [{ app, courseObj }]
  const getAppCoursePairs = () => {
    return tutorsList.flatMap((app) => {
      const appliedCourses = normalizeCoursesApplied(app);
      // Only include courses assigned to this lecturer
      return appliedCourses
        .filter((courseObj) => lecturerCourseIDs.includes(courseObj.courseID))
        .map((courseObj) => ({ app, courseObj }));
    });
  };

  const [pendingSkills, setPendingSkills] = useState("");
  const [pendingName, setPendingName] = useState("");

  const [selected, setSelected] = useState<{ [key: string]: boolean }>({});

  // Fetch selected applications for this lecturer
  useEffect(() => {
    if (!user || typeof user.id !== 'number' || isNaN(user.id)) return;
    userApi.getSelectionsByLecturer(user.id).then((selections) => {
      // selections: [{ applicationId }]
      const selectedMap: { [key: string]: boolean } = {};
      selections.forEach(sel => {
        selectedMap[`${sel.applicationId}`] = true;
      });
      setSelected(selectedMap);
    });
  }, [user]);

  // Handler to select or deselect an application
  const handleSelect = async (applicationId: number) => {
    if (!user) return;
    const key = `${applicationId}`;
    try {
      if (selected[key]) {
        // Deselect: call backend to remove selection
        await userApi.deselectApplicant(user.id, applicationId);
        setSelected(prev => {
          const newSelected = { ...prev };
          delete newSelected[key];
          return newSelected;
        });
        // Also remove from rankings if present
        const rankingObj = rankings.find(r => r.applicationId === applicationId);
        if (rankingObj) {
          await userApi.deleteRanking(user.id, rankingObj.rank);
          // Refresh rankings
          const data = (await userApi.getRankingsByLecturer(user.id)) as any[];
          setRankings(data.map((r: any) => ({
            rowId: r.rowId ?? 0,
            lecturerId: user.id,
            applicationId: r.applicationId,
            rank: r.rank
          })));
        }
      } else {
        // Select: call backend to add selection
        await userApi.selectApplicant(user.id, applicationId);
        setSelected(prev => ({
          ...prev,
          [key]: true,
        }));
      }
      // Refresh analytics after select/deselect
      fetchGlobalAnalytics();
    } catch (err) {
      alert("Failed to update selection.");
      console.error(err);
    }
  };

  // Fetch rankings for this lecturer
  useEffect(() => {
    if (!user) return;
    userApi.getRankingsByLecturer(user.id).then((data: unknown) => {
      const arr = Array.isArray(data) ? data : [];
      setRankings(arr.map((r: any) => ({
        rowId: r.rowId ?? 0,
        lecturerId: user.id,
        applicationId: r.applicationId,
        rank: r.rank
      })));
    });
  }, [user, selected]);

  // Handler to set a rank for a selected application
  const handleSetRank = async (applicationId: number, rank: 1 | 2 | 3) => {
    if (!user) return;
    await userApi.setRanking(user.id, applicationId, rank);
    // Refresh rankings
    const data = (await userApi.getRankingsByLecturer(user.id)) as any[];
    setRankings(data.map((r: any) => ({
      rowId: r.rowId ?? 0,
      lecturerId: user.id,
      applicationId: r.applicationId,
      rank: r.rank
    })));
  };

  // Handler to delete a rank
  const handleDeleteRank = async (rank: 1 | 2 | 3) => {
    if (!user) return;
    await userApi.deleteRanking(user.id, rank);
    // Refresh rankings
    const data = (await userApi.getRankingsByLecturer(user.id)) as any[];
    setRankings(data.map((r: any) => ({
      rowId: r.rowId ?? 0,
      lecturerId: user.id,
      applicationId: r.applicationId,
      rank: r.rank
    })));
  };

  // Fetch all selections globally for analytics
  const [allSelections, setAllSelections] = useState<any[]>([]);
  const fetchGlobalAnalytics = () => {
    userApi.getGlobalApplicantSelectionCounts().then((data) => {
      setAllSelections(data);
    });
  };
  useEffect(() => {
    fetchGlobalAnalytics();
  }, []);

  // Compute analytics for applicant selections (global)
  const applicantSelectionCounts: { [applicantId: number]: { name: string; count: number } } = {};
  if (Array.isArray(allSelections) && allSelections.length > 0 && allSelections[0].applicantId !== undefined) {
    allSelections.forEach((sel: any) => {
      applicantSelectionCounts[sel.applicantId] = { name: sel.name, count: Number(sel.count) };
    });
    // Ensure every applicant in tutorsList is present in applicantSelectionCounts
    tutorsList.forEach((app) => {
      const applicantId = app.applicant.userid;
      const name = `${app.applicant.firstName} ${app.applicant.lastName}`;
      if (!applicantSelectionCounts[applicantId]) {
        applicantSelectionCounts[applicantId] = { name, count: 0 };
      }
    });
  } else {
    tutorsList.forEach((app) => {
      const applicantId = app.applicant.userid;
      const name = `${app.applicant.firstName} ${app.applicant.lastName}`;
      if (!applicantSelectionCounts[applicantId]) {
        applicantSelectionCounts[applicantId] = { name, count: 0 };
      }
    });
  }
  // Prepare data for bar chart
  const barChartData = Object.values(applicantSelectionCounts);
  // Find most and least chosen applicants
  const maxCount = Math.max(...barChartData.map((d) => d.count), 0);
  const minCount = barChartData.length > 0 ? Math.min(...barChartData.filter((d) => d.count > 0).map((d) => d.count)) : 0;
  const mostChosen = barChartData.filter((d) => d.count === maxCount && maxCount > 0);
  // Least chosen: only those with at least 1 selection and the minimum count
  const leastChosen = barChartData.filter((d) => d.count === minCount && d.count > 0);
  // Unselected applicants (count === 0)
  const unselectedCandidates = barChartData.filter((d) => d.count === 0);

  useEffect(() => {
    // Redirect if not logged in or not a lecturer
    if (typeof window === 'undefined') return; // Only run on client
    const loggedIn = localStorage.getItem('loggedIn');
    if (!loggedIn) {
      router.replace('/');
      return;
    }
    let parsedUser;
    try {
      parsedUser = JSON.parse(loggedIn);
    } catch (e) {
      router.replace('/');
      return;
    }
    if (!parsedUser.role || parsedUser.role !== 'lecturer') {
      router.replace('/');
    }
  }, [router]);

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
      <div className="pageHeader">
        <h1 className="dashboard-title">Dashboard</h1>
        <div className="dashboard-desc dashboard-desc-wide">
          <ul>
            <li>📋 View and filter all tutor applications for your assigned courses</li>
            <li>🔍 Search by name or skills</li>
            <li>🗂️ Filter by course, availability, or position</li>
            <li>✅ Select and rank candidates</li>
            <li>📊 See analytics on candidate selections and your current rankings</li>
            <li>ℹ️ Click "Show Info" on any candidate to view detailed application information</li>
          </ul>
        </div>
      </div>
      {/* Filter Bar */}
      <div className="filterBar">
        <div className="filterRow">
          <div className="filterItem">
            <p>Search By Name</p>
            <input
              type="text"
              placeholder="Input Name..."
              value={pendingName}
              onChange={(e) => setPendingName(e.target.value)}
            />
          </div>
          <div className="filterItem">
            <p>Search By Skills</p>
            <input
              type="text"
              placeholder="Input Skills..."
              value={pendingSkills}
              onChange={(e) => setPendingSkills(e.target.value)}
            />
          </div>
          <button
            style={{ marginLeft: "1rem", height: "2.2rem" }}
            onClick={() => {
              setSearchName(pendingName);
              setSearchSkills(pendingSkills);
            }}
          >
            Search
          </button>
        </div>
        <div className="filterRow">
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
      </div>

      {/* Content Section */}
      <div className="dashboardContainer">
        <div className="pageContentCenter">
          {/* Sort Buttons */}
          <div className="sortButtons">
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
          {getAppCoursePairs().length === 0 ? (
            <p></p>
          ) : (
            getAppCoursePairs().map(({ app, courseObj }) => {
              const fullName = `${app.applicant.firstName} ${app.applicant.lastName}`;
              const isSelected = !!selected[`${app.applicationID}`];
              const rankingObj = rankings.find(r => r.applicationId === app.applicationID);
              const isRanked = !!rankingObj;
              const currentRank = rankingObj?.rank;
              return (
                <ApplicationListCard
                  key={`${app.applicationID}-${courseObj.courseID}`}
                  name={fullName}
                  course={courseObj}
                  applicantId={app.applicant.userid}
                  position={app.position}
                  isSelected={isSelected}
                  isRanked={isRanked}
                  currentRank={currentRank}
                  onToggleSelect={() => handleSelect(app.applicationID)}
                  onSetRank={(rank) => handleSetRank(app.applicationID, rank)}
                  onDeleteRank={() => currentRank && handleDeleteRank(currentRank)}
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
      <div className="analyticsSection">
        <ApplicantBarChart data={barChartData} title="Applicant Selection Counts" />
        <div className="analyticsSummary">
          {mostChosen.length > 0 && (
            <div className="mostChosen"><b>Most Chosen:</b> {mostChosen.map((a) => a.name).join(", ")}</div>
          )}
          {leastChosen.length > 0 && (
            <div className="leastChosen">
              <b>Least Chosen:</b> {leastChosen.map((a) => a.name).join(", ")}
            </div>
          )}
          {unselectedCandidates.length > 0 && (
            <div className="unselectedCandidates">
              <b>Candidates who have not been selected:</b> {unselectedCandidates.map((a) => a.name).join(", ")}
            </div>
          )}
        </div>
      </div>
      <div className="rankingsSectionCard">
        <h3>Your Rankings</h3>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
          {/* Top of pyramid: Rank 1 */}
          <div className="pyramidTop">
            {(() => {
              const ranking = rankings.find(r => r.rank === 1);
              if (!ranking) return <span className="notSet">1: Not set</span>;
              const app = tutorsList.find(a => a.applicationID === ranking.applicationId);
              const name = app ? `${app.applicant.firstName} ${app.applicant.lastName}` : 'Unknown';
              return <span>1: {name}</span>;
            })()}
          </div>
          {/* Bottom of pyramid: Ranks 2 and 3 */}
          <div className="pyramidBottom">
            {[2, 3].map(rank => {
              const ranking = rankings.find(r => r.rank === rank);
              if (!ranking) return <div key={rank} className="notSet">{rank}: Not set</div>;
              const app = tutorsList.find(a => a.applicationID === ranking.applicationId);
              const name = app ? `${app.applicant.firstName} ${app.applicant.lastName}` : 'Unknown';
              return <div key={rank}>{rank}: {name}</div>;
            })}
          </div>
        </div>
      </div>
      {/* Footer remains at the bottom */}
      <Footer />
    </div>
  );
}