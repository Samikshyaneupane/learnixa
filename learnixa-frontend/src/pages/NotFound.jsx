import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <p style={styles.code}>404</p>
        <h1 style={styles.title}>Page Not Found</h1>
        <p style={styles.subtitle}>
          The page you are looking for does not exist or has been moved.
        </p>
        <Link to="/" style={styles.button}>
          Go Back Home
        </Link>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#f0f4f8",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
  },
  card: {
    backgroundColor: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "20px",
    padding: "60px 40px",
    textAlign: "center",
    maxWidth: "500px",
    width: "100%",
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
  },
  code: {
    fontSize: "80px",
    fontWeight: "800",
    background: "linear-gradient(135deg, #2563eb, #0ea5a4)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    marginBottom: "10px",
  },
  title: {
    fontSize: "28px",
    color: "#1e293b",
    fontWeight: "700",
    marginBottom: "12px",
  },
  subtitle: {
    fontSize: "16px",
    color: "#64748b",
    marginBottom: "30px",
    lineHeight: "1.6",
  },
  button: {
    display: "inline-block",
    padding: "14px 28px",
    borderRadius: "10px",
    background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
    color: "#ffffff",
    textDecoration: "none",
    fontSize: "15px",
    fontWeight: "600",
    boxShadow: "0 8px 20px rgba(37, 99, 235, 0.3)",
  },
};

export default NotFound;