import { useLocation, Link } from "react-router-dom";
import { useState, useEffect } from "react";

const useConfetti = (trigger) => {
  useEffect(() => {
    if (!trigger) return;

    const canvas = document.createElement("canvas");
    canvas.style.position = "fixed";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.pointerEvents = "none";
    canvas.style.zIndex = "9999";
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);

    const ctx = canvas.getContext("2d");
    const pieces = Array.from({ length: 150 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      w: Math.random() * 10 + 6,
      h: Math.random() * 6 + 4,
      color: ["#2563eb", "#0ea5a4", "#16a34a", "#d97706", "#dc2626", "#7c3aed", "#db2777"][
        Math.floor(Math.random() * 7)
      ],
      rotation: Math.random() * 360,
      speed: Math.random() * 3 + 2,
      spin: Math.random() * 4 - 2,
    }));

    let animId;
    let elapsed = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      elapsed++;

      pieces.forEach((p) => {
        p.y += p.speed;
        p.rotation += p.spin;
        if (p.y > canvas.height) {
          p.y = -10;
          p.x = Math.random() * canvas.width;
        }

        ctx.save();
        ctx.translate(p.x + p.w / 2, p.y + p.h / 2);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = elapsed > 180 ? Math.max(0, 1 - (elapsed - 180) / 60) : 1;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      });

      if (elapsed < 240) {
        animId = requestAnimationFrame(animate);
      } else {
        cancelAnimationFrame(animId);
        document.body.removeChild(canvas);
      }
    };

    animId = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(animId);
      if (document.body.contains(canvas)) document.body.removeChild(canvas);
    };
  }, [trigger]);
};

