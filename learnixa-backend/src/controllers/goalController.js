const getGoals = (req, res) => {
  const goals = [
    "Software Developer",
    "Frontend Developer",
    "Backend Developer",
    "Full Stack Developer",
    "Data Analyst",
    "Machine Learning Engineer",
    "Cybersecurity Specialist",
    "UI/UX Developer",
    "Database Administrator",
    "DevOps Engineer",
  ];

  res.json(goals);
};

module.exports = { getGoals };