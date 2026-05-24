import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const goalConfig = {
  "Frontend Developer": { icon: "🎨", color: "#2563eb" },
  "Backend Developer": { icon: "⚙️", color: "#0891b2" },
  "Full Stack Developer": { icon: "🌐", color: "#7c3aed" },
  "Data Analyst": { icon: "📊", color: "#16a34a" },
  "Machine Learning Engineer": { icon: "🤖", color: "#d97706" },
  "Software Developer": { icon: "💻", color: "#dc2626" },
  "Cybersecurity Specialist": { icon: "🔐", color: "#0f172a" },
  "UI/UX Developer": { icon: "✏️", color: "#db2777" },
  "Database Administrator": { icon: "🗄️", color: "#0369a1" },
  "DevOps Engineer": { icon: "🚀", color: "#059669" },
};

const goalDescriptions = {
  "Frontend Developer": "Build beautiful user interfaces with HTML, CSS & JavaScript.",
  "Backend Developer": "Power apps with Node.js, APIs and databases.",
  "Full Stack Developer": "Master both frontend and backend development.",
  "Data Analyst": "Turn raw data into insights with SQL and Python.",
  "Machine Learning Engineer": "Build intelligent systems with ML algorithms.",
  "Software Developer": "Write clean, efficient and scalable code.",
  "Cybersecurity Specialist": "Protect systems from threats and vulnerabilities.",
  "UI/UX Developer": "Design intuitive and beautiful user experiences.",
  "Database Administrator": "Manage, optimize and secure databases.",
  "DevOps Engineer": "Automate deployments with CI/CD and cloud tools.",
};

