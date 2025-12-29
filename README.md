# 💧 Pocket Life (포켓 라이프)

### 📖 프로젝트 소개

일상의 소소한 기록을 관리하는 귀여운 웹 애플리케이션입니다.
식단 기록, 장보기 메모 등 생활에 필요한 기능을 직관적인 디자인(Jua 폰트, 파스텔 톤)으로 제공합니다.

---

### 🛠 기술 스택 (Tech Stack)

- **Frontend**: React (Vite), React-Router-Dom, Axios
- **Backend**: Java 17, Spring Boot, Spring Data JPA
- **Database**: MySQL
- **Styling**: Custom CSS (Retro.css)
- **Tool**: VS Code, IntelliJ, MySQL Workbench, Git/GitHub

---

### 📂 주요 기능

1.  **대시보드 (Home)**

    - 📅 **날짜 이동**: 날짜별 기록 현황을 실시간으로 확인
    - 📊 **요약 정보**: 오늘의 식단 횟수, 최근 먹은 메뉴, 장보기 잔여 개수 표시

2.  **식단 관리 (Meal)**

    - 🍚 **카테고리 분류**: 아침 / 점심 / 저녁 / 간식 버튼으로 쉽게 분류
    - 🔄 **날짜별 기록**: 캘린더 처럼 날짜를 이동하며 과거 식단 확인 가능
    - 📝 **데이터 연동**: DB에 저장되어 새로고침 해도 데이터 유지

3.  **장보기 (Shopping)**
    - 🛒 **구매 체크**: '구매완료' 버튼을 누르면 상태 변경 (초록색 텍스트 변환)
    - 🗑 **리스트 관리**: 날짜별로 필요한 물품 기록 및 삭제 기능

---

### 🚀 시작 가이드 (Getting Started)

팀원분들은 아래 순서대로 실행해주세요! (DB -> 백엔드 -> 프론트엔드 순서)

**1. 데이터베이스 설정 (MySQL)**

- MySQL Workbench를 켜고 `life_manager` 스키마를 생성하세요.
- 프로젝트에 포함된 SQL 코드를 실행하여 `meal`, `shopping_item` 테이블을 만드세요.

**2. 백엔드 실행 (Spring Boot)**

- `backend` 폴더를 IntelliJ로 엽니다.
- `BackendApplication.java` 파일을 찾아 실행(Run) 합니다.
- 콘솔에 `Started BackendApplication`이 뜨면 성공!

**3. 프론트엔드 실행 (React)**

```bash
# 프로젝트 폴더로 이동
cd vite-project

# 의존성 설치 (최초 1회)
npm install

# 개발 서버 실행
npm run dev
```
