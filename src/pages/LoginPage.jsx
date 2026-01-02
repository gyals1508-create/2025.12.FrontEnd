import React, { useState } from "react";
import Modal from "../components/Modal";

export default function LoginPage({ onGoSignup, onLoginSuccess }) {
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");

  const [m, setM] = useState({
    open: false,
    title: "",
    msg: "",
    showCancel: false,
    confirmText: "확인",
    cancelText: "취소",
    onConfirm: null,
    onCancel: null,
  });

  const close = () => setM((s) => ({ ...s, open: false }));

  const openAskSignup = () => {
    setM({
      open: true,
      title: "로그인 실패",
      msg: "아이디/비밀번호가 없거나 맞지 않습니다.\n회원이 아니시라면 가입 하시겠습니까?",
      showCancel: true,
      confirmText: "회원가입",
      cancelText: "취소",
      onConfirm: () => {
        close();
        onGoSignup?.();
      },
      onCancel: close,
    });
  };

  const openOk = (msg, after) => {
    setM({
      open: true,
      title: "안내",
      msg,
      showCancel: false,
      confirmText: "확인",
      cancelText: "취소",
      onConfirm: () => {
        close();
        after?.();
      },
      onCancel: close,
    });
  };

  const login = (e) => {
    e.preventDefault();
    if (!id || !pw) return openAskSignup();

    const raw = localStorage.getItem("mock_user");
    if (!raw) return openAskSignup();

    const user = JSON.parse(raw);
    if (user.id !== id || user.pw !== pw) return openAskSignup();

    localStorage.setItem("mock_token", "mock-" + Date.now());
    openOk("로그인 성공", () => {
      setId("");
      setPw("");
      onLoginSuccess?.();
    });
  };

  return (
    <>
      <form onSubmit={login} className="form">
        <div className="panelTitle">로그인</div>

        <div className="field">
          <span className="icon">
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm0 2c-4.4 0-8 2.2-8 5v1h16v-1c0-2.8-3.6-5-8-5Z" />
            </svg>
          </span>
          <input
            className="input"
            value={id}
            onChange={(e) => setId(e.target.value)}
            placeholder="아이디"
          />
        </div>

        <div className="field">
          <span className="icon">
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path d="M17 10h-1V8a4 4 0 0 0-8 0v2H7a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2Zm-7-2a2 2 0 0 1 4 0v2h-4Z" />
            </svg>
          </span>
          <input
            className="input"
            type="password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            placeholder="비밀번호"
          />
        </div>

        <button className="primaryBtn" type="submit">
          로그인
        </button>

        <div className="miniLinks">
          <button type="button" className="miniLink">
            아이디 찾기
          </button>
          <span className="dot" />
          <button type="button" className="miniLink">
            비밀번호 찾기
          </button>
          <span className="dot" />
          <button type="button" className="miniLink" onClick={onGoSignup}>
            회원가입
          </button>
        </div>

        <div className="dividerRow">
          <div className="hr" />
          <div className="or">소셜 로그인</div>
          <div className="hr" />
        </div>

        <div className="socialRow">
          {/* [수정] 요청하신 구글 이미지 태그로 교체 */}
          <button type="button" className="social google" aria-label="Google">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
              alt="Google"
              style={{ width: "30px", cursor: "pointer" }}
            />
          </button>

          <button type="button" className="social naver" aria-label="Naver">
            N
          </button>
        </div>

        <div className="bottomLink">
          계정이 없으신가요?{" "}
          <button type="button" className="bottomBtn" onClick={onGoSignup}>
            회원가입 &gt;
          </button>
        </div>
      </form>

      <Modal
        open={m.open}
        title={m.title}
        message={m.msg}
        showCancel={m.showCancel}
        confirmText={m.confirmText}
        cancelText={m.cancelText}
        onConfirm={m.onConfirm}
        onCancel={m.onCancel}
      />
    </>
  );
}
