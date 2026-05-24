import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setUser(null);
    }

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) setMenuOpen(false);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setMenuOpen(false);
    navigate("/login");
  };

  return (
    <nav style={styles.navbar}>
      {/* Logo + Hamburger Row */}
      <div style={styles.navTop}>
        <Link to="/" style={styles.logo}>
          Learnixa
        </Link>

        {isMobile && (
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={styles.hamburger}
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        )}

        {/* Desktop Links */}
        {!isMobile && (
          <div style={styles.links}>
            {user ? (
              <>
                <span style={styles.welcome}>Hi, {user.name}</span>
                <Link to="/goal-selection" style={styles.link}>
                  Goals
                </Link>
                {user.is_admin === 1 ? (
                  <Link to="/admin" style={styles.link}>
                    Admin Panel
                  </Link>
                ) : (
                  <Link to="/dashboard" style={styles.link}>
                    Dashboard
                  </Link>
                )}
                <Link to="/profile" style={styles.link}>
                  Profile
                </Link>
                <button onClick={handleLogout} style={styles.logoutButton}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" style={styles.link}>
                  Login
                </Link>
                <Link to="/register" style={styles.registerButton}>
                  Get Started
                </Link>
              </>
            )}
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      {isMobile && menuOpen && (
        <div style={styles.mobileMenu}>
          {user ? (
            <>
              <p style={styles.mobileWelcome}>Hi, {user.name} 👋</p>
              <Link
                to="/goal-selection"
                style={styles.mobileLink}
                onClick={() => setMenuOpen(false)}
              >
                Goals
              </Link>
              {user.is_admin === 1 ? (
                <Link
                  to="/admin"
                  style={styles.mobileLink}
                  onClick={() => setMenuOpen(false)}
                >
                  Admin Panel
                </Link>
              ) : (
                <Link
                  to="/dashboard"
                  style={styles.mobileLink}
                  onClick={() => setMenuOpen(false)}
                >
                  Dashboard
                </Link>
              )}
              <Link
                to="/profile"
                style={styles.mobileLink}
                onClick={() => setMenuOpen(false)}
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                style={styles.mobileLogoutButton}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                style={styles.mobileLink}
                onClick={() => setMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/register"
                style={styles.mobileRegisterButton}
                onClick={() => setMenuOpen(false)}
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

const styles = {
  navbar: {
    width: "100%",
    backgroundColor: "#ffffff",
    borderBottom: "1px solid #e2e8f0",
    position: "sticky",
    top: 0,
    zIndex: 100,
    boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
    boxSizing: "border-box",
  },
  navTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 24px",
  },
  logo: {
    fontSize: "24px",
    fontWeight: "800",
    textDecoration: "none",
    background: "linear-gradient(135deg, #2563eb, #0ea5a4)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  hamburger: {
    backgroundColor: "transparent",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    padding: "8px 12px",
    fontSize: "18px",
    cursor: "pointer",
    color: "#1e293b",
  },
  links: {
    display: "flex",
    alignItems: "center",
    gap: "24px",
  },
  welcome: {
    color: "#64748b",
    fontSize: "15px",
  },
  link: {
    color: "#1e293b",
    textDecoration: "none",
    fontSize: "15px",
    fontWeight: "500",
  },
  logoutButton: {
    backgroundColor: "transparent",
    border: "1px solid #e2e8f0",
    color: "#64748b",
    padding: "8px 16px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
  },
  registerButton: {
    background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
    color: "#ffffff",
    padding: "8px 18px",
    borderRadius: "8px",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: "600",
    boxShadow: "0 4px 12px rgba(37, 99, 235, 0.3)",
  },
  mobileMenu: {
    display: "flex",
    flexDirection: "column",
    padding: "16px 24px 20px",
    borderTop: "1px solid #e2e8f0",
    gap: "12px",
    backgroundColor: "#ffffff",
  },
  mobileWelcome: {
    color: "#64748b",
    fontSize: "15px",
    fontWeight: "500",
    marginBottom: "4px",
  },
  mobileLink: {
    color: "#1e293b",
    textDecoration: "none",
    fontSize: "16px",
    fontWeight: "500",
    padding: "10px 0",
    borderBottom: "1px solid #f1f5f9",
  },
  mobileLogoutButton: {
    backgroundColor: "transparent",
    border: "1px solid #e2e8f0",
    color: "#64748b",
    padding: "12px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: "600",
    marginTop: "4px",
  },
  mobileRegisterButton: {
    background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
    color: "#ffffff",
    padding: "12px",
    borderRadius: "8px",
    textDecoration: "none",
    fontSize: "15px",
    fontWeight: "600",
    textAlign: "center",
    boxShadow: "0 4px 12px rgba(37, 99, 235, 0.3)",
  },
};

export default Navbar;  