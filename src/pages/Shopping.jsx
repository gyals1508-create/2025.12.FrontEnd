import React, { useState, useEffect } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import { ko } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";
import "../Retro.css";

registerLocale("ko", ko);

const Shopping = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [items, setItems] = useState([]);
  const [inputValue, setInputValue] = useState("");

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
    fetch(`http://localhost:8080/api/shopping?date=${dateStr}`)
      .then((res) => res.json())
      .then((data) => setItems(data))
      .catch((err) => console.error("로드 실패:", err));
  }, [currentDate]);

  const addItem = () => {
    if (inputValue.trim() === "") return;
    const newItem = {
      text: inputValue,
      isBought: false,
      shoppingDate: getDateStr(currentDate),
    };
    fetch("http://localhost:8080/api/shopping", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newItem),
    })
      .then((res) => res.json())
      .then((savedItem) => {
        setItems([...items, savedItem]);
        setInputValue("");
      });
  };

  const markAsBought = (item) => {
    const updatedItem = { ...item, isBought: true };
    fetch(`http://localhost:8080/api/shopping/${item.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedItem),
    }).then(() => {
      setItems(items.map((i) => (i.id === item.id ? updatedItem : i)));
    });
  };

  const deleteItem = (id) => {
    fetch(`http://localhost:8080/api/shopping/${id}`, {
      method: "DELETE",
    }).then(() => setItems(items.filter((item) => item.id !== id)));
  };

  return (
    <div className="pixel-card">
      <h3>오늘의 장바구니🧺</h3>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "15px",
          marginTop: "-20px",
          marginBottom: "25px",
          outline: "none",
        }}
      >
        <button
          onClick={() => changeDate(-1)}
          style={{
            background: "none",
            border: "none",
            outline: "none",
            cursor: "pointer",
            fontSize: "1.2rem",
            color: "#5e72e4",
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
            outline: "none",
            cursor: "pointer",
            fontSize: "1.2rem",
            color: "#5e72e4",
          }}
        >
          ▶
        </button>
      </div>
      <div className="input-group">
        <input
          className="pixel-input"
          type="text"
          placeholder="여기에 구매할 물건을 입력해주세요!"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && addItem()}
          style={{ outline: "none" }}
        />
        <button
          className="pixel-btn"
          onClick={addItem}
          style={{ border: "none", outline: "none" }}
        >
          추가
        </button>
      </div>
      <div style={{ width: "100%", display: "flex", flexDirection: "column" }}>
        {items.length === 0 ? (
          <p
            style={{ color: "#cbd5e0", marginTop: "20px", textAlign: "center" }}
          >
            장볼 목록이 텅 비었어요!
          </p>
        ) : (
          items.map((item) => (
            <div
              className="item-row"
              key={item.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
              }}
            >
              <span
                style={{
                  textDecoration: item.isBought ? "line-through" : "none",
                  color: item.isBought ? "#cbd5e0" : "#4a5568",
                }}
              >
                {item.text}
              </span>
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                {item.isBought ? (
                  <div
                    style={{
                      color: "#48bb78",
                      fontWeight: "bold",
                      fontSize: "1.2rem",
                      marginRight: "10px",
                    }}
                  >
                    구매완료!
                  </div>
                ) : (
                  <button
                    onClick={() => markAsBought(item)}
                    style={{
                      background: "#48bb78",
                      color: "#fff",
                      border: "none",
                      outline: "none",
                      height: "40px",
                      padding: "0 25px",
                      borderRadius: "15px",
                      fontSize: "16px",
                      cursor: "pointer",
                      fontFamily: "Jua",
                    }}
                  >
                    구매완료
                  </button>
                )}
                <button
                  className="pixel-btn delete"
                  onClick={() => deleteItem(item.id)}
                  style={{ border: "none", outline: "none", marginLeft: "0" }}
                >
                  삭제
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Shopping;
