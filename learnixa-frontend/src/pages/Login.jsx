import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const successMessage = location.state?.message || "";

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    setError("");

    if (!formData.email || !formData.password) {
      return setError("All fields are required.");
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed.");
      } else {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        navigate("/goal-selection");
      }
    } catch (err) {
      setError("Could not connect to server.");
    }

    setLoading(false);
  };

  return (
    <div style={styles.page}>
      {/* Left Panel */}
      <div style={styles.leftPanel}>
        <div style={styles.leftContent}>
          <h2 style={styles.leftTitle}>
            Learn Smarter with{" "}
            <span style={styles.leftHighlight}>Learnixa</span>
          </h2>

          <p style={styles.leftSubtitle}>
            AI-powered course recommendations tailored to your skills and
            career goals.
          </p>

          <div style={styles.featureList}>
            {[
              { icon: "🎯", text: "10 IT career paths to choose from" },
              { icon: "🤖", text: "AI-powered skill assessment" },
              { icon: "📚", text: "Personalized course recommendations" },
              { icon: "🚀", text: "Structured learning path" },
            ].map((f, i) => (
              <div key={i} style={styles.featureItem}>
                <span style={styles.featureIcon}>{f.icon}</span>
                <span style={styles.featureText}>{f.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div style={styles.rightPanel}>
        <div style={styles.card}>
          <p style={styles.tag}>👋 Welcome Back</p>

          <h1 style={styles.title}>Login to Learnixa</h1>

          <p style={styles.subtitle}>
            Continue your personalized learning journey.
          </p>

          {successMessage && (
            <p style={styles.success}>{successMessage}</p>
          )}

          {error && <p style={styles.error}>⚠️ {error}</p>}

          <div style={styles.inputGroup}>
            <div style={styles.inputWrapper}>
              <span style={styles.inputIcon}>📧</span>

              <input
                style={styles.input}
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div style={styles.inputWrapper}>
              <span style={styles.inputIcon}>🔒</span>

              <input
                style={styles.input}
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <button
            style={{
              ...styles.button,
              opacity: loading ? 0.8 : 1,
            }}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login →"}
          </button>

          <p style={styles.bottomText}>
            Don't have an account?{" "}
            <Link to="/register" style={styles.link}>
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    backgroundColor: "#f0f4f8",
  },

  leftPanel: {
    flex: 1,
    background: "linear-gradient(135deg, #1e293b, #2563eb)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "60px 50px",
    "@media (max-width: 768px)": {
      display: "none",
    },
  },

  leftContent: {
    maxWidth: "420px",
  },

  leftTitle: {
    fontSize: "40px",
    fontWeight: "800",
    color: "#ffffff",
    lineHeight: "1.2",
    marginBottom: "16px",
  },

  leftHighlight: {
    background: "linear-gradient(135deg, #0ea5a4, #38bdf8)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },

  leftSubtitle: {
    fontSize: "16px",
    color: "#94a3b8",
    lineHeight: "1.7",
    marginBottom: "40px",
  },

  featureList: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },

  featureItem: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    backgroundColor: "rgba(255,255,255,0.07)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "12px",
    padding: "14px 18px",
  },

  featureIcon: {
    fontSize: "22px",
    flexShrink: 0,
  },

  featureText: {
    color: "#e2e8f0",
    fontSize: "15px",
    fontWeight: "500",
  },

  rightPanel: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 24px",
    backgroundColor: "#f0f4f8",
  },

  card: {
    width: "100%",
    maxWidth: "440px",
    backgroundColor: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "20px",
    padding: "40px 36px",
    textAlign: "center",
    boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
  },

  tag: {
    display: "inline-block",
    padding: "8px 16px",
    borderRadius: "999px",
    backgroundColor: "#eff6ff",
    color: "#2563eb",
    fontSize: "14px",
    fontWeight: "600",
    marginBottom: "16px",
    border: "1px solid #bfdbfe",
  },

  title: {
    fontSize: "28px",
    marginBottom: "8px",
    color: "#1e293b",
    fontWeight: "700",
  },

  subtitle: {
    fontSize: "15px",
    color: "#64748b",
    marginBottom: "28px",
  },

  success: {
    backgroundColor: "#f0fdf4",
    border: "1px solid #bbf7d0",
    color: "#16a34a",
    padding: "10px 14px",
    borderRadius: "8px",
    marginBottom: "16px",
    fontSize: "14px",
  },

  error: {
    backgroundColor: "#fef2f2",
    border: "1px solid #fecaca",
    color: "#dc2626",
    padding: "10px 14px",
    borderRadius: "8px",
    marginBottom: "16px",
    fontSize: "14px",
    textAlign: "left",
  },

  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
    marginBottom: "22px",
  },

  inputWrapper: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: "10px",
    padding: "0 14px",
    gap: "10px",
  },

  inputIcon: {
    fontSize: "16px",
    flexShrink: 0,
  },

  input: {
    flex: 1,
    padding: "14px 0",
    border: "none",
    backgroundColor: "transparent",
    color: "#1e293b",
    fontSize: "15px",
    outline: "none",
  },

  button: {
    width: "100%",
    padding: "14px",
    borderRadius: "10px",
    border: "none",
    background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
    color: "#ffffff",
    fontSize: "16px",
    fontWeight: "700",
    cursor: "pointer",
    boxShadow: "0 8px 20px rgba(37, 99, 235, 0.3)",
    marginBottom: "20px",
  },

  bottomText: {
    color: "#64748b",
    fontSize: "15px",
  },

  link: {
    color: "#2563eb",
    textDecoration: "none",
    fontWeight: "600",
  },
};

export default Login;