import Nav from "../components/NavBar";
import Footer from "../components/Footer";

import { useState, useEffect } from "react";
import { userApi } from "../services/api";

import InfoDetailsCard from "../components/InfoDetailsCard";
import { useAuth } from "../context/authContext";
import { ApplicationInfo } from "../types/application";

// Pre-populated courses as per assignment specifications.
const courses: string[] = [
  "COSC4043 Full Stack Development",
  "COSC2103 Algorithms & Analysis",
  "COSC2333 Computing Theory",
  "COSC2105 Computer Networks",
  "COSC2106 Operating Systems",
  "COSC2107 Database Systems",
];

export default function Lecturer() {
  // State to store list of tutor applications
  const [tutorsList, setTutorsList] = useState<ApplicationInfo[]>([]);

  // States for filtering by name and skills
  const [searchName, setSearchName] = useState("");
  const [searchSkills, setSearchSkills] = useState("");

  // States for filtering by course and availability
  const [courseFilter, setCourseFilter] = useState<string[]>([]);
  const [availFilter, setAvailFilter] = useState<string[]>([]);

  // State to store which candidates the lecturer has selected
  const [selectedCandidate, setSelectedCandidate] = useState<string[]>([]);

  // State to store ranked candidates for each lecturer
  const [rankedCandidates, setRankedCandidates] = useState<string[]>([]);

  // State for showing detailed info for selected tutor
  const [showInfoTutor, setShowInfoTutor] = useState<ApplicationInfo[]>();

  // Get the current logged in lecturer from auth context
  const { user } = useAuth();

  // State for sorting options
  const [sortState, setSortState] = useState({
    type: "",
    order: "asc",
  });

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

  /*

  // Use effect to fetch the ranked candidates from localStorage based on the lecturer's name.
  useEffect(() => {
    if (user) {
      const lecturerName = user.name;
      try {
        const storedRankedCandidates = JSON.parse(
          localStorage.getItem(`ranked|${lecturerName}`) || "[]"
        );
        setRankedCandidates(storedRankedCandidates);
      } catch (error) {
        console.log("Problem occurred retrieving ranked candidates.");
      }
    }
  }, [user]);

  // Handler for selecting/deselecting a candidate (tutor)
  const handleSelection = (name: string, course: string) => {
    if (!user) return;

    const lecturerName = user.name;
    const lecturerKey = `selected|${lecturerName}`;
    const globalCountKey = `selectedCount|${name}`;

    // Get current selections by this lecturer
    const currentSelections = JSON.parse(
      localStorage.getItem(lecturerKey) || "[]"
    );
    const key = `${name}|${course}`;
    const alreadySelected = currentSelections.includes(key);

    // Update lecturer-specific selection list
    const newSelections = alreadySelected
      ? currentSelections.filter((entry: string) => entry !== key)
      : [...currentSelections, key];

    localStorage.setItem(lecturerKey, JSON.stringify(newSelections));
    setSelectedCandidate(newSelections);

    // Update global selectedCount for this tutor
    const oldCount = parseInt(localStorage.getItem(globalCountKey) || "0", 10);
    const newCount = alreadySelected ? Math.max(oldCount - 1, 0) : oldCount + 1;
    localStorage.setItem(globalCountKey, newCount.toString());

    // Update displayed tutors list
    setTutorsList((prevTutors) => {
      return prevTutors.map((applicant) => {
        if (applicant.name === name) {
          return { ...applicant, selectedCount: newCount };
        }
        return applicant;
      });
    });
  };

  // Re-load the lecturer-specific selection from localStorage when the user changes.
  useEffect(() => {
    if (user) {
      const lecturerName = user.name;
      try {
        const storedSelected = JSON.parse(
          localStorage.getItem(`selected|${lecturerName}`) || "[]"
        );
        setSelectedCandidate(storedSelected);
      } catch {
        setSelectedCandidate([]);
      }
    }
  }, [user]);

  // Function to get the least selected tutor
  const getLeastSelectedTutor = () => {
    const sortedTutors = [...tutorsList].sort((a, b) => {
      return (a.selectedCount || 0) - (b.selectedCount || 0);
    });

    // Filter out tutors with selectedCount of 0
    const filteredTutors = sortedTutors.filter(
      (tutor) => (tutor.selectedCount || 0) > 0
    );

    return filteredTutors.length > 0 ? filteredTutors[0] : null;
  };

  // Function to get the tutors who have not been selected
  const getNotChosenTutors = () => {
    const notChosen = tutorsList.filter(
      (tutor) => (tutor.selectedCount || 0) === 0
    );

    // Deduplicate For Tutors who have applied for multiple courses but haven't been selected
    const seen = new Set();
    return notChosen.filter((tutor) => {
      if (seen.has(tutor.name)) return false;
      seen.add(tutor.name);
      return true;
    });
  };

  // Handler for lecturer's rankings
  const handleRanking = (name: string) => {
    if (!user) {
      return;
    }

    const lecturerName = user.name;

    // Update the ranked candidates in the state
    setRankedCandidates((prev) => {
      const updated = prev.includes(name)
        ? prev.filter((n) => n !== name) // If already ranked, remove from the list
        : [...prev, name]; // Otherwise, add to the list

      // Store the updated ranked candidates in localStorage with lecturer's name as key
      localStorage.setItem(`ranked|${lecturerName}`, JSON.stringify(updated));

      return updated;
    });
  };

  // Handler for showing tutor details when show more info is clicked
  const handleShowInfo = (name: string, course: string) => {
    if (
      showInfoTutor &&
      showInfoTutor[0]?.name == name &&
      showInfoTutor[0]?.coursesApplied == course
    ) {
      setShowInfoTutor(undefined);
    } else {
      const showInfoTut = tutorsList.filter(
        (tutor) => tutor.name == name && tutor.coursesApplied == course
      );
      setShowInfoTutor(showInfoTut);
    }
  };

  // Returns the tutor who has been selected the most.
  const getMostSelectedTutor = () => {
    const sortedTutors = [...tutorsList].sort((a, b) => {
      return (b.selectedCount || 0) - (a.selectedCount || 0);
    });
    return sortedTutors[0];
  };

  // Filtering tutorsList according to search bar, course, and availability.
  const filteredTutors = tutorsList.filter((applicant) => {
    // Filter by name (case-insensitive)
    const filterSearch = applicant.name
      .toLowerCase()
      .includes(searchName.toLowerCase());

    // Filter by skills (case-insensitive)
    const filterSearchSkills = applicant.skills.some((skill) =>
      skill.toLowerCase().includes(searchSkills.toLowerCase())
    );

    // Filter by selected course (if any)
    const filterCourse =
      courseFilter.length === 0 ||
      courseFilter.includes(applicant.coursesApplied);
    if (applicant.availability === null) {
      applicant.availability = "";
    }

    // Filter by availability
    const filterAvailability =
      availFilter.length === 0 ||
      availFilter.includes(applicant.availability.toLowerCase());

    return (
      filterSearch && filterCourse && filterAvailability && filterSearchSkills
    );
  });

  // Sort By
  if (sortState.type === "availability") {
    filteredTutors.sort((a, b) => {
      const aAvail = a.availability?.toLowerCase() || "";
      const bAvail = b.availability?.toLowerCase() || "";
      return sortState.order === "asc"
        ? aAvail.localeCompare(bAvail)
        : bAvail.localeCompare(aAvail);
    });
  } else if (sortState.type === "course") {
    filteredTutors.sort((a, b) => {
      const aCourse = a.coursesApplied.toLowerCase();
      const bCourse = b.coursesApplied.toLowerCase();
      return sortState.order === "asc"
        ? aCourse.localeCompare(bCourse)
        : bCourse.localeCompare(aCourse);
    });
  }

  // Compute the tutor with the highest selected count
  const mostSelectedTutor = getMostSelectedTutor(); */

  return (
    <div>
      <Nav />

      <div className="pageHeader">
        <h1>Dashboard</h1>
      </div>

      {/* Horizontal Filter Bar */}
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
                  <li key={index} value={course}>
                    <input
                      type="checkbox"
                      name={course}
                      value={course}
                      onChange={(e) => {
                        const course = e.target.value;
                        setCourseFilter((prev) =>
                          e.target.checked
                            ? [...prev, course]
                            : prev.filter((c) => c !== course)
                        );
                      }}
                    />
                    <label htmlFor={course}>{course}</label>
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

      {/* Page Content Below Filter Bar */}
      <div className="dashboardContainer">
        {/* Left + Center: Applicant Cards */}
        <div className="pageContentCenter">
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
              Sort by Availability{" "}
              {sortState.type === "availability"
                ? sortState.order === "asc"
                  ? "↑"
                  : "↓"
                : ""}
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
              Sort by Course Name{" "}
              {sortState.type === "course"
                ? sortState.order === "asc"
                  ? "↑"
                  : "↓"
                : ""}
            </button>
          </div>
        </div>

        {/* Right Column: Info Card */}
        <div className="pageContentRight">
          <InfoDetailsCard showInfoTut={showInfoTutor} />
        </div>
      </div>

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

      <Footer />
    </div>
  );
}
