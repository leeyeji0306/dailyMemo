import "./Header.css"; // 헤더 전용 스타일 로드
import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  return (
    <>
      <header>
        <Link
          to="/"
          className="logo"
          onClick={() => {
            location("/");
          }}
          style={{ cursor: "pointer" }}
        >
          <div>Daily Memo</div>
        </Link>
        <nav>
          <Link
            to="/"
            style={{
              cursor: "pointer",
              fontWeight: currentPath === "/" ? "bold" : "normal",
            }}
            onClick={() => {
              location("/");
            }}
          >
            <div>Home</div>
          </Link>
          <Link
            to="/explore"
            style={{
              cursor: "pointer",
              fontWeight: currentPath === "/explore" ? "bold" : "normal",
            }}
            onClick={() => {
              location("/explore");
            }}
          >
            <div>Explore</div>
          </Link>
          <Link
            to="/posting"
            style={{
              cursor: "pointer",
              fontWeight: currentPath === "/posting" ? "bold" : "normal",
            }}
            onClick={() => {
              location("/explore");
            }}
          >
            <div>Posting</div>
          </Link>
          <div className="search-box">
            <input type="text" placeholder="Search in site" />
          </div>
          <img src="src/assets/프로필.png" className="profile" alt="Profile" />
        </nav>
      </header>
    </>
  );
};

export default Header;
