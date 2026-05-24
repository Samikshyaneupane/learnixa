import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

function Home() {
  const [user, setUser] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));

    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div style={styles.page}>

      {/* Hero Section */}
      <div style={{
        ...styles.hero,
        flexDirection: isMobile ? "column" : "row",
        padding: isMobile ? "50px 24px" : "80px 60px",
        minHeight: isMobile ? "auto" : "90vh",
        textAlign: isMobile ? "center" : "left",
      }}>
        {/* Background blobs */}
        <div style={styles.blob1} />
        <div style={styles.blob2} />

        <div style={{ ...styles.heroContent, alignItems: isMobile ? "center" : "flex-start" }}>
          <p style={styles.tag}>✨ AI-Powered Learning</p>
          <h1 style={{ ...styles.title, fontSize: isMobile ? "38px" : "64px" }}>
            Learn Smarter with{" "}
            <span style={styles.highlight}>Learnixa</span>
          </h1>
          <p style={{ ...styles.subtitle, fontSize: isMobile ? "16px" : "20px" }}>
            Select your career goal, take a skill assessment, and get
            personalized IT course recommendations powered by AI.
          </p>

          {/* Stats row */}
          <div style={{
            ...styles.statsRow,
            justifyContent: isMobile ? "center" : "flex-start",
          }}>
            {[
              { value: "10+", label: "Career Paths" },
              { value: "70+", label: "Questions" },
              { value: "AI", label: "Powered" },
            ].map((s, i) => (
              <div key={i} style={styles.statItem}>
                <span style={styles.statValue}>{s.value}</span>
                <span style={styles.statLabel}>{s.label}</span>
              </div>
            ))}
          </div>

          <div style={{
            ...styles.buttonGroup,
            justifyContent: isMobile ? "center" : "flex-start",
          }}>
            {user ? (
              <Link to="/goal-selection" style={styles.primaryButton}>
                Continue Learning →
              </Link>
            ) : (
              <>
                <Link to="/register" style={styles.primaryButton}>
                  Get Started Free 🚀
                </Link>
                <Link to="/login" style={styles.secondaryButton}>
                  Login
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Hero Right — Cards */}
        {!isMobile && (
          <div style={styles.heroRight}>
            <div style={styles.floatingCard}>
              <div style={styles.floatingCardHeader}>
                <span style={styles.floatingCardTag}>🤖 AI Recommendation</span>
                <span style={styles.matchBadge}>92% Match</span>
              </div>
              <h3 style={styles.floatingCardTitle}>JavaScript Basics</h3>
              <div style={styles.floatingCardMeta}>
                <span style={styles.levelBadge}>🌱 Beginner</span>
                <span style={styles.providerBadge}>Udemy</span>
              </div>
              <div style={styles.matchBar}>
                <div style={{ ...styles.matchBarFill, width: "92%" }} />
              </div>
            </div>

            <div style={{ ...styles.floatingCard, marginTop: "16px", opacity: 0.85, transform: "scale(0.97)" }}>
              <div style={styles.floatingCardHeader}>
                <span style={styles.floatingCardTag}>🤖 AI Recommendation</span>
                <span style={styles.matchBadge}>78% Match</span>
              </div>
              <h3 style={styles.floatingCardTitle}>React Introduction</h3>
              <div style={styles.floatingCardMeta}>
                <span style={{ ...styles.levelBadge, backgroundColor: "#fffbeb", color: "#d97706" }}>⚡ Intermediate</span>
                <span style={styles.providerBadge}>Coursera</span>
              </div>
              <div style={styles.matchBar}>
                <div style={{ ...styles.matchBarFill, width: "78%" }} />
              </div>
            </div>

            <div style={{ ...styles.floatingCard, marginTop: "16px", opacity: 0.65, transform: "scale(0.94)" }}>
              <div style={styles.floatingCardHeader}>
                <span style={styles.floatingCardTag}>🤖 AI Recommendation</span>
                <span style={styles.matchBadge}>65% Match</span>
              </div>
              <h3 style={styles.floatingCardTitle}>Advanced React Hooks</h3>
              <div style={styles.floatingCardMeta}>
                <span style={{ ...styles.levelBadge, backgroundColor: "#fef2f2", color: "#dc2626" }}>🔥 Advanced</span>
                <span style={styles.providerBadge}>Udemy</span>
              </div>
              <div style={styles.matchBar}>
                <div style={{ ...styles.matchBarFill, width: "65%" }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Stats Banner */}
      <div style={styles.statsBanner}>
        {[
          { icon: "🎯", value: "10", label: "Career Goals" },
          { icon: "📝", value: "70+", label: "Unique Questions" },
          { icon: "🤖", value: "AI", label: "Cosine Similarity" },
          { icon: "🚀", value: "3", label: "Difficulty Levels" },
        ].map((s, i) => (
          <div key={i} style={styles.statsBannerItem}>
            <span style={styles.statsBannerIcon}>{s.icon}</span>
            <span style={styles.statsBannerValue}>{s.value}</span>
            <span style={styles.statsBannerLabel}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* How It Works */}
      <div style={{
        ...styles.features,
        padding: isMobile ? "50px 24px" : "80px 60px",
      }}>
        <p style={styles.sectionTag}>How It Works</p>
        <h2 style={{ ...styles.featuresTitle, fontSize: isMobile ? "28px" : "40px" }}>
          Four Steps to Smarter Learning
        </h2>
        <p style={styles.featuresSubtitle}>
          From goal to personalized course list in minutes
        </p>

        <div style={{
          ...styles.featuresGrid,
          gridTemplateColumns: isMobile ? "1fr" : "repeat(4, 1fr)",
        }}>
          {[
            { icon: "🎯", title: "Choose Your Goal", text: "Select from 10 IT career paths including Frontend, Backend, Full Stack, Data Analyst and more.", step: "01" },
            { icon: "📝", title: "Take Assessment", text: "Complete a 15-question skill assessment with a 15-second timer per question for accurate results.", step: "02" },
            { icon: "🤖", title: "AI Recommends", text: "Our AI uses cosine similarity to match your skill scores with the most suitable courses for your level.", step: "03" },
            { icon: "🚀", title: "Follow Your Path", text: "Get a structured learning path from Beginner to Advanced tailored to your current skill level.", step: "04" },
          ].map((f, i) => (
            <div key={i} style={styles.featureCard}>
              <div style={styles.stepNumber}>{f.step}</div>
              <div style={styles.featureIcon}>{f.icon}</div>
              <h3 style={styles.featureTitle}>{f.title}</h3>
              <p style={styles.featureText}>{f.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div style={{
        ...styles.cta,
        padding: isMobile ? "50px 24px" : "80px 60px",
        flexDirection: isMobile ? "column" : "row",
        textAlign: isMobile ? "center" : "left",
        gap: isMobile ? "24px" : "40px",
      }}>
        <div style={styles.ctaLeft}>
          <h2 style={{ ...styles.ctaTitle, fontSize: isMobile ? "28px" : "40px" }}>
            Ready to start your learning journey?
          </h2>
          <p style={styles.ctaText}>
            Join Learnixa today and get AI-powered course recommendations tailored just for you.
          </p>
        </div>
        <div style={{ flexShrink: 0 }}>
          {user ? (
            <Link to="/goal-selection" style={styles.ctaButton}>
              Start Assessment →
            </Link>
          ) : (
            <Link to="/register" style={styles.ctaButton}>
              Get Started Free →
            </Link>
          )}
        </div>
      </div>

    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#f0f4f8",
    color: "#1e293b",
    overflowX: "hidden",
  },
  hero: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "40px",
    backgroundColor: "#ffffff",
    position: "relative",
    overflow: "hidden",
  },
  blob1: {
    position: "absolute",
    top: "-100px",
    right: "-100px",
    width: "400px",
    height: "400px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(37,99,235,0.08), transparent 70%)",
    pointerEvents: "none",
  },
  blob2: {
    position: "absolute",
    bottom: "-80px",
    left: "-80px",
    width: "300px",
    height: "300px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(14,165,164,0.08), transparent 70%)",
    pointerEvents: "none",
  },
  heroContent: {
    flex: 1,
    maxWidth: "580px",
    display: "flex",
    flexDirection: "column",
    position: "relative",
    zIndex: 1,
  },
  tag: {
    display: "inline-block",
    padding: "8px 16px",
    borderRadius: "999px",
    backgroundColor: "#eff6ff",
    color: "#2563eb",
    fontSize: "14px",
    fontWeight: "600",
    marginBottom: "24px",
    border: "1px solid #bfdbfe",
    width: "fit-content",
  },
  title: {
    lineHeight: "1.1",
    marginBottom: "20px",
    color: "#1e293b",
    fontWeight: "800",
  },
  highlight: {
    background: "linear-gradient(135deg, #2563eb, #0ea5a4)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  subtitle: {
    lineHeight: "1.7",
    color: "#64748b",
    marginBottom: "32px",
    maxWidth: "520px",
  },
  statsRow: {
    display: "flex",
    gap: "32px",
    marginBottom: "36px",
  },
  statItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  statValue: {
    fontSize: "28px",
    fontWeight: "800",
    color: "#2563eb",
    lineHeight: "1",
  },
  statLabel: {
    fontSize: "12px",
    color: "#64748b",
    fontWeight: "500",
    marginTop: "4px",
  },
  buttonGroup: {
    display: "flex",
    gap: "16px",
    flexWrap: "wrap",
  },
  primaryButton: {
    display: "inline-block",
    padding: "16px 32px",
    borderRadius: "12px",
    background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
    color: "#ffffff",
    textDecoration: "none",
    fontSize: "16px",
    fontWeight: "700",
    boxShadow: "0 8px 20px rgba(37, 99, 235, 0.3)",
  },
  secondaryButton: {
    display: "inline-block",
    padding: "16px 32px",
    borderRadius: "12px",
    backgroundColor: "#f8fafc",
    color: "#1e293b",
    textDecoration: "none",
    fontSize: "16px",
    fontWeight: "700",
    border: "1px solid #e2e8f0",
  },
  heroRight: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    maxWidth: "380px",
    position: "relative",
    zIndex: 1,
  },
  floatingCard: {
    width: "100%",
    backgroundColor: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "16px",
    padding: "20px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
    transition: "transform 0.2s ease",
  },
  floatingCardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px",
  },
  floatingCardTag: {
    color: "#2563eb",
    fontSize: "12px",
    fontWeight: "600",
  },
  matchBadge: {
    backgroundColor: "#eff6ff",
    color: "#2563eb",
    padding: "3px 10px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "700",
    border: "1px solid #bfdbfe",
  },
  floatingCardTitle: {
    color: "#1e293b",
    fontSize: "18px",
    fontWeight: "700",
    marginBottom: "10px",
  },
  floatingCardMeta: {
    display: "flex",
    gap: "8px",
    marginBottom: "12px",
  },
  levelBadge: {
    backgroundColor: "#f0fdf4",
    color: "#16a34a",
    padding: "3px 10px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "600",
  },
  providerBadge: {
    backgroundColor: "#f8fafc",
    color: "#64748b",
    padding: "3px 10px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "600",
    border: "1px solid #e2e8f0",
  },
  matchBar: {
    width: "100%",
    height: "6px",
    backgroundColor: "#e2e8f0",
    borderRadius: "999px",
    overflow: "hidden",
  },
  matchBarFill: {
    height: "100%",
    background: "linear-gradient(90deg, #2563eb, #0ea5a4)",
    borderRadius: "999px",
  },
  statsBanner: {
    display: "flex",
    justifyContent: "center",
    gap: "0",
    backgroundColor: "#1e293b",
    padding: "28px 40px",
    flexWrap: "wrap",
  },
  statsBannerItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "12px 40px",
    borderRight: "1px solid #334155",
  },
  statsBannerIcon: {
    fontSize: "24px",
    marginBottom: "6px",
  },
  statsBannerValue: {
    fontSize: "24px",
    fontWeight: "800",
    color: "#ffffff",
    lineHeight: "1",
    marginBottom: "4px",
  },
  statsBannerLabel: {
    fontSize: "12px",
    color: "#94a3b8",
    fontWeight: "500",
  },
  sectionTag: {
    display: "inline-block",
    padding: "6px 14px",
    borderRadius: "999px",
    backgroundColor: "#eff6ff",
    color: "#2563eb",
    fontSize: "13px",
    fontWeight: "600",
    marginBottom: "16px",
    border: "1px solid #bfdbfe",
  },
  features: {
    backgroundColor: "#f0f4f8",
    textAlign: "center",
  },
  featuresTitle: {
    marginBottom: "12px",
    color: "#1e293b",
    fontWeight: "700",
  },
  featuresSubtitle: {
    fontSize: "18px",
    color: "#64748b",
    marginBottom: "50px",
  },
  featuresGrid: {
    display: "grid",
    gap: "24px",
  },
  featureCard: {
    backgroundColor: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "16px",
    padding: "30px",
    textAlign: "center",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
    position: "relative",
  },
  stepNumber: {
    position: "absolute",
    top: "16px",
    right: "16px",
    fontSize: "13px",
    fontWeight: "800",
    color: "#e2e8f0",
  },
  featureIcon: {
    fontSize: "40px",
    marginBottom: "16px",
  },
  featureTitle: {
    fontSize: "18px",
    color: "#1e293b",
    marginBottom: "12px",
    fontWeight: "700",
  },
  featureText: {
    fontSize: "14px",
    color: "#64748b",
    lineHeight: "1.7",
  },
  cta: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderTop: "1px solid #e2e8f0",
  },
  ctaLeft: { flex: 1 },
  ctaTitle: {
    fontWeight: "800",
    color: "#1e293b",
    marginBottom: "12px",
    lineHeight: "1.2",
  },
  ctaText: {
    fontSize: "16px",
    color: "#64748b",
    lineHeight: "1.6",
  },
  ctaButton: {
    display: "inline-block",
    padding: "18px 36px",
    borderRadius: "12px",
    background: "linear-gradient(135deg, #2563eb, #0ea5a4)",
    color: "#ffffff",
    textDecoration: "none",
    fontSize: "16px",
    fontWeight: "700",
    boxShadow: "0 8px 20px rgba(37, 99, 235, 0.3)",
    whiteSpace: "nowrap",
  },
};

export default Home;