function Recommendations() {
  const location = useLocation();
  const selectedGoal = location.state?.selectedGoal || "No goal selected";
  const effectiveGoal = location.state?.effectiveGoal || selectedGoal;
  const scores = location.state?.scores || {};
  const answers = location.state?.answers || [];
  const questions = location.state?.questions || [];

  const [recommendedCourses, setRecommendedCourses] = useState([]);
  const [userLevel, setUserLevel] = useState("");
  const [averageScore, setAverageScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useConfetti(averageScore >= 90);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    fetch("http://localhost:5000/api/recommendations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ scores, effective_goal: effectiveGoal }),
    })
      .then((res) => res.json())
      .then((data) => {
        setRecommendedCourses(data.recommendations || []);
        setUserLevel(data.userLevel || "");
        setAverageScore(data.averageScore || 0);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Could not load recommendations.");
        setLoading(false);
      });
  }, []);

  // Build summary
  const bySkill = {};
  questions.forEach((q, i) => {
    if (!bySkill[q.skill]) bySkill[q.skill] = { correct: 0, wrong: 0, timedOut: 0 };
    if (answers[i] === null || answers[i] === undefined) {
      bySkill[q.skill].timedOut++;
    } else if (answers[i] === q.answer) {
      bySkill[q.skill].correct++;
    } else {
      bySkill[q.skill].wrong++;
    }
  });

  const summary = {
    total: questions.length,
    correct: questions.filter((q, i) => answers[i] === q.answer).length,
    wrong: questions.filter((q, i) => answers[i] !== null && answers[i] !== undefined && answers[i] !== q.answer).length,
    timedOut: answers.filter((a) => a === null || a === undefined).length,
    bySkill,
  };

  const learningPath = [...recommendedCourses].sort((a, b) => {
    const order = { Beginner: 1, Intermediate: 2, Advanced: 3 };
    return order[a.level] - order[b.level];
  });

  const levelConfig = {
    Beginner: { bg: "#f0fdf4", text: "#16a34a", border: "#bbf7d0", icon: "🌱" },
    Intermediate: { bg: "#fffbeb", text: "#d97706", border: "#fde68a", icon: "⚡" },
    Advanced: { bg: "#fef2f2", text: "#dc2626", border: "#fecaca", icon: "🔥" },
  };

  const providerColors = {
    YouTube: { bg: "#fef2f2", text: "#dc2626" },
    Udemy: { bg: "#fff7ed", text: "#ea580c" },
    Coursera: { bg: "#eff6ff", text: "#2563eb" },
  };

  return (
    <div style={styles.page}>
      <div style={{
        ...styles.wrapper,
        padding: isMobile ? "20px 16px" : "40px 20px",
      }}>

        {/* Hero Header */}
        <div style={{
          ...styles.heroHeader,
          flexDirection: isMobile ? "column" : "row",
          padding: isMobile ? "24px" : "40px",
          gap: isMobile ? "20px" : "30px",
        }}>
          <div style={styles.heroLeft}>
            <p style={styles.tag}>🤖 AI Recommendation Result</p>
            <h1 style={{ ...styles.title, fontSize: isMobile ? "28px" : "40px" }}>
              Your Personalized<br />Learning Plan
            </h1>
            <p style={styles.goalText}>
              Goal: <strong style={{ color: "#2563eb" }}>{selectedGoal}</strong>
            </p>
          </div>

          {userLevel && (
            <div style={{ ...styles.levelCard, width: isMobile ? "100%" : "auto" }}>
              <p style={styles.levelIcon}>{levelConfig[userLevel]?.icon}</p>
              <p style={styles.levelLabel}>Your Level</p>
              <p style={{ ...styles.levelValue, color: levelConfig[userLevel]?.text }}>
                {userLevel}
              </p>
              <div style={styles.avgCircle}>
                <span style={styles.avgNumber}>{averageScore}%</span>
                <span style={styles.avgLabel}>Avg Score</span>
              </div>
              <p style={styles.levelDesc}>
                {userLevel === "Beginner" && "Focus on fundamentals first."}
                {userLevel === "Intermediate" && "Build on your solid foundation."}
                {userLevel === "Advanced" && "Explore advanced topics."}
              </p>
            </div>
          )}
        </div>

        {/* Celebration Banner */}
        {averageScore >= 90 && (
          <div style={styles.celebrationBanner}>
            <span style={styles.celebrationEmoji}>🎉</span>
            <div>
              <p style={styles.celebrationTitle}>Outstanding Performance!</p>
              <p style={styles.celebrationText}>
                You scored {averageScore}% — you're in the top tier! Keep pushing forward.
              </p>
            </div>
            <span style={styles.celebrationEmoji}>🏆</span>
          </div>
        )}

        {/* Assessment Summary */}
        {questions.length > 0 && (
          <div style={styles.summaryCard}>
            <h2 style={styles.cardTitle}>📋 Assessment Summary</h2>
            <div style={{
              ...styles.summaryGrid,
              gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)",
            }}>
              <div style={styles.summaryItem}>
                <span style={styles.summaryNumber}>{summary.total}</span>
                <span style={styles.summaryLabel}>Total Questions</span>
              </div>
              <div style={{ ...styles.summaryItem, borderLeft: "3px solid #16a34a" }}>
                <span style={{ ...styles.summaryNumber, color: "#16a34a" }}>{summary.correct}</span>
                <span style={styles.summaryLabel}>Correct ✅</span>
              </div>
              <div style={{ ...styles.summaryItem, borderLeft: "3px solid #dc2626" }}>
                <span style={{ ...styles.summaryNumber, color: "#dc2626" }}>{summary.wrong}</span>
                <span style={styles.summaryLabel}>Wrong ❌</span>
              </div>
              <div style={{ ...styles.summaryItem, borderLeft: "3px solid #d97706" }}>
                <span style={{ ...styles.summaryNumber, color: "#d97706" }}>{summary.timedOut}</span>
                <span style={styles.summaryLabel}>Timed Out ⏱</span>
              </div>
            </div>

            <h3 style={styles.breakdownTitle}>Skill Breakdown</h3>
            <div style={{
              ...styles.breakdownGrid,
              gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(200px, 1fr))",
            }}>
              {Object.keys(summary.bySkill).map((skill) => {
                const s = summary.bySkill[skill];
                return (
                  <div key={skill} style={styles.skillBreakdown}>
                    <p style={styles.skillName}>{skill}</p>
                    <div style={styles.skillStats}>
                      <span style={styles.correctStat}>✅ {s.correct} correct</span>
                      <span style={styles.wrongStat}>❌ {s.wrong} wrong</span>
                      <span style={styles.timedStat}>⏱ {s.timedOut} timed out</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Skill Scores */}
        <div style={styles.scoresCard}>
          <h2 style={styles.cardTitle}>📊 Your Skill Scores</h2>
          <div style={{
            ...styles.scoresGrid,
            gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(250px, 1fr))",
          }}>
            {Object.keys(scores).map((skill) => (
              <div key={skill} style={styles.scoreItem}>
                <div style={styles.scoreHeader}>
                  <span style={styles.scoreSkill}>{skill}</span>
                  <span style={{
                    ...styles.scoreValue,
                    color: scores[skill] >= 70 ? "#16a34a" : scores[skill] >= 40 ? "#d97706" : "#dc2626",
                  }}>
                    {scores[skill]}%
                  </span>
                </div>
                <div style={styles.scoreBarBg}>
                  <div style={{
                    ...styles.scoreBarFill,
                    width: `${scores[skill]}%`,
                    background: scores[skill] >= 70
                      ? "linear-gradient(90deg, #16a34a, #22c55e)"
                      : scores[skill] >= 40
                      ? "linear-gradient(90deg, #d97706, #f59e0b)"
                      : "linear-gradient(90deg, #dc2626, #ef4444)",
                  }} />
                </div>
                <p style={styles.scoreStatus}>
                  {scores[skill] >= 70 ? "✅ Strong" : scores[skill] >= 40 ? "⚡ Developing" : "📚 Needs Work"}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <div style={styles.section}>
          <h2 style={{ ...styles.sectionTitle, fontSize: isMobile ? "20px" : "24px" }}>
            🎯 Top Course Recommendations
          </h2>
          <p style={styles.sectionSubtitle}>
            Ranked by how well they match your current skill profile
          </p>

          {loading ? (
            <div style={styles.loadingBox}>
              <p style={styles.loadingText}>🔍 Finding best courses for you...</p>
            </div>
          ) : error ? (
            <p style={styles.statusText}>{error}</p>
          ) : recommendedCourses.length === 0 ? (
            <p style={styles.statusText}>No courses found for your level.</p>
          ) : (
            <div style={{
              ...styles.courseGrid,
              gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(260px, 1fr))",
            }}>
              {recommendedCourses.map((course, index) => (
                <div key={index} style={{
                  ...styles.card,
                  borderTop: `4px solid ${index === 0 ? "#2563eb" : index === 1 ? "#0ea5a4" : "#e2e8f0"}`,
                }}>
                  {index === 0 && (
                    <div style={styles.topPickBadge}>⭐ Best Match</div>
                  )}
                  <div style={styles.cardTopRow}>
                    <span style={{
                      ...styles.levelTag,
                      backgroundColor: levelConfig[course.level]?.bg,
                      color: levelConfig[course.level]?.text,
                      border: `1px solid ${levelConfig[course.level]?.border}`,
                    }}>
                      {levelConfig[course.level]?.icon} {course.level}
                    </span>
                    <span style={styles.matchBadge}>{course.match}% Match</span>
                  </div>
                  <h3 style={styles.cardTitle2}>{course.title}</h3>
                  <div style={styles.matchBarBg}>
                    <div style={{ ...styles.matchBarFill, width: `${course.match}%` }} />
                  </div>
                  <div style={styles.cardFooter}>
                    <span style={{
                      ...styles.providerBadge,
                      backgroundColor: providerColors[course.provider]?.bg || "#f8fafc",
                      color: providerColors[course.provider]?.text || "#64748b",
                    }}>
                      {course.provider}
                    </span>
                    <a href={course.link} target="_blank" rel="noreferrer" style={styles.linkButton}>
                      View →
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Learning Path */}
        <div style={styles.section}>
          <h2 style={{ ...styles.sectionTitle, fontSize: isMobile ? "20px" : "24px" }}>
            🗺️ Your Learning Path
          </h2>
          <p style={styles.sectionSubtitle}>
            Follow this order for the best learning experience
          </p>
          <div style={styles.pathContainer}>
            {learningPath.map((course, index) => (
              <div key={index} style={styles.pathStep}>
                <div style={styles.pathLeft}>
                  <div style={styles.stepCircle}>
                    <span style={styles.stepNumber}>{index + 1}</span>
                  </div>
                  {index < learningPath.length - 1 && <div style={styles.stepLine} />}
                </div>
                <div style={styles.stepCard}>
                  <div style={{
                    ...styles.stepCardTop,
                    flexDirection: isMobile ? "column" : "row",
                    alignItems: isMobile ? "flex-start" : "center",
                  }}>
                    <h4 style={styles.stepTitle}>{course.title}</h4>
                    <span style={{
                      ...styles.stepLevelBadge,
                      backgroundColor: levelConfig[course.level]?.bg,
                      color: levelConfig[course.level]?.text,
                      border: `1px solid ${levelConfig[course.level]?.border}`,
                    }}>
                      {course.level}
                    </span>
                  </div>
                  <p style={styles.stepProvider}>{course.provider} · {course.match}% match</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Retake */}
        <div style={{
          ...styles.retakeSection,
          flexDirection: isMobile ? "column" : "row",
          textAlign: isMobile ? "center" : "left",
        }}>
          <div style={styles.retakeLeft}>
            <h3 style={styles.retakeTitle}>Want to try again?</h3>
            <p style={styles.retakeText}>
              Retake the assessment or explore a different career goal.
            </p>
          </div>
          <Link to="/goal-selection" style={{
            ...styles.retakeButton,
            width: isMobile ? "100%" : "auto",
            textAlign: "center",
          }}>
            Retake Assessment →
          </Link>
        </div>

      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", backgroundColor: "#f0f4f8" },
  wrapper: { maxWidth: "1100px", margin: "0 auto" },
  heroHeader: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "20px",
    marginBottom: "24px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  },
  heroLeft: { flex: 1 },
  tag: {
    display: "inline-block", padding: "8px 16px", borderRadius: "999px",
    backgroundColor: "#eff6ff", color: "#2563eb", fontSize: "14px",
    fontWeight: "600", marginBottom: "16px", border: "1px solid #bfdbfe",
  },
  title: { color: "#1e293b", fontWeight: "800", lineHeight: "1.2", marginBottom: "12px" },
  goalText: { color: "#64748b", fontSize: "16px" },
  levelCard: {
    backgroundColor: "#f8fafc", border: "1px solid #e2e8f0",
    borderRadius: "16px", padding: "24px", textAlign: "center", minWidth: "180px",
  },
  levelIcon: { fontSize: "36px", marginBottom: "8px" },
  levelLabel: { color: "#64748b", fontSize: "13px", marginBottom: "4px" },
  levelValue: { fontSize: "24px", fontWeight: "800", marginBottom: "12px" },
  avgCircle: {
    display: "flex", flexDirection: "column", alignItems: "center",
    backgroundColor: "#ffffff", border: "1px solid #e2e8f0",
    borderRadius: "12px", padding: "10px 16px", marginBottom: "12px",
  },
  avgNumber: { fontSize: "28px", fontWeight: "800", color: "#2563eb" },
  avgLabel: { fontSize: "12px", color: "#64748b" },
  levelDesc: { color: "#64748b", fontSize: "13px", lineHeight: "1.5" },
  celebrationBanner: {
    display: "flex", alignItems: "center", justifyContent: "center",
    gap: "16px", backgroundColor: "#fffbeb", border: "2px solid #fde68a",
    borderRadius: "16px", padding: "20px 28px", marginBottom: "24px",
    boxShadow: "0 4px 12px rgba(217, 119, 6, 0.15)", textAlign: "center",
  },
  celebrationEmoji: { fontSize: "36px", flexShrink: 0 },
  celebrationTitle: { fontSize: "18px", fontWeight: "700", color: "#92400e", marginBottom: "4px" },
  celebrationText: { fontSize: "14px", color: "#b45309" },
  summaryCard: {
    backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "16px",
    padding: "28px", marginBottom: "24px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  },
  summaryGrid: { display: "grid", gap: "16px", marginBottom: "24px" },
  summaryItem: {
    display: "flex", flexDirection: "column", alignItems: "center",
    padding: "16px", backgroundColor: "#f8fafc", borderRadius: "12px",
    borderLeft: "3px solid #e2e8f0",
  },
  summaryNumber: { fontSize: "36px", fontWeight: "800", color: "#1e293b", lineHeight: "1", marginBottom: "6px" },
  summaryLabel: { fontSize: "13px", color: "#64748b", fontWeight: "500" },
  breakdownTitle: { fontSize: "16px", color: "#1e293b", fontWeight: "600", marginBottom: "14px" },
  breakdownGrid: { display: "grid", gap: "12px" },
  skillBreakdown: {
    backgroundColor: "#f8fafc", border: "1px solid #e2e8f0",
    borderRadius: "10px", padding: "14px 16px",
  },
  skillName: { fontSize: "14px", fontWeight: "600", color: "#1e293b", marginBottom: "8px" },
  skillStats: { display: "flex", gap: "12px", flexWrap: "wrap" },
  correctStat: { fontSize: "13px", color: "#16a34a", fontWeight: "600" },
  wrongStat: { fontSize: "13px", color: "#dc2626", fontWeight: "600" },
  timedStat: { fontSize: "13px", color: "#d97706", fontWeight: "600" },
  scoresCard: {
    backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "16px",
    padding: "24px", marginBottom: "24px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  },
  cardTitle: { fontSize: "20px", color: "#1e293b", fontWeight: "700", marginBottom: "20px" },
  scoresGrid: { display: "grid", gap: "20px" },
  scoreItem: { display: "flex", flexDirection: "column", gap: "6px" },
  scoreHeader: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  scoreSkill: { color: "#1e293b", fontSize: "15px", fontWeight: "600" },
  scoreValue: { fontSize: "15px", fontWeight: "700" },
  scoreBarBg: { width: "100%", height: "10px", backgroundColor: "#e2e8f0", borderRadius: "999px", overflow: "hidden" },
  scoreBarFill: { height: "100%", borderRadius: "999px", transition: "width 0.5s ease" },
  scoreStatus: { fontSize: "12px", color: "#64748b" },
  section: { marginBottom: "32px" },
  sectionTitle: { color: "#1e293b", fontWeight: "700", marginBottom: "6px" },
  sectionSubtitle: { color: "#64748b", fontSize: "15px", marginBottom: "20px" },
  loadingBox: {
    backgroundColor: "#ffffff", border: "1px solid #e2e8f0",
    borderRadius: "16px", padding: "40px", textAlign: "center",
  },
  loadingText: { color: "#64748b", fontSize: "18px" },
  statusText: { textAlign: "center", color: "#64748b", fontSize: "18px", padding: "40px" },
  courseGrid: { display: "grid", gap: "20px" },
  card: {
    backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "14px",
    padding: "20px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)", position: "relative",
  },
  topPickBadge: {
    position: "absolute", top: "-12px", left: "16px", backgroundColor: "#2563eb",
    color: "#ffffff", padding: "4px 12px", borderRadius: "999px", fontSize: "12px", fontWeight: "700",
  },
  cardTopRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", marginTop: "8px" },
  levelTag: { padding: "4px 10px", borderRadius: "999px", fontSize: "12px", fontWeight: "600" },
  matchBadge: {
    backgroundColor: "#eff6ff", color: "#2563eb", padding: "4px 10px",
    borderRadius: "999px", fontSize: "12px", fontWeight: "700", border: "1px solid #bfdbfe",
  },
  cardTitle2: { fontSize: "17px", color: "#1e293b", fontWeight: "700", marginBottom: "12px", lineHeight: "1.4" },
  matchBarBg: { width: "100%", height: "6px", backgroundColor: "#e2e8f0", borderRadius: "999px", overflow: "hidden", marginBottom: "14px" },
  matchBarFill: { height: "100%", background: "linear-gradient(90deg, #2563eb, #0ea5a4)", borderRadius: "999px" },
  cardFooter: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  providerBadge: { padding: "4px 10px", borderRadius: "999px", fontSize: "12px", fontWeight: "600" },
  linkButton: {
    display: "inline-block", padding: "8px 16px",
    background: "linear-gradient(135deg, #2563eb, #0ea5a4)",
    color: "#ffffff", textDecoration: "none", borderRadius: "8px", fontWeight: "600", fontSize: "13px",
  },
  pathContainer: { display: "flex", flexDirection: "column" },
  pathStep: { display: "flex", gap: "16px" },
  pathLeft: { display: "flex", flexDirection: "column", alignItems: "center" },
  stepCircle: {
    width: "36px", height: "36px", borderRadius: "50%",
    background: "linear-gradient(135deg, #2563eb, #0ea5a4)",
    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
  },
  stepNumber: { color: "#ffffff", fontWeight: "700", fontSize: "14px" },
  stepLine: { width: "2px", flex: 1, backgroundColor: "#e2e8f0", margin: "4px 0", minHeight: "20px" },
  stepCard: {
    flex: 1, backgroundColor: "#ffffff", border: "1px solid #e2e8f0",
    borderRadius: "12px", padding: "14px 18px", marginBottom: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
  },
  stepCardTop: { display: "flex", justifyContent: "space-between", marginBottom: "6px", gap: "8px" },
  stepTitle: { margin: 0, color: "#1e293b", fontSize: "16px", fontWeight: "600" },
  stepLevelBadge: { padding: "3px 10px", borderRadius: "999px", fontSize: "12px", fontWeight: "600", whiteSpace: "nowrap" },
  stepProvider: { color: "#64748b", fontSize: "13px", margin: 0 },
  retakeSection: {
    backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "16px",
    padding: "28px 32px", display: "flex", justifyContent: "space-between",
    alignItems: "center", boxShadow: "0 4px 12px rgba(0,0,0,0.05)", gap: "20px", marginBottom: "20px",
  },
  retakeLeft: { flex: 1 },
  retakeTitle: { fontSize: "20px", color: "#1e293b", fontWeight: "700", marginBottom: "6px" },
  retakeText: { color: "#64748b", fontSize: "15px", margin: 0 },
  retakeButton: {
    display: "inline-block", padding: "14px 28px", borderRadius: "10px",
    background: "linear-gradient(135deg, #2563eb, #0ea5a4)", color: "#ffffff",
    textDecoration: "none", fontSize: "15px", fontWeight: "700",
    boxShadow: "0 8px 20px rgba(37, 99, 235, 0.25)", whiteSpace: "nowrap",
  },
};

export default Recommendations;