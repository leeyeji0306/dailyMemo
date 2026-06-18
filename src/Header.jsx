import "./Header.css"; // 헤더 전용 스타일 로드
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  // 메뉴 바(드롭다운)와 모달창의 열림/닫힘 상태 관리
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 헤더를 숨기고 싶은 페이지들의 경로(Path)를 배열로 등록!
  const excludePaths = ["/", "/SignUp"];

  // 현재 주소가 배열에 포함되어 있다면, 아무것도 렌더링하지 않음(null)
  if (excludePaths.includes(location.pathname)) {
    return null;
  }

  const user = JSON.parse(localStorage.getItem("user"));
  const user_name = user.name;

  // 로그아웃 '네' 버튼을 눌렀을 때 실행될 함수
  const handleLogoutConfirm = () => {
    alert("로그아웃 되었습니다.");
    setIsModalOpen(false); // 모달 닫기
    setIsMenuOpen(false); // 메뉴 바 닫기
    localStorage.clear();
    navigate("/"); // 로그인 페이지로 이동
  };

  return (
    <>
      <header>
        {/* 로고 영역 */}
        <Link to="/home" style={{ cursor: "pointer" }}>
          <div className="logo">Daily Memo</div>
        </Link>

        <nav>
          <Link
            to="/home"
            style={{ fontWeight: currentPath === "/home" ? "bold" : "normal" }}
          >
            <div>Home</div>
          </Link>
          <Link
            to="/explore"
            style={{
              fontWeight: currentPath === "/explore" ? "bold" : "normal",
            }}
          >
            <div>Explore</div>
          </Link>
          <Link
            to="/posting"
            style={{
              fontWeight: currentPath === "/posting" ? "bold" : "normal",
            }}
          >
            <div>Posting</div>
          </Link>

          {/*프로필 영역 (클릭하면 토글 메뉴 바가 나옵니다) */}
          <div className="profile-wrapper">
            <img
              src="src/assets/프로필.png"
              className="profile"
              alt="Profile"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            />

            {/* 프로필 드롭다운 메뉴 바 */}
            {isMenuOpen && (
              <div className="profile-dropdown">
                <div className="dropdown-item user-info-header">
                  <strong>{user_name}</strong>님
                </div>
                <hr className="dropdown-divider" />
                <button
                  className="dropdown-item logout-btn"
                  onClick={() => setIsModalOpen(true)}
                >
                  로그아웃
                </button>
              </div>
            )}
          </div>
        </nav>
      </header>

      {/*로그아웃 확인 모달창 */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="logout-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Log Out</h3>
            <p>Are you sure you want to log out?</p>
            <div className="modal-actions">
              <button
                className="modal-btn cancel"
                onClick={() => setIsModalOpen(false)}
              >
                No
              </button>
              <button
                className="modal-btn confirm"
                onClick={handleLogoutConfirm}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
