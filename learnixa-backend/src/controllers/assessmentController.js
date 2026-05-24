const db = require("../config/db");

const saveAssessment = (req, res) => {
  const { user_id, selected_goal, effective_goal, scores } = req.body;

  if (!user_id || !selected_goal || !scores) {
    return res.status(400).json({ message: "Missing required data" });
  }

  const insertAssessment = "INSERT INTO assessments (user_id, selected_goal, effective_goal) VALUES (?, ?, ?)";
  db.query(insertAssessment, [user_id, selected_goal, effective_goal], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Could not save assessment" });
    }

    const assessmentId = result.insertId;

    const skillEntries = Object.entries(scores).map(([skill, score]) => [
      assessmentId,
      skill,
      score,
    ]);

    const insertScores = "INSERT INTO assessment_scores (assessment_id, skill, score) VALUES ?";
    db.query(insertScores, [skillEntries], (err) => {
      if (err) {
        return res.status(500).json({ message: "Could not save scores" });
      }

      res.status(201).json({
        message: "Assessment saved successfully",
        assessmentId,
      });
    });
  });
};

const getHistory = (req, res) => {
  const { user_id } = req.params;

  // First get all assessments for user
  const assessmentQuery = `
    SELECT id, selected_goal, effective_goal, created_at
    FROM assessments
    WHERE user_id = ?
    ORDER BY created_at DESC
  `;

  db.query(assessmentQuery, [user_id], (err, assessments) => {
    if (err) {
      return res.status(500).json({ message: "Database error" });
    }

    if (assessments.length === 0) {
      return res.json({ history: [] });
    }

    // Get scores for each assessment
    const assessmentIds = assessments.map((a) => a.id);

    const scoresQuery = `
      SELECT assessment_id, skill, score
      FROM assessment_scores
      WHERE assessment_id IN (?)
    `;

    db.query(scoresQuery, [assessmentIds], (err, scores) => {
      if (err) {
        return res.status(500).json({ message: "Database error" });
      }

      // Group scores by assessment_id
      const history = assessments.map((assessment) => ({
        ...assessment,
        scores: scores.filter((s) => s.assessment_id === assessment.id),
      }));

      res.json({ history });
    });
  });
};
module.exports = { saveAssessment, getHistory };