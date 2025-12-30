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
  const [meals, setMeals] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");

  const getDateStr = (dateObj) => {
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const changeDate = (days) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + days);
    setCurrentDate(newDate);
  };

  const CustomInput = React.forwardRef(({ value, onClick }, ref) => (
    <span
      onClick={onClick}
      ref={ref}
      style={{
        fontWeight: "bold",
        color: "#4a5568",
        cursor: "pointer",
        fontSize: "1.1rem",
        outline: "none",
      }}
    >
      {value} 📅
    </span>
  ));

  useEffect(() => {
    const dateStr = getDateStr(currentDate);
    fetch(`http://localhost:8080/api/meals?date=${dateStr}`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setMeals(data))
      .catch((err) => console.error("데이터 로드 실패:", err));
  }, [currentDate]);

  const addMeal = () => {
    if (inputValue.trim() === "") return;
    fetch("http://localhost:8080/api/meals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: inputValue,
        mealType,
        mealDate: getDateStr(currentDate),
      }),
    })
      .then((res) => res.json())
      .then((saved) => {
        setMeals([...meals, saved]);
        setInputValue("");
      });
  };

  const deleteMeal = (id) => {
    fetch(`http://localhost:8080/api/meals/${id}`, { method: "DELETE" }).then(
      () => setMeals(meals.filter((m) => m.id !== id))
    );
  };

  const saveEdit = (id) => {
    const meal = meals.find((m) => m.id === id);
    fetch(`http://localhost:8080/api/meals/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...meal, text: editingText }),
    })
      .then((res) => res.json())
      .then((data) => {
        setMeals(meals.map((m) => (m.id === id ? data : m)));
        setEditingId(null);
      });
  };

  const placeholderText = `${mealType}${
    mealType === "간식" ? "으로" : "에"
  } 먹은 음식을 적어주세요!`;

  return (
    <div className="main-content">
      <div className="pixel-card">
        <h3>🥗 오늘의 식단 기록</h3>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "20px",
            marginBottom: "25px",
          }}
        >
          <button
            onClick={() => changeDate(-1)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#5e72e4",
              fontSize: "1.5rem",
              fontWeight: "bold",
              outline: "none",
            }}
          >
            ◀
          </button>
          <DatePicker
            locale="ko"
            selected={currentDate}
            onChange={(date) => setCurrentDate(date)}
            dateFormat="yyyy년 MM월 dd일 eeee"
            customInput={<CustomInput />}
          />
          <button
            onClick={() => changeDate(1)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#5e72e4",
              fontSize: "1.5rem",
              fontWeight: "bold",
              outline: "none",
            }}
          >
            ▶
          </button>
        </div>
        <div style={{ display: "flex", gap: "8px", marginBottom: "15px" }}>
          {["아침", "점심", "저녁", "간식"].map((type) => (
            <button
              key={type}
              onClick={() => setMealType(type)}
              style={{
                background: mealType === type ? "#5e72e4" : "#edf2f7",
                color: mealType === type ? "#fff" : "#4a5568",
                border: "none",
                padding: "8px 16px",
                borderRadius: "15px",
                cursor: "pointer",
                outline: "none",
              }}
            >
              {type}
            </button>
          ))}
        </div>
        <div className="input-group">
          <input
            className="pixel-input"
            type="text"
            placeholder={placeholderText}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addMeal()}
            style={{ outline: "none" }}
          />
          <button
            className="pixel-btn"
            onClick={addMeal}
            style={{ outline: "none" }}
          >
            추가
          </button>
        </div>
        <div style={{ width: "100%" }}>
          {meals.map((meal) => (
            <div
              className="item-row"
              key={meal.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span style={{ flex: 1, textAlign: "left" }}>
                {editingId === meal.id ? (
                  <input
                    className="pixel-input"
                    style={{
                      width: "90%",
                      height: "35px",
                      fontSize: "16px",
                      outline: "none",
                    }}
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    autoFocus
                    onKeyPress={(e) => e.key === "Enter" && saveEdit(meal.id)}
                  />
                ) : (
                  <>
                    <strong style={{ color: "#5e72e4" }}>
                      [{meal.mealType}]
                    </strong>{" "}
                    {meal.text}
                  </>
                )}
              </span>
              <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
                {editingId === meal.id ? (
                  <>
                    <button
                      className="pixel-btn edit"
                      style={{
                        height: "40px",
                        padding: "0 20px",
                        fontSize: "16px",
                        borderRadius: "15px",
                        minWidth: "70px",
                        outline: "none",
                      }}
                      onClick={() => saveEdit(meal.id)}
                    >
                      완료
                    </button>
                    <button
                      className="pixel-btn delete"
                      style={{ marginLeft: "0 !important", outline: "none" }}
                      onClick={() => setEditingId(null)}
                    >
                      취소
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="pixel-btn edit"
                      style={{
                        height: "40px",
                        padding: "0 20px",
                        fontSize: "16px",
                        borderRadius: "15px",
                        minWidth: "70px",
                        outline: "none",
                      }}
                      onClick={() => {
                        setEditingId(meal.id);
                        setEditingText(meal.text);
                      }}
                    >
                      수정
                    </button>
                    <button
                      className="pixel-btn delete"
                      style={{ marginLeft: "0 !important", outline: "none" }}
                      onClick={() => deleteMeal(meal.id)}
                    >
                      삭제
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Meal;
