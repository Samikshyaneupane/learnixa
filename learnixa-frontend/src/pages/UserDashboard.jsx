import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function UserDashboard() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [tooltip, setTooltip] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`http://localhost:5000/api/assessment/history/${user.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setHistory(data.history || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const skillColors = [
    "#2563eb", "#0ea5a4", "#16a34a", "#d97706", "#dc2626",
    "#7c3aed", "#db2777", "#0891b2",
  ];

  const chartData = [...history].reverse().map((item, index) => {
    const avg = item.scores.length
      ? Math.round(item.scores.reduce((a, b) => a + b.score, 0) / item.scores.length)
      : 0;
    return {
      label: `#${index + 1}`,
      goal: item.selected_goal,
      avg,
      date: new Date(item.created_at).toLocaleDateString(),
      skills: item.scores,
    };
  });

  const chartHeight = 200;
  const groupWidth = isMobile ? 60 : 90;
  const groupGap = isMobile ? 20 : 30;
  const leftPad = 44;
  const svgWidth = leftPad + chartData.length * (groupWidth + groupGap) + 20;

  return (
    <div style={styles.page}>
      <div style={{
        ...styles.wrapper,
        padding: isMobile ? "24px 16px" : "40px 20px",
      }}>
        <p style={styles.tag}>My Learning</p>
        <h1 style={{ ...styles.title, fontSize: isMobile ? "28px" : "40px" }}>
          My Dashboard
        </h1>
        <p style={styles.subtitle}>
          Welcome back, <strong>{user?.name}</strong>. Here is your learning history.
        </p>

        <Link to="/goal-selection" style={{
          ...styles.newButton,
          display: isMobile ? "block" : "inline-block",
          textAlign: isMobile ? "center" : "left",
        }}>
          + Start New Assessment
        </Link>

        {/* Chart */}
        {!loading && history.length > 0 && (
          <div style={styles.chartCard}>
            <h2 style={styles.chartTitle}>📊 Score History</h2>
            <p style={styles.chartSubtitle}>
              Each bar group shows individual skill scores per attempt — hover for details
            </p>

            <div style={{ overflowX: "auto", position: "relative" }}>
              <svg
                width={Math.max(svgWidth, 300)}
                height={chartHeight + 80}
                style={{ display: "block" }}
              >
                {/* Y axis grid lines */}
                {[0, 25, 50, 75, 100].map((val) => {
                  const y = 10 + ((100 - val) / 100) * chartHeight;
                  return (
                    <g key={val}>
                      <line
                        x1={leftPad} y1={y}
                        x2={svgWidth - 10} y2={y}
                        stroke="#e2e8f0" strokeWidth="1"
                      />
                      <text
                        x={leftPad - 6} y={y + 4}
                        textAnchor="end" fontSize="11" fill="#94a3b8"
                      >
                        {val}%
                      </text>
                    </g>
                  );
                })}

                {/* Average score line */}
                {chartData.length > 1 && (
                  <polyline
                    points={chartData.map((d, i) => {
                      const cx = leftPad + i * (groupWidth + groupGap) + groupWidth / 2;
                      const cy = 10 + ((100 - d.avg) / 100) * chartHeight;
                      return `${cx},${cy}`;
                    }).join(" ")}
                    fill="none"
                    stroke="#2563eb"
                    strokeWidth="2"
                    strokeDasharray="5,3"
                    opacity="0.5"
                  />
                )}

                {/* Bar groups */}
                {chartData.map((d, i) => {
                  const groupX = leftPad + i * (groupWidth + groupGap);
                  const skillCount = d.skills.length;
                  const barW = Math.max(6, (groupWidth - (skillCount - 1) * 3) / skillCount);

                  return (
                    <g key={i}>
                      {/* Skill bars */}
                      {d.skills.map((s, si) => {
                        const barH = (s.score / 100) * chartHeight;
                        const x = groupX + si * (barW + 3);
                        const y = 10 + chartHeight - barH;
                        const color = skillColors[si % skillColors.length];

                        return (
                          <rect
                            key={si}
                            x={x} y={y}
                            width={barW} height={barH}
                            rx="3" ry="3"
                            fill={color}
                            opacity="0.8"
                            style={{ cursor: "pointer" }}
                            onMouseEnter={(e) => {
                              setTooltip({
                                x: e.clientX,
                                y: e.clientY,
                                data: d,
                              });
                            }}
                            onMouseLeave={() => setTooltip(null)}
                          />
                        );
                      })}

                      {/* Avg score dot */}
                      <circle
                        cx={groupX + groupWidth / 2}
                        cy={10 + ((100 - d.avg) / 100) * chartHeight}
                        r="4"
                        fill="#2563eb"
                        stroke="#fff"
                        strokeWidth="1.5"
                      />

                      {/* Attempt label */}
                      <text
                        x={groupX + groupWidth / 2}
                        y={chartHeight + 28}
                        textAnchor="middle"
                        fontSize="12"
                        fontWeight="700"
                        fill="#475569"
                      >
                        {d.label}
                      </text>

                      {/* Date */}
                      <text
                        x={groupX + groupWidth / 2}
                        y={chartHeight + 44}
                        textAnchor="middle"
                        fontSize="9"
                        fill="#94a3b8"
                      >
                        {d.date}
                      </text>

                      {/* Avg label */}
                      <text
                        x={groupX + groupWidth / 2}
                        y={chartHeight + 58}
                        textAnchor="middle"
                        fontSize="10"
                        fontWeight="600"
                        fill="#2563eb"
                      >
                        avg {d.avg}%
                      </text>
                    </g>
                  );
                })}
              </svg>

              {/* Tooltip */}
              {tooltip && (
                <div style={{
                  position: "fixed",
                  top: tooltip.y + 12,
                  left: tooltip.x + 12,
                  backgroundColor: "#1e293b",
                  color: "#ffffff",
                  borderRadius: "12px",
                  padding: "12px 16px",
                  fontSize: "13px",
                  zIndex: 9999,
                  pointerEvents: "none",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
                  minWidth: "180px",
                }}>
                  <p style={{ fontWeight: "700", marginBottom: "6px", color: "#93c5fd" }}>
                    {tooltip.data.goal}
                  </p>
                  <p style={{ color: "#94a3b8", fontSize: "11px", marginBottom: "10px" }}>
                    {tooltip.data.date}
                  </p>
                  {tooltip.data.skills.map((s, i) => (
                    <div key={i} style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: "16px",
                      marginBottom: "4px",
                    }}>
                      <span style={{ color: skillColors[i % skillColors.length] }}>
                        ● {s.skill}
                      </span>
                      <span style={{ fontWeight: "700" }}>{s.score}%</span>
                    </div>
                  ))}
                  <div style={{
                    borderTop: "1px solid #334155",
                    marginTop: "8px",
                    paddingTop: "8px",
                    display: "flex",
                    justifyContent: "space-between",
                  }}>
                    <span style={{ color: "#94a3b8" }}>Average</span>
                    <span style={{ fontWeight: "700", color: "#2563eb" }}>
                      {tooltip.data.avg}%
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Skill color legend — from first attempt */}
            {chartData.length > 0 && (
              <div style={styles.legend}>
                {chartData[0].skills.map((s, i) => (
                  <div key={i} style={styles.legendItem}>
                    <span style={{
                      ...styles.legendDot,
                      backgroundColor: skillColors[i % skillColors.length],
                    }} />
                    <span style={styles.legendText}>{s.skill}</span>
                  </div>
                ))}
                <div style={styles.legendItem}>
                  <span style={{
                    width: "20px", height: "2px", backgroundColor: "#2563eb",
                    display: "inline-block", opacity: 0.5,
                  }} />
                  <span style={styles.legendText}>Avg trend</span>
                </div>
              </div>
            )}
          </div>
        )}

        <h2 style={{ ...styles.sectionTitle, fontSize: isMobile ? "18px" : "22px" }}>
          Assessment History
        </h2>

        {loading ? (
          <p style={styles.statusText}>Loading...</p>
        ) : history.length === 0 ? (
          <div style={styles.emptyBox}>
            <p style={styles.emptyIcon}>📝</p>
            <p style={styles.emptyText}>No assessments taken yet.</p>
            <Link to="/goal-selection" style={styles.startButton}>
              Take Your First Assessment
            </Link>
          </div>
        ) : (
          <div style={styles.historyList}>
            {history.map((item, index) => (
              <div key={index} style={styles.historyCard}>
                <div style={{
                  ...styles.historyHeader,
                  flexDirection: isMobile ? "column" : "row",
                  alignItems: isMobile ? "flex-start" : "center",
                  gap: isMobile ? "8px" : "0",
                }}>
                  <div>
                    <h3 style={{ ...styles.goalTitle, fontSize: isMobile ? "16px" : "20px" }}>
                      {item.selected_goal}
                    </h3>
                    <p style={styles.effectiveGoal}>Assessment Type: {item.effective_goal}</p>
                  </div>
                  <span style={styles.date}>
                    {new Date(item.created_at).toLocaleDateString()}
                  </span>
                </div>

                <div style={styles.scoresGrid}>
                  {item.scores.map((score, i) => (
                    <div key={i} style={styles.scoreItem}>
                      <div style={styles.scoreHeader}>
                        <span style={styles.scoreSkill}>{score.skill}</span>
                        <span style={styles.scoreValue}>{score.score}%</span>
                      </div>
                      <div style={styles.scoreBarBg}>
                        <div style={{ ...styles.scoreBarFill, width: `${score.score}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", backgroundColor: "#f0f4f8" },
  wrapper: { maxWidth: "900px", margin: "0 auto" },
  tag: {
    display: "inline-block", padding: "8px 16px", borderRadius: "999px",
    backgroundColor: "#eff6ff", color: "#2563eb", fontSize: "14px",
    fontWeight: "600", marginBottom: "12px", border: "1px solid #bfdbfe",
  },
  title: { color: "#1e293b", marginBottom: "8px", fontWeight: "700" },
  subtitle: { fontSize: "16px", color: "#64748b", marginBottom: "24px" },
  newButton: {
    padding: "12px 22px", borderRadius: "10px",
    background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
    color: "#ffffff", textDecoration: "none", fontSize: "15px",
    fontWeight: "600", marginBottom: "36px",
    boxShadow: "0 6px 16px rgba(37, 99, 235, 0.3)",
  },
  chartCard: {
    backgroundColor: "#ffffff", border: "1px solid #e2e8f0",
    borderRadius: "16px", padding: "24px", marginBottom: "32px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  },
  chartTitle: { fontSize: "18px", color: "#1e293b", fontWeight: "700", marginBottom: "4px" },
  chartSubtitle: { fontSize: "13px", color: "#64748b", marginBottom: "20px" },
  legend: { display: "flex", flexWrap: "wrap", gap: "12px", marginTop: "16px" },
  legendItem: { display: "flex", alignItems: "center", gap: "6px" },
  legendDot: { width: "10px", height: "10px", borderRadius: "50%", display: "inline-block" },
  legendText: { fontSize: "12px", color: "#64748b" },
  sectionTitle: { color: "#1e293b", marginBottom: "20px", fontWeight: "600" },
  statusText: { color: "#64748b", fontSize: "18px", textAlign: "center", padding: "40px" },
  emptyBox: {
    backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "16px",
    padding: "50px 30px", textAlign: "center", boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  },
  emptyIcon: { fontSize: "48px", marginBottom: "16px" },
  emptyText: { color: "#64748b", fontSize: "18px", marginBottom: "24px" },
  startButton: {
    display: "inline-block", padding: "12px 24px", borderRadius: "10px",
    background: "linear-gradient(135deg, #2563eb, #1d4ed8)", color: "#ffffff",
    textDecoration: "none", fontSize: "15px", fontWeight: "600",
    boxShadow: "0 6px 16px rgba(37, 99, 235, 0.3)",
  },
  historyList: { display: "flex", flexDirection: "column", gap: "20px" },
  historyCard: {
    backgroundColor: "#ffffff", border: "1px solid #e2e8f0",
    borderRadius: "16px", padding: "20px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  },
  historyHeader: { display: "flex", justifyContent: "space-between", marginBottom: "20px" },
  goalTitle: { color: "#1e293b", fontWeight: "600", marginBottom: "4px" },
  effectiveGoal: { color: "#64748b", fontSize: "14px" },
  date: { color: "#94a3b8", fontSize: "14px", flexShrink: 0 },
  scoresGrid: { display: "flex", flexDirection: "column", gap: "12px" },
  scoreItem: { display: "flex", flexDirection: "column", gap: "6px" },
  scoreHeader: { display: "flex", justifyContent: "space-between" },
  scoreSkill: { color: "#64748b", fontSize: "14px", fontWeight: "500" },
  scoreValue: { color: "#2563eb", fontSize: "14px", fontWeight: "600" },
  scoreBarBg: {
    width: "100%", height: "8px", backgroundColor: "#e2e8f0",
    borderRadius: "999px", overflow: "hidden",
  },
  scoreBarFill: {
    height: "100%", background: "linear-gradient(90deg, #2563eb, #0ea5a4)",
    borderRadius: "999px",
  },
};

export default UserDashboard;