import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AVATAR_COLORS = [
  { label: "Blue", value: "linear-gradient(135deg, #2563eb, #0ea5a4)" },
  { label: "Purple", value: "linear-gradient(135deg, #7c3aed, #db2777)" },
  { label: "Green", value: "linear-gradient(135deg, #16a34a, #0ea5a4)" },
  { label: "Orange", value: "linear-gradient(135deg, #d97706, #dc2626)" },
  { label: "Pink", value: "linear-gradient(135deg, #db2777, #7c3aed)" },
  { label: "Teal", value: "linear-gradient(135deg, #0891b2, #16a34a)" },
];

function Profile() {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const [name, setName] = useState(user?.name || "");
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [avatarColor, setAvatarColor] = useState(
    localStorage.getItem("avatarColor") || AVATAR_COLORS[0].value
  );

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleColorChange = (color) => {
    setAvatarColor(color);
    localStorage.setItem("avatarColor", color);
    setMessage("Avatar color updated!");
    setTimeout(() => setMessage(""), 2000);
  };

  const handleSaveName = async () => {
    setMessage("");
    setError("");

    if (!name.trim()) {
      setError("Name cannot be empty.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/auth/update/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Update failed.");
      } else {
        const updatedUser = { ...user, name: data.name };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setMessage("Name updated successfully!");
      }
    } catch (err) {
      setError("Could not connect to server.");
    }
    setLoading(false);
  };

  const handleChangePassword = async () => {
    setMessage("");
    setError("");

    if (!currentPassword) {
      setError("Please enter your current password.");
      return;
    }
    if (!newPassword) {
      setError("Please enter a new password.");
      return;
    }
    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/auth/update/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, currentPassword, newPassword }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Update failed.");
      } else {
        setMessage("Password changed successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setShowPasswordForm(false);
      }
    } catch (err) {
      setError("Could not connect to server.");
    }
    setLoading(false);
  };

  return (
    <div style={styles.page}>
      <div style={{
        ...styles.wrapper,
        padding: isMobile ? "24px 16px" : "40px 20px",
      }}>
        <p style={styles.tag}>Account</p>
        <h1 style={{ ...styles.title, fontSize: isMobile ? "28px" : "40px" }}>
          My Profile
        </h1>
        <p style={styles.subtitle}>Manage your account settings and preferences.</p>

        {/* Account Info Card */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>👤 Account Info</h2>

          <div style={{
            ...styles.avatarSection,
            flexDirection: isMobile ? "column" : "row",
            alignItems: isMobile ? "center" : "flex-start",
            textAlign: isMobile ? "center" : "left",
          }}>
            <div style={{ ...styles.avatar, background: avatarColor }}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p style={styles.avatarName}>{user?.name}</p>
              <p style={styles.avatarEmail}>{user?.email}</p>
              <div style={styles.infoBadgeRow}>
                <span style={styles.infoBadge}>🆔 User ID: {user?.id}</span>
                <span style={styles.infoBadge}>
                  {user?.is_admin === 1 ? "👑 Admin" : "🎓 Learner"}
                </span>
              </div>
            </div>
          </div>

          <hr style={styles.divider} />

          <p style={styles.sectionLabel}>Avatar Color</p>
          <p style={styles.sectionHint}>Pick a color for your initials avatar.</p>
          <div style={styles.colorRow}>
            {AVATAR_COLORS.map((c) => (
              <div
                key={c.value}
                onClick={() => handleColorChange(c.value)}
                style={{
                  ...styles.colorSwatch,
                  background: c.value,
                  transform: avatarColor === c.value ? "scale(1.2)" : "scale(1)",
                  border: avatarColor === c.value ? "3px solid #1e293b" : "3px solid transparent",
                }}
                title={c.label}
              />
            ))}
          </div>
        </div>

        {/* Edit Name Card */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>✏️ Edit Name</h2>

          <div style={styles.field}>
            <label style={styles.label}>Full Name</label>
            <input
              style={styles.input}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
            />
          </div>

          {error && !showPasswordForm && <p style={styles.errorMsg}>⚠️ {error}</p>}
          {message && !showPasswordForm && <p style={styles.successMsg}>✅ {message}</p>}

          <div style={{
            ...styles.buttonRow,
            flexDirection: isMobile ? "column" : "row",
          }}>
            <button
              onClick={() => navigate("/dashboard")}
              style={styles.cancelButton}
            >
              ← Back to Dashboard
            </button>
            <button
              onClick={handleSaveName}
              style={styles.saveButton}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Name"}
            </button>
          </div>
        </div>

        {/* Change Password Card */}
        <div style={styles.card}>
          <div style={styles.passwordHeader}>
            <div>
              <h2 style={styles.cardTitle}>🔒 Password</h2>
              <p style={styles.sectionHint}>
                {showPasswordForm ? "Fill in the fields below to change your password." : "Keep your account secure with a strong password."}
              </p>
            </div>
            {!showPasswordForm && (
              <button
                onClick={() => {
                  setShowPasswordForm(true);
                  setError("");
                  setMessage("");
                }}
                style={styles.changePasswordButton}
              >
                Change Password
              </button>
            )}
          </div>

          {showPasswordForm && (
            <>
              <div style={styles.field}>
                <label style={styles.label}>Current Password</label>
                <input
                  style={styles.input}
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>New Password</label>
                <input
                  style={styles.input}
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Confirm New Password</label>
                <input
                  style={styles.input}
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                />
              </div>

              {error && <p style={styles.errorMsg}>⚠️ {error}</p>}
              {message && <p style={styles.successMsg}>✅ {message}</p>}

              <div style={{
                ...styles.buttonRow,
                flexDirection: isMobile ? "column" : "row",
              }}>
                <button
                  onClick={() => {
                    setShowPasswordForm(false);
                    setCurrentPassword("");
                    setNewPassword("");
                    setConfirmPassword("");
                    setError("");
                    setMessage("");
                  }}
                  style={styles.cancelButton}
                >
                  Cancel
                </button>
                <button
                  onClick={handleChangePassword}
                  style={styles.saveButton}
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Update Password"}
                </button>
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", backgroundColor: "#f0f4f8" },
  wrapper: { maxWidth: "600px", margin: "0 auto" },
  tag: {
    display: "inline-block", padding: "8px 16px", borderRadius: "999px",
    backgroundColor: "#eff6ff", color: "#2563eb", fontSize: "14px",
    fontWeight: "600", marginBottom: "12px", border: "1px solid #bfdbfe",
  },
  title: { color: "#1e293b", marginBottom: "8px", fontWeight: "700" },
  subtitle: { fontSize: "16px", color: "#64748b", marginBottom: "28px" },
  card: {
    backgroundColor: "#ffffff", border: "1px solid #e2e8f0",
    borderRadius: "16px", padding: "28px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)", marginBottom: "24px",
  },
  cardTitle: { fontSize: "18px", fontWeight: "700", color: "#1e293b", marginBottom: "4px" },
  avatarSection: { display: "flex", gap: "20px", marginBottom: "8px" },
  avatar: {
    width: "72px", height: "72px", borderRadius: "50%",
    color: "#ffffff", fontSize: "28px", fontWeight: "700",
    display: "flex", alignItems: "center", justifyContent: "center",
    flexShrink: 0, boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
  },
  avatarName: { fontSize: "20px", fontWeight: "700", color: "#1e293b", marginBottom: "4px" },
  avatarEmail: { fontSize: "14px", color: "#64748b", marginBottom: "10px" },
  infoBadgeRow: { display: "flex", gap: "8px", flexWrap: "wrap" },
  infoBadge: {
    backgroundColor: "#f1f5f9", border: "1px solid #e2e8f0",
    borderRadius: "999px", padding: "4px 12px",
    fontSize: "12px", color: "#475569", fontWeight: "600",
  },
  colorRow: { display: "flex", gap: "12px", flexWrap: "wrap", marginTop: "8px" },
  colorSwatch: {
    width: "36px", height: "36px", borderRadius: "50%",
    cursor: "pointer", transition: "transform 0.2s ease, border 0.2s ease",
  },
  divider: { border: "none", borderTop: "1px solid #f1f5f9", margin: "20px 0" },
  field: { marginBottom: "16px" },
  label: {
    display: "block", fontSize: "14px", fontWeight: "600",
    color: "#475569", marginBottom: "8px",
  },
  input: {
    width: "100%", padding: "12px 14px", borderRadius: "10px",
    border: "1px solid #e2e8f0", fontSize: "15px", color: "#1e293b",
    backgroundColor: "#f8fafc", boxSizing: "border-box", outline: "none",
  },
  sectionLabel: { fontSize: "16px", fontWeight: "700", color: "#1e293b", marginBottom: "4px" },
  sectionHint: { fontSize: "13px", color: "#94a3b8", marginBottom: "16px" },
  passwordHeader: {
    display: "flex", justifyContent: "space-between",
    alignItems: "flex-start", marginBottom: "8px",
  },
  changePasswordButton: {
    padding: "10px 18px", borderRadius: "10px", border: "none",
    background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
    color: "#ffffff", fontSize: "14px", fontWeight: "600",
    cursor: "pointer", boxShadow: "0 4px 12px rgba(37, 99, 235, 0.25)",
    whiteSpace: "nowrap",
  },
  errorMsg: {
    backgroundColor: "#fef2f2", border: "1px solid #fecaca",
    color: "#dc2626", borderRadius: "10px", padding: "12px 16px",
    fontSize: "14px", marginBottom: "16px",
  },
  successMsg: {
    backgroundColor: "#f0fdf4", border: "1px solid #bbf7d0",
    color: "#16a34a", borderRadius: "10px", padding: "12px 16px",
    fontSize: "14px", marginBottom: "16px",
  },
  buttonRow: {
    display: "flex", justifyContent: "space-between",
    alignItems: "center", gap: "12px", marginTop: "8px",
  },
  cancelButton: {
    padding: "12px 20px", borderRadius: "10px",
    border: "1px solid #e2e8f0", backgroundColor: "#ffffff",
    color: "#64748b", fontSize: "14px", fontWeight: "600", cursor: "pointer",
  },
  saveButton: {
    padding: "12px 28px", borderRadius: "10px", border: "none",
    background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
    color: "#ffffff", fontSize: "15px", fontWeight: "700",
    cursor: "pointer", boxShadow: "0 6px 16px rgba(37, 99, 235, 0.3)",
  },
};

export default Profile;