function GoalSelection() {
  const [selectedGoal, setSelectedGoal] = useState("");
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/api/goals")
      .then((res) => res.json())
      .then((data) => {
        setGoals(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });

    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleContinue = () => {
    if (!selectedGoal) return;
    navigate("/assessment", { state: { selectedGoal } });
  };

  return (
    <div style={{
      ...styles.page,
      flexDirection: isMobile ? "column" : "row",
    }}>
      {/* Left Section */}
      <div style={{
        ...styles.left,
        width: isMobile ? "100%" : "32%",
        padding: isMobile ? "30px 24px" : "60px 40px",
      }}>
        <p style={styles.tag}>🎯 Career Path Selection</p>
        <h1 style={{
          ...styles.title,
          fontSize: isMobile ? "32px" : "44px",
        }}>
          Choose Your Goal
        </h1>
        <p style={styles.subtitle}>
          Select the IT career path you want to follow. Learnixa will
          recommend courses based on your goal and current skill level.
        </p>

        {selectedGoal ? (
          <div style={styles.selectedBox}>
            <div style={{
              ...styles.selectedIcon,
              backgroundColor: goalConfig[selectedGoal]?.color + "20",
              color: goalConfig[selectedGoal]?.color,
            }}>
              {goalConfig[selectedGoal]?.icon}
            </div>
            <div>
              <p style={styles.selectedLabel}>Selected Goal</p>
              <p style={styles.selectedGoalName}>{selectedGoal}</p>
            </div>
          </div>
        ) : (
          <div style={styles.hintBox}>
            <p style={styles.hintText}>👆 Click any career path to select it</p>
          </div>
        )}

        <button
          onClick={handleContinue}
          disabled={!selectedGoal}
          style={{
            ...styles.button,
            ...(selectedGoal ? styles.activeButton : styles.disabledButton),
          }}
        >
          {selectedGoal ? "Start Assessment →" : "Select a Goal First"}
        </button>

        <p style={styles.noteText}>
          📝 You'll answer 15 skill questions after selecting your goal.
        </p>
      </div>

      {/* Right Section */}
      <div style={{
        ...styles.right,
        width: isMobile ? "100%" : "68%",
        padding: isMobile ? "24px" : "40px",
      }}>
        {loading ? (
          <p style={styles.statusText}>Loading goals...</p>
        ) : (
          <div style={{
            ...styles.goalGrid,
            gridTemplateColumns: isMobile
              ? "repeat(2, 1fr)"
              : "repeat(auto-fit, minmax(200px, 1fr))",
          }}>
            {goals.map((goal) => {
              const isSelected = selectedGoal === goal;
              const config = goalConfig[goal] || { icon: "💡", color: "#2563eb" };
              const desc = goalDescriptions[goal] || `Start your path toward ${goal.toLowerCase()}.`;

              return (
                <div
                  key={goal}
                  onClick={() => setSelectedGoal(goal)}
                  style={{
                    ...styles.card,
                    border: isSelected
                      ? `2px solid ${config.color}`
                      : "1px solid #e2e8f0",
                    boxShadow: isSelected
                      ? `0 8px 24px ${config.color}30`
                      : "0 2px 8px rgba(0,0,0,0.04)",
                    transform: isSelected ? "translateY(-3px)" : "translateY(0)",
                    backgroundColor: isSelected ? `${config.color}08` : "#ffffff",
                  }}
                >
                  <div style={{
                    ...styles.cardIconWrapper,
                    backgroundColor: `${config.color}15`,
                  }}>
                    <span style={styles.cardIcon}>{config.icon}</span>
                  </div>
                  <h3 style={{
                    ...styles.cardTitle,
                    color: isSelected ? config.color : "#1e293b",
                    fontSize: isMobile ? "13px" : "16px",
                  }}>
                    {goal}
                  </h3>
                  {!isMobile && (
                    <p style={styles.cardText}>{desc}</p>
                  )}
                  {isSelected && (
                    <div style={{ ...styles.selectedCheck, color: config.color }}>
                      ✓ Selected
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#f0f4f8",
    display: "flex",
  },
  left: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    backgroundColor: "#ffffff",
    borderRight: "1px solid #e2e8f0",
    boxShadow: "2px 0 10px rgba(0,0,0,0.04)",
    position: "sticky",
    top: 0,
    height: "100vh",
  },
  right: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
    overflowY: "auto",
    paddingTop: "40px",
    paddingBottom: "40px",
  },
  tag: {
    display: "inline-block",
    padding: "8px 16px",
    borderRadius: "999px",
    backgroundColor: "#eff6ff",
    color: "#2563eb",
    fontSize: "14px",
    fontWeight: "600",
    marginBottom: "18px",
    border: "1px solid #bfdbfe",
    width: "fit-content",
  },
  title: {
    lineHeight: "1.1",
    marginBottom: "16px",
    color: "#1e293b",
    fontWeight: "800",
  },
  subtitle: {
    fontSize: "14px",
    lineHeight: "1.7",
    color: "#64748b",
    marginBottom: "28px",
  },
  selectedBox: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    backgroundColor: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
    padding: "14px 16px",
    marginBottom: "20px",
  },
  selectedIcon: {
    width: "40px",
    height: "40px",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
    flexShrink: 0,
  },
  selectedLabel: {
    fontSize: "11px",
    color: "#94a3b8",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    marginBottom: "2px",
  },
  selectedGoalName: {
    fontSize: "15px",
    fontWeight: "700",
    color: "#1e293b",
  },
  hintBox: {
    backgroundColor: "#f8fafc",
    border: "1px dashed #e2e8f0",
    borderRadius: "12px",
    padding: "14px 16px",
    marginBottom: "20px",
  },
  hintText: {
    fontSize: "14px",
    color: "#94a3b8",
    textAlign: "center",
  },
  button: {
    padding: "14px 28px",
    borderRadius: "10px",
    border: "none",
    fontSize: "15px",
    fontWeight: "700",
    width: "100%",
    marginBottom: "16px",
    transition: "all 0.2s ease",
  },
  activeButton: {
    background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
    color: "#ffffff",
    cursor: "pointer",
    boxShadow: "0 8px 20px rgba(37, 99, 235, 0.3)",
  },
  disabledButton: {
    backgroundColor: "#f1f5f9",
    color: "#94a3b8",
    cursor: "not-allowed",
  },
  noteText: {
    fontSize: "13px",
    color: "#94a3b8",
    lineHeight: "1.6",
  },
  statusText: {
    color: "#64748b",
    fontSize: "18px",
  },
  goalGrid: {
    width: "100%",
    display: "grid",
    gap: "16px",
  },
  card: {
    borderRadius: "14px",
    padding: "20px",
    cursor: "pointer",
    transition: "all 0.2s ease",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  cardIconWrapper: {
    width: "44px",
    height: "44px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "4px",
  },
  cardIcon: {
    fontSize: "22px",
  },
  cardTitle: {
    fontWeight: "700",
    lineHeight: "1.3",
  },
  cardText: {
    fontSize: "13px",
    color: "#64748b",
    lineHeight: "1.5",
    margin: 0,
  },
  selectedCheck: {
    fontSize: "12px",
    fontWeight: "700",
    marginTop: "4px",
  },
};

export default GoalSelection;