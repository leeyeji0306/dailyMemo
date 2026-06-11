import React from "react";
import "./Header.css"; // 헤더 전용 스타일 로드

const Header = ({ page, setPage }) => {
  return (
    <header>
      {/* 로고를 눌러도 홈 화면으로 이동하게 합니다 */}
      <div
        className="logo"
        onClick={() => setPage("Home")}
        style={{ cursor: "pointer" }}
      >
        Daily Memo
      </div>
      <nav>
        {/* href를 제거하고 onClick 이벤트를 연결하여 새로고침 없이 리액트 상태를 바꿉니다 */}
        <a
          style={{
            cursor: "pointer",
            fontWeight: page === "Home" ? "bold" : "normal",
          }}
          onClick={() => setPage("Home")}
        >
          Home
        </a>
        <a
          style={{
            cursor: "pointer",
            fontWeight: page === "Explore" ? "bold" : "normal",
          }}
          onClick={() => setPage("Explore")}
        >
          Explore
        </a>
        <a
          style={{
            cursor: "pointer",
            fontWeight: page === "Posting" ? "bold" : "normal",
          }}
          onClick={() => setPage("Posting")}
        >
          Posting
        </a>
      </nav>
      <div className="search-box">
        <input type="text" placeholder="Search in site" />
      </div>
      <img src="src/assets/프로필.png" className="profile" alt="Profile" />
    </header>
  );
};

export default Header;
