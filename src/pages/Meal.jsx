import React, { useState, useEffect } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import { ko } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";
import "../Retro.css";

registerLocale("ko", ko);

const Meal = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [mealType, setMealType] = useState("아침");
  const [inputValue, setInputValue] = useState("");
  const [calorieInput, setCalorieInput] = useState("");
  const [meals, setMeals] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [editingCalories, setEditingCalories] = useState("");
  const [displayRecs, setDisplayRecs] = useState([]);

  const dailyGoal = 2000;
  const totalCalories = meals.reduce(
    (sum, m) => sum + (Number(m.calories) || 0),
    0
  );
  const isOver = totalCalories > dailyGoal;

  const dietMenus = [
    "연어 샐러드 (320kcal)",
    "닭가슴살 곤약밥 (290kcal)",
    "두부 포케 (350kcal)",
    "구운 야채 팩 (150kcal)",
  ];
  const healthyMenus = [
    "불고기 덮밥 (580kcal)",
    "고등어 구이 정식 (520kcal)",
    "버섯 전골 (450kcal)",
    "비빔밥 (550kcal)",
  ];

  useEffect(() => {
    const dateStr =
      currentDate.getFullYear() +
      "-" +
      String(currentDate.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(currentDate.getDate()).padStart(2, "0");
    fetch(`http://localhost:8080/api/meals?date=${dateStr}`)
      .then((res) => res.json())
      .then((data) => setMeals(data));
  }, [currentDate]);

  useEffect(() => {
    const base = isOver ? dietMenus : healthyMenus;
    setDisplayRecs([...base].sort(() => Math.random() - 0.5).slice(0, 3));
  }, [currentDate, isOver]);

  const addMeal = () => {
    if (!inputValue.trim()) return;
    fetch("http://localhost:8080/api/meals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: inputValue,
        mealType,
        calories: Number(calorieInput) || 0,
        mealDate: currentDate.toISOString().split("T")[0],
      }),
    })
      .then((res) => res.json())
      .then((saved) => {
        setMeals([...meals, saved]);
        setInputValue("");
        setCalorieInput("");
      });
  };

  const btnBaseStyle = { outline: "none", border: "none" };

  return (
    <div
      className="main-content"
      style={{
        display: "flex",
        gap: "25px",
        justifyContent: "center",
        margin: "100px auto",
      }}
    >
      <div className="pixel-card" style={{ flex: 1.5 }}>
        <h3>🥗 오늘의 식단 기록</h3>
        <div style={{ display: "flex", gap: "8px", marginBottom: "15px" }}>
          {["아침", "점심", "저녁", "간식"].map((type) => (
            <button
              key={type}
              onClick={() => setMealType(type)}
              style={{
                background: mealType === type ? "#5e72e4" : "#edf2f7",
                color: mealType === type ? "#fff" : "#4a5568",
                padding: "8px 16px",
                borderRadius: "15px",
              }}
            >
              {type}
            </button>
          ))}
        </div>
        <div className="input-group" style={{ display: "flex", gap: "10px" }}>
          <input
            className="pixel-input"
            placeholder="음식명"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <input
            className="pixel-input"
            style={{ width: "70px" }}
            placeholder="kcal"
            value={calorieInput}
            onChange={(e) =>
              setCalorieInput(e.target.value.replace(/[^0-9]/g, ""))
            }
          />
          <button className="pixel-btn" onClick={addMeal}>
            추가
          </button>
        </div>
        <div>
          {meals.map((meal) => (
            <div
              key={meal.id}
              className="item-row"
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "10px 0",
              }}
            >
              <span>
                <strong style={{ color: "#5e72e4" }}>[{meal.mealType}]</strong>{" "}
                {meal.text} ({meal.calories}kcal)
              </span>
              <button
                className="pixel-btn delete"
                onClick={() =>
                  fetch(`http://localhost:8080/api/meals/${meal.id}`, {
                    method: "DELETE",
                  }).then(() => setMeals(meals.filter((m) => m.id !== meal.id)))
                }
              >
                삭제
              </button>
            </div>
          ))}
        </div>
      </div>
      <div
        style={{
          flex: 0.7,
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        <div className="pixel-card">
          <h3>📊 영양 요약</h3>
          <div
            style={{
              fontSize: "2rem",
              fontWeight: "bold",
              color: isOver ? "#f56565" : "#48bb78",
            }}
          >
            {totalCalories}{" "}
            <span style={{ fontSize: "1rem" }}>/ {dailyGoal} kcal</span>
          </div>
        </div>
        <div className="pixel-card">
          <h3>💡 추천 식단</h3>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {displayRecs.map((item, i) => (
              <li key={i} style={{ padding: "5px 0" }}>
                ✨ {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
export default Meal;
