const db = require("../config/db");

const getQuestions = (req, res) => {
  const { goal } = req.params;

  const query = "SELECT * FROM questions WHERE goal = ?";

  db.query(query, [goal], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "No questions found for this goal" });
    }

    // Group by skill
    const grouped = {};
    results.forEach((q) => {
      if (!grouped[q.skill]) grouped[q.skill] = [];
      grouped[q.skill].push({
        skill: q.skill,
        question: q.question_text,
        options: [q.option_a, q.option_b, q.option_c, q.option_d],
        answer: q.correct_option,
      });
    });

    res.json({ questions: grouped });
  });
};

module.exports = { getQuestions };