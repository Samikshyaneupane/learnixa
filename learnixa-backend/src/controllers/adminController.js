const db = require("../config/db");

const getDashboardStats = (req, res) => {
  const stats = {};

  // Total users
  db.query("SELECT COUNT(*) as total FROM users", (err, result) => {
    if (err) return res.status(500).json({ message: "Database error" });
    stats.totalUsers = result[0].total;

    // Total assessments
    db.query("SELECT COUNT(*) as total FROM assessments", (err, result) => {
      if (err) return res.status(500).json({ message: "Database error" });
      stats.totalAssessments = result[0].total;

      // Most popular goal
      db.query(
        "SELECT selected_goal, COUNT(*) as count FROM assessments GROUP BY selected_goal ORDER BY count DESC LIMIT 1",
        (err, result) => {
          if (err) return res.status(500).json({ message: "Database error" });
          stats.mostPopularGoal = result[0] ? result[0].selected_goal : "N/A";

          // All users
          db.query(
            "SELECT id, name, email, is_admin, created_at FROM users ORDER BY created_at DESC",
            (err, result) => {
              if (err) return res.status(500).json({ message: "Database error" });
              stats.users = result;

              // All assessments with user info
              db.query(
                `SELECT a.id, u.name, u.email, a.selected_goal, a.effective_goal, a.created_at
                FROM assessments a
                JOIN users u ON a.user_id = u.id
                ORDER BY a.created_at DESC`,
                (err, result) => {
                  if (err) return res.status(500).json({ message: "Database error" });
                  stats.assessments = result;

                  // Goal distribution
                  db.query(
                    "SELECT selected_goal, COUNT(*) as count FROM assessments GROUP BY selected_goal ORDER BY count DESC",
                    (err, result) => {
                      if (err) return res.status(500).json({ message: "Database error" });
                      stats.goalDistribution = result;

                      res.json(stats);
                    }
                  );
                }
              );
            }
          );
        }
      );
    });
  });
};

module.exports = { getDashboardStats };