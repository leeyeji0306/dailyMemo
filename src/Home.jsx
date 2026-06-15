import Card from "./Card";
import "./Home.css"; // 홈 화면 및 카드 그리드 스타일 로드
import { Link } from "react-router-dom";

const Home = () => {
  const posts = [
    {
      id: 1,
      nickname: "이예지",
      content: "하하하하",
      tagname: ["집", "가고", "싶다"],
      date: "2026-06-14",
    },
    {
      id: 2,
      nickname: "이예지",
      content: "하하하하",
      tagname: ["학교", "왜사냐", "죽어라"],
      date: "2026-06-14",
    },
    {
      id: 3,
      nickname: "이예지",
      content: "하하하하",
      tagname: ["게임", "하고", "싶다"],
      date: "2026-06-14",
    },
    {
      id: 4,
      nickname: "이예지",
      content: "ㅎㄵㄷㄱㅀ오ㅓㅇㄴㄷ",
      tagname: ["일", "하기", "싫다"],
      date: "2026-06-14",
    },
  ];
  return (
    <div>
      <main>
        <h1>Today's Post</h1>
        <div className="card-grid">
          {posts.map((post) => {
            return (
              <Link to={`/detail/${post.id}`} state={{ postData: post }}>
                <Card key={post.id} post={post} />
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default Home;
