import { useState, useEffect } from "react";

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:5000/api/admin/stats", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Could not load dashboard data.");
        setLoading(false);
      });
  }, []);

  return (
    <div style={styles.page}>
      <div style={{
        ...styles.wrapper,
        padding: isMobile ? "24px 16px" : "40px 20px",
      }}>
        <p style={styles.tag}>Admin Panel</p>
        <h1 style={{
          ...styles.title,
          fontSize: isMobile ? "28px" : "40px",
        }}>
          Admin Dashboard
        </h1>

        {loading ? (
          <p style={styles.statusText}>Loading...</p>
        ) : error ? (
          <p style={styles.statusText}>{error}</p>
        ) : (
          <>
            {/* Stats Cards */}
            <div style={{
              ...styles.statsGrid,
              gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(3, 1fr)",
            }}>
              <div style={styles.statCard}>
                <p style={styles.statLabel}>Total Users</p>
                <h2 style={styles.statNumber}>{stats.totalUsers}</h2>
              </div>
              <div style={styles.statCard}>
                <p style={styles.statLabel}>Total Assessments</p>
                <h2 style={styles.statNumber}>{stats.totalAssessments}</h2>
              </div>
              <div style={{
                ...styles.statCard,
                gridColumn: isMobile ? "1 / -1" : "auto",
              }}>
                <p style={styles.statLabel}>Most Popular Goal</p>
                <h2 style={styles.statGoal}>{stats.mostPopularGoal}</h2>
              </div>
            </div>

            {/* Tabs */}
            <div style={styles.tabs}>
              {["overview", "users", "assessments"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    ...styles.tab,
                    ...(activeTab === tab ? styles.activeTab : {}),
                    fontSize: isMobile ? "13px" : "14px",
                    padding: isMobile ? "8px 14px" : "10px 20px",
                  }}
                >
                  {tab === "overview" && "Goals"}
                  {tab === "users" && `Users (${stats.users.length})`}
                  {tab === "assessments" && `Assessments (${stats.assessments.length})`}
                </button>
              ))}
            </div>

            {/* Goal Distribution */}
            {activeTab === "overview" && (
              <div style={styles.tableWrapper}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>Goal</th>
                      <th style={styles.th}>Count</th>
                      {!isMobile && <th style={styles.th}>Popularity</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {stats.goalDistribution.map((goal, index) => (
                      <tr key={index} style={styles.tr}>
                        <td style={styles.td}>{goal.selected_goal}</td>
                        <td style={styles.td}>{goal.count}</td>
                        {!isMobile && (
                          <td style={styles.td}>
                            <div style={styles.barBg}>
                              <div style={{
                                ...styles.barFill,
                                width: `${(goal.count / stats.totalAssessments) * 100}%`,
                              }} />
                            </div>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Users */}
            {activeTab === "users" && (
              <div style={styles.tableWrapper}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      {!isMobile && <th style={styles.th}>ID</th>}
                      <th style={styles.th}>Name</th>
                      {!isMobile && <th style={styles.th}>Email</th>}
                      <th style={styles.th}>Role</th>
                      <th style={styles.th}>Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.users.map((user, index) => (
                      <tr key={index} style={styles.tr}>
                        {!isMobile && <td style={styles.td}>{user.id}</td>}
                        <td style={styles.td}>{user.name}</td>
                        {!isMobile && <td style={styles.td}>{user.email}</td>}
                        <td style={styles.td}>
                          <span style={user.is_admin ? styles.adminBadge : styles.userBadge}>
                            {user.is_admin ? "Admin" : "User"}
                          </span>
                        </td>
                        <td style={styles.td}>
                          {new Date(user.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Assessments */}
            {activeTab === "assessments" && (
              <div style={styles.tableWrapper}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>User</th>
                      {!isMobile && <th style={styles.th}>Email</th>}
                      <th style={styles.th}>Goal</th>
                      <th style={styles.th}>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.assessments.map((item, index) => (
                      <tr key={index} style={styles.tr}>
                        <td style={styles.td}>{item.name}</td>
                        {!isMobile && <td style={styles.td}>{item.email}</td>}
                        <td style={styles.td}>{item.selected_goal}</td>
                        <td style={styles.td}>
                          {new Date(item.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#f0f4f8",
  },
  wrapper: {
    maxWidth: "1200px",
    margin: "0 auto",
  },
  tag: {
    display: "inline-block",
    padding: "8px 16px",
    borderRadius: "999px",
    backgroundColor: "#eff6ff",
    color: "#2563eb",
    fontSize: "14px",
    fontWeight: "600",
    marginBottom: "12px",
    border: "1px solid #bfdbfe",
  },
  title: {
    color: "#1e293b",
    marginBottom: "30px",
    fontWeight: "700",
  },
  statusText: {
    color: "#64748b",
    fontSize: "18px",
    textAlign: "center",
  },
  statsGrid: {
    display: "grid",
    gap: "16px",
    marginBottom: "28px",
  },
  statCard: {
    backgroundColor: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "16px",
    padding: "24px",
    textAlign: "center",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  },
  statLabel: {
    color: "#64748b",
    fontSize: "14px",
    marginBottom: "10px",
    fontWeight: "500",
  },
  statNumber: {
    fontSize: "42px",
    fontWeight: "800",
    background: "linear-gradient(135deg, #2563eb, #0ea5a4)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  statGoal: {
    fontSize: "16px",
    fontWeight: "700",
    color: "#0ea5a4",
    marginTop: "8px",
  },
  tabs: {
    display: "flex",
    gap: "8px",
    marginBottom: "20px",
    flexWrap: "wrap",
  },
  tab: {
    borderRadius: "8px",
    border: "1px solid #e2e8f0",
    backgroundColor: "#ffffff",
    color: "#64748b",
    cursor: "pointer",
    fontWeight: "600",
  },
  activeTab: {
    background: "linear-gradient(135deg, #2563eb, #0ea5a4)",
    color: "#ffffff",
    border: "none",
  },
  tableWrapper: {
    backgroundColor: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "16px",
    overflow: "auto",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    padding: "12px 16px",
    textAlign: "left",
    color: "#2563eb",
    fontSize: "13px",
    fontWeight: "600",
    borderBottom: "1px solid #e2e8f0",
    backgroundColor: "#f8fafc",
    whiteSpace: "nowrap",
  },
  tr: {
    borderBottom: "1px solid #f1f5f9",
  },
  td: {
    padding: "12px 16px",
    color: "#1e293b",
    fontSize: "14px",
  },
  adminBadge: {
    backgroundColor: "#eff6ff",
    color: "#2563eb",
    padding: "3px 8px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "600",
    border: "1px solid #bfdbfe",
  },
  userBadge: {
    backgroundColor: "#f0fdf4",
    color: "#16a34a",
    padding: "3px 8px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "600",
    border: "1px solid #bbf7d0",
  },
  barBg: {
    width: "120px",
    height: "8px",
    backgroundColor: "#e2e8f0",
    borderRadius: "999px",
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    background: "linear-gradient(90deg, #2563eb, #0ea5a4)",
    borderRadius: "999px",
  },
};

export default AdminDashboard;