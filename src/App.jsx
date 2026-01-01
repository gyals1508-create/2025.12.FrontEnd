import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";

import Home from "./pages/Home";
import Meal from "./pages/Meal";
import Shopping from "./pages/Shopping";
import Login from "../../Self_Practice/Login";
import Signup from "../../Self_Practice/Signup";
import "./Retro.css";

function Nav() {
  const location = useLocation();

  // 특정 페이지(로그인, 회원가입)에서 상단 헤더 숨김 처리
  // "/" 경로가 로그인이 되었으므로 "/" 도 숨김 목록에 추가하면 더 안전해
  if (
    location.pathname === "/login" ||
    location.pathname === "/signup" ||
    location.pathname === "/"
  )
    return null;

  return (
    <nav className="pixel-nav-container">
      <div className="pixel-nav-bar">
        <Link
          to="/dashboard"
          className="nav-logo-small"
          style={{ textDecoration: "none" }}
        >
          <span className="logo-text">Pocket Life</span>
        </Link>
        <div className="nav-tabs">
          <Link
            to="/dashboard"
            className={`nav-tab ${
              location.pathname === "/dashboard" ? "active" : ""
            }`}
          >
            대시보드
          </Link>
          <div className="nav-divider"></div>
          <Link
            to="/meal"
            className={`nav-tab ${
              location.pathname === "/meal" ? "active" : ""
            }`}
          >
            식단 관리
          </Link>
          <div className="nav-divider"></div>
          <Link
            to="/shopping"
            className={`nav-tab ${
              location.pathname === "/shopping" ? "active" : ""
            }`}
          >
            장바구니
          </Link>
          <div className="nav-divider"></div>
          <Link
            to="/schedule"
            className={`nav-tab ${
              location.pathname === "/schedule" ? "active" : ""
            }`}
          >
            일정
          </Link>
          <div className="nav-divider"></div>
          <Link
            to="/account"
            className={`nav-tab ${
              location.pathname === "/account" ? "active" : ""
            }`}
          >
            가계부
          </Link>
        </div>
        <div className="nav-user-info">ㅇㅇ님 반갑습니다.</div>
      </div>
    </nav>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Nav />
      <main className="main-content">
        <Routes>
          {/* [임시수정] 첫 접속 시 로그인 페이지가 나오도록 설정 */}
          <Route path="/" element={<Login />} />

          {/* 나중에 팀원들과 합칠 때 위 줄을 지우고 아래 줄 주석을 푸세요 */}
          {/* <Route path="/" element={<Home />} /> */}

          <Route path="/dashboard" element={<Home />} />
          <Route path="/meal" element={<Meal />} />
          <Route path="/shopping" element={<Shopping />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route
            path="/schedule"
            element={
              <div
                className="pixel-card"
                style={{ textAlign: "center", padding: "50px" }}
              >
                <h3>📅 일정 페이지 준비중...</h3>
              </div>
            }
          />
          <Route
            path="/account"
            element={
              <div
                className="pixel-card"
                style={{ textAlign: "center", padding: "50px" }}
              >
                <h3>💸 가계부 페이지 준비중...</h3>
              </div>
            }
          />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
