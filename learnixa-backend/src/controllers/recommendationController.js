const db = require("../config/db");

const getRecommendations = (req, res) => {
  const { scores, effective_goal } = req.body;

  if (!scores || !effective_goal) {
    return res.status(400).json({ message: "Missing data" });
  }

  const scoreValues = Object.values(scores);
  const average = scoreValues.reduce((a, b) => a + b, 0) / scoreValues.length;

  let userLevel;
  if (average < 40) {
    userLevel = "Beginner";
  } else if (average <= 70) {
    userLevel = "Intermediate";
  } else {
    userLevel = "Advanced";
  }

  const query = "SELECT * FROM courses WHERE goal = ?";

  db.query(query, [effective_goal], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error" });
    }

    const allCourses = results.map((row) => ({
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

    const levelFilter = {
      Beginner: ["Beginner"],
      Intermediate: ["Beginner", "Intermediate"],
      Advanced: ["Beginner", "Intermediate", "Advanced"],
    };

    const filteredCourses = allCourses.filter((course) => {
      const courseSkills = Object.keys(course.skills);
      const dominantSkill = courseSkills.reduce((a, b) =>
        course.skills[a] > course.skills[b] ? a : b
      );
      const userScoreForDominantSkill = scores[dominantSkill] || 0;

      if (userScoreForDominantSkill > 70) return false;
      return levelFilter[userLevel].includes(course.level);
    });

    const cosineSimilarity = (userScores, courseSkills) => {
      const allSkills = Object.keys(courseSkills);
      let dot = 0, userMag = 0, courseMag = 0;

      allSkills.forEach((skill) => {
        const u = userScores[skill] || 0;
        const c = courseSkills[skill] || 0;
        dot += u * c;
        userMag += u * u;
        courseMag += c * c;
      });

      userMag = Math.sqrt(userMag);
      courseMag = Math.sqrt(courseMag);

      if (userMag === 0 || courseMag === 0) return 0;
      return dot / (userMag * courseMag);
    };

    const recommended = filteredCourses
      .map((course) => ({
        ...course,
        match: Math.round(cosineSimilarity(scores, course.skills) * 100),
      }))
      .sort((a, b) => b.match - a.match)
      .slice(0, 5);

    res.json({
      recommendations: recommended,
      userLevel,
      averageScore: Math.round(average),
    });
  });
};

module.exports = { getRecommendations };