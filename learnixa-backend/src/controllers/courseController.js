const db = require("../config/db");

const getCourses = (req, res) => {
  const { goal } = req.params;

  const query = "SELECT * FROM courses WHERE goal = ?";

  db.query(query, [goal], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "No courses found for this goal" });
    }

    const courses = results.map((row) => ({
      title: row.title,
      level: row.level,
      provider: row.provider,
      link: row.link,
      skills: {
        [row.skill1_name]: row.skill1_value,
        [row.skill2_name]: row.skill2_value,
        ...(row.skill3_name ? { [row.skill3_name]: row.skill3_value } : {}),
        ...(row.skill4_name ? { [row.skill4_name]: row.skill4_value } : {}),
      },
    }));

    res.json({ courses });
  });
};

module.exports = { getCourses };