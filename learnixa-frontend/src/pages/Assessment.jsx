import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function Assessment() {
  const location = useLocation();
  const navigate = useNavigate();

  const selectedGoal =
    location.state?.selectedGoal || "No goal selected";

  const [isMobile, setIsMobile] = useState(
    window.innerWidth <= 768
  );

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [answers, setAnswers] = useState([]);

  // TIMER
  const [timeLeft, setTimeLeft] = useState(15);

  // RESPONSIVE
  useEffect(() => {
    const handleResize = () =>
      setIsMobile(window.innerWidth <= 768);

    window.addEventListener("resize", handleResize);

    return () =>
      window.removeEventListener("resize", handleResize);
  }, []);

  // FETCH QUESTIONS
  useEffect(() => {
    fetch(
      `http://localhost:5000/api/questions/${encodeURIComponent(
        selectedGoal
      )}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.questions) {
          const grouped = data.questions;
          const selected = [];

          Object.keys(grouped).forEach((skill) => {
            const shuffled = [...grouped[skill]].sort(
              () => Math.random() - 0.5
            );

            selected.push(...shuffled.slice(0, 5));
          });

          setQuestions(selected);
        } else {
          setError("No questions found for this goal.");
        }

        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Could not load questions.");
        setLoading(false);
      });
  }, [selectedGoal]);

  // CALCULATE SCORES
  const calculateScores = (finalAnswers) => {
    const scores = {};
    const totals = {};

    questions.forEach((q, index) => {
      if (!scores[q.skill]) scores[q.skill] = 0;
      if (!totals[q.skill]) totals[q.skill] = 0;

      totals[q.skill]++;

      if (finalAnswers[index] === q.answer) {
        scores[q.skill]++;
      }
    });

    Object.keys(scores).forEach((skill) => {
      scores[skill] = Math.round(
        (scores[skill] / totals[skill]) * 100
      );
    });

    return scores;
  };

  // TIMER EFFECT
  useEffect(() => {
    if (questions.length === 0) return;

    setTimeLeft(15);

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);

          const updatedAnswers = [...answers];
          updatedAnswers[currentIndex] = null;

          // AUTO NEXT QUESTION
          if (currentIndex < questions.length - 1) {
            setAnswers(updatedAnswers);
            setSelectedOption(null);
            setCurrentIndex((prevIndex) => prevIndex + 1);
          } else {
            // FINISH
            const finalScores =
              calculateScores(updatedAnswers);

            const user = JSON.parse(
              localStorage.getItem("user")
            );

            if (user) {
              fetch(
                "http://localhost:5000/api/assessment/save",
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem(
                      "token"
                    )}`,
                  },
                  body: JSON.stringify({
                    user_id: user.id,
                    selected_goal: selectedGoal,
                    effective_goal: selectedGoal,
                    scores: finalScores,
                    answers: updatedAnswers,
                    questions: questions,
                  }),
                }
              ).catch((err) =>
                console.error(
                  "Could not save assessment:",
                  err
                )
              );
            }

            navigate("/recommendations", {
              state: {
                selectedGoal,
                effectiveGoal: selectedGoal,
                scores: finalScores,
                answers: updatedAnswers,
                questions: questions,
              },
            });
          }

          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentIndex, questions]);

  // LOADING
  if (loading) {
    return (
      <div style={styles.page}>
        <div
          style={{
            ...styles.card,
            padding: "60px 40px",
          }}
        >
          <p
            style={{
              color: "#2563eb",
              fontSize: "18px",
            }}
          >
            Loading assessment...
          </p>
        </div>
      </div>
    );
  }

  // ERROR
  if (error || questions.length === 0) {
    return (
      <div style={styles.page}>
        <div
          style={{
            ...styles.card,
            padding: "60px 40px",
          }}
        >
          <p
            style={{
              color: "#dc2626",
              fontSize: "18px",
            }}
          >
            {error ||
              "No questions available for this goal."}
          </p>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  // NEXT BUTTON
  const handleNext = () => {
    if (selectedOption === null) return;

    const updatedAnswers = [...answers];

    updatedAnswers[currentIndex] = selectedOption;

    setAnswers(updatedAnswers);
    setSelectedOption(null);

    // RESET TIMER
    setTimeLeft(15);

    // NEXT QUESTION
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // FINISH
      const finalScores =
        calculateScores(updatedAnswers);

      const user = JSON.parse(
        localStorage.getItem("user")
      );

      if (user) {
        fetch(
          "http://localhost:5000/api/assessment/save",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem(
                "token"
              )}`,
            },
            body: JSON.stringify({
              user_id: user.id,
              selected_goal: selectedGoal,
              effective_goal: selectedGoal,
              scores: finalScores,
              answers: updatedAnswers,
              questions: questions,
            }),
          }
        ).catch((err) =>
          console.error(
            "Could not save assessment:",
            err
          )
        );
      }

      navigate("/recommendations", {
        state: {
          selectedGoal,
          effectiveGoal: selectedGoal,
          scores: finalScores,
          answers: updatedAnswers,
          questions: questions,
        },
      });
    }
  };

  return (
    <div style={styles.page}>
      <div
        style={{
          ...styles.card,
          padding: isMobile
            ? "24px 20px"
            : "40px 35px",

          maxWidth: isMobile ? "100%" : "800px",

          borderRadius: isMobile ? "0" : "20px",

          margin: isMobile ? "0" : "auto",
        }}
      >
        <p style={styles.tag}>Skill Assessment</p>

        <h1
          style={{
            ...styles.title,
            fontSize: isMobile ? "24px" : "36px",
          }}
        >
          Test Your Current Skills
        </h1>

        <p style={styles.goal}>
          Goal: <strong>{selectedGoal}</strong>
        </p>

        {/* PROGRESS */}
        <div style={styles.topRow}>
          <div style={{ flex: 1 }}>
            <div style={styles.progressText}>
              Question {currentIndex + 1} of{" "}
              {questions.length}
            </div>

            <div style={styles.progressBarBg}>
              <div
                style={{
                  ...styles.progressBarFill,
                  width: `${
                    ((currentIndex + 1) /
                      questions.length) *
                    100
                  }%`,
                }}
              />
            </div>
          </div>
        </div>

        <p style={styles.skillTag}>
          Skill: {currentQuestion.skill}
        </p>

        {/* QUESTION */}
        <p
          style={{
            ...styles.question,
            fontSize: isMobile ? "18px" : "22px",
          }}
        >
          {currentQuestion.question}
        </p>

        {/* TIMER */}
        <div
          style={{
            ...styles.timerCircle,

            borderColor:
              timeLeft > 10
                ? "#16a34a"
                : timeLeft > 5
                ? "#d97706"
                : "#dc2626",

            color:
              timeLeft > 10
                ? "#16a34a"
                : timeLeft > 5
                ? "#d97706"
                : "#dc2626",
          }}
        >
          {timeLeft}
        </div>

        {/* OPTIONS */}
        <div style={styles.optionsWrapper}>
          {currentQuestion.options.map(
            (option, index) => (
              <div
                key={index}
                onClick={() =>
                  setSelectedOption(index)
                }
                style={{
                  ...styles.option,

                  ...(selectedOption === index
                    ? styles.selectedOption
                    : {}),

                  fontSize: isMobile
                    ? "14px"
                    : "15px",

                  padding: isMobile
                    ? "12px 14px"
                    : "14px 16px",
                }}
              >
                {option}
              </div>
            )
          )}
        </div>

        {/* BUTTON */}
        <button
          style={{
            ...styles.button,
            width: isMobile ? "100%" : "auto",
          }}
          onClick={handleNext}
        >
          {currentIndex === questions.length - 1
            ? "Finish Assessment"
            : "Next Question →"}
        </button>
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
    alignItems: "flex-start",
    padding: "0",
  },

  card: {
    width: "100%",
    backgroundColor: "#ffffff",
    border: "1px solid #e2e8f0",
    textAlign: "center",
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
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
    marginBottom: "10px",
    color: "#1e293b",
    fontWeight: "700",
  },

  goal: {
    color: "#2563eb",
    fontSize: "15px",
    marginBottom: "8px",
  },

  topRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "16px",
    marginTop: "20px",
    marginBottom: "24px",
  },

  progressText: {
    color: "#64748b",
    fontSize: "14px",
    marginBottom: "8px",
    textAlign: "left",
  },

  progressBarBg: {
    width: "100%",
    height: "8px",
    backgroundColor: "#e2e8f0",
    borderRadius: "999px",
    overflow: "hidden",
  },

  progressBarFill: {
    height: "100%",
    background:
      "linear-gradient(90deg, #2563eb, #0ea5a4)",
    borderRadius: "999px",
    transition: "width 0.3s ease",
  },

  skillTag: {
    color: "#0ea5a4",
    fontSize: "15px",
    fontWeight: "600",
    marginBottom: "10px",
  },

  question: {
    color: "#1e293b",
    marginBottom: "20px",
    lineHeight: "1.5",
    fontWeight: "600",
  },

  timerCircle: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    border: "5px solid",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "28px",
    fontWeight: "700",
    backgroundColor: "#ffffff",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    margin: "0 auto 24px auto",
  },

  optionsWrapper: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginBottom: "24px",
    textAlign: "left",
  },

  option: {
    borderRadius: "10px",
    backgroundColor: "#f8fafc",
    border: "1px solid #e2e8f0",
    cursor: "pointer",
    textAlign: "left",
    color: "#1e293b",
    transition: "all 0.2s ease",
  },

  selectedOption: {
    backgroundColor: "#eff6ff",
    border: "2px solid #2563eb",
    color: "#1d4ed8",
    fontWeight: "600",
  },

  button: {
    padding: "14px 28px",
    borderRadius: "10px",
    border: "none",
    background:
      "linear-gradient(135deg, #2563eb, #1d4ed8)",
    color: "#ffffff",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    boxShadow:
      "0 8px 20px rgba(37, 99, 235, 0.3)",
  },
};

export default Assessment;