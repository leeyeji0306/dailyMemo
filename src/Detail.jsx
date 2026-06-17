import "./Detail.css";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import defaultProfile from "/src/assets/프로필.png";
import { supabase } from "./supabase";

const Detail = () => {
  // useParams로 주소창의 id를 가져옵니다 (예: /detail/3 이면 id는 "3")
  const { id } = useParams();

  const location = useLocation();

  const { postData } = location.state || {};

  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const user_id = user.id;
  const isOwner = postData?.user_id === user_id;
  const post = postData
    ? {
        id: postData.id,
        nickname: postData.nickname,
        user_id: postData.user_id,
        content: postData.content,
        // Home.jsx에서 보낸 이름이 tags_name이므로 안전하게 매칭
        tags: postData.tags_name || [],
        imageUrl: postData.photo_url,
        date: postData.date,
      }
    : {
        nickname: "Not-found",
        content: "데이터를 불러오지 못했습니다.",
        tags: [],
        imageUrl: "",
        date: "",
      };

  const editButtonClick = async () => {
    const { data: userCheckData, error: userCheckError } = await supabase
      .from("diaries")
      .select("id, profiles(id)")
      .eq("id", id)
      .eq("user_id", user_id);

    if (userCheckError) {
      console.log("유저 데이터를 불러오지 못했습니다.");
      console.error(userCheckError);
    } else if (!userCheckData) {
      alert("게시글을 쓴 사람만 수정할 수 있습니다!");
    } else {
      navigate(`/edit/${id}`, { state: { post: post } });
    }
  };

  return (
    <main className="detail-container">
      {/* 💡 테스트용 ID 확인 (필요 없으면 이 한 줄은 지워도 돼!) */}
      <p
        style={{
          color: "#ccc",
          fontSize: "12px",
          alignSelf: "flex-start",
          paddingLeft: "65px",
        }}
      >
        Post ID: {id}
      </p>

      {/* 1. 상단 이미지 슬라이더 영역 */}
      <section className="image-slider-section">
        <div className="detail-image-box">
          {post.imageUrl ? (
            <img src={post.imageUrl} alt="Detail" className="detail-img" />
          ) : (
            <div className="empty-image-placeholder" />
          )}
        </div>
      </section>

      {/* 2. 하단 게시글 정보 영역 */}
      <section className="post-info-section">
        {/* 프로필 및 타이틀 */}
        <div className="post-author-box">
          <div className="author-avatar-large">
            {/* 💡 요청한 로컬 기본 프로필 사진 경로로 수정했어! */}
            <img src={defaultProfile} alt="Profile" />
          </div>
          <div className="title-and-date-wrapper">
            <h2 className="post-title">{post.nickname}</h2>
            <span className="post-date">{post.date}</span>
          </div>
        </div>

        {/* 태그 리스트 */}
        <div className="post-tags">
          {post["tags"].map((tag, index) => (
            <span key={index} className="post-tag">
              #{tag}
            </span>
          ))}
        </div>

        {/* 본문 내용 */}
        <p className="post-content">{post.content}</p>

        {/* 수정 / 삭제 버튼 메뉴 */}
        {isOwner ? (
          <div className="post-actions">
            <button className="action-btn edit-btn" onClick={editButtonClick}>
              수정
            </button>
          </div>
        ) : (
          ""
        )}
      </section>
    </main>
  );
};

export default Detail;
