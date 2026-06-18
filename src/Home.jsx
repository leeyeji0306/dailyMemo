import Card from "./Card";
import "./Home.css";
import { Link } from "react-router-dom";
import { supabase } from "./supabase";
import { useEffect, useState } from "react"; // 💡 useState 추가!

const Home = () => {
  // 1. 상태(state) 선언
  const [posts, setPosts] = useState([]);

  // 날짜 계산 로직을 컴포넌트 상단에 배치
  let date = new Date();
  let fullDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

  // 2. 데이터 로딩 함수를 컴포넌트 내부의 정상적인 위치로 이동
  const postLoading = async () => {
    try {
      const { data: postData, error: postError } = await supabase
        .from("diaries")
        .select(
          `
          id, 
          photo_url,
          content,
          date,
          profiles (
            id,
            nickname
          )
        `,
        )
        .eq("date", fullDate)
        .order("created_at", { ascending: false });

      if (postError) throw postError;

      let tempPosts = [];

      // 일기 데이터가 있으면 태그를 매핑해서 채워 넣음
      if (postData) {
        for (let post of postData) {
          const { data: tagsData, error: tagsError } = await supabase
            .from("diary_tags")
            .select(
              `
              tags (
                name
              )
            `,
            )
            .eq("diary_id", post.id);

          if (tagsError) {
            console.error("태그를 불러오지 못했습니다 ㅠ.ㅠ", tagsError);
            continue;
          }

          // 구조 분해 할당 에러 방지를 위한 안전 장치 처리
          const nickname = post.profiles ? post.profiles.nickname : "익명";

          // tagsData 예시: [{ tags: { name: "일상" } }, { tags: { name: "코딩" } }]
          const tags_name = tagsData
            ? tagsData.map((t) => t.tags && t.tags.name).filter(Boolean)
            : [];
          tempPosts.push({
            id: post.id,
            user_id: post.profiles.id,
            nickname: nickname,
            photo_url: post.photo_url,
            content: post.content,
            date: post.date,
            tags_name: tags_name,
          });
        }
      }

      // 3. 가공이 끝난 임시 배열을 진짜 상태(State)에 집어넣어 화면을 그리게 만듦
      setPosts(tempPosts);
    } catch (error) {
      console.error("전체 포스트 로딩 중 오류 발생:", error.message);
    }
  };

  //4. useEffect는 함수 안이 아니라 이렇게 컴포넌트 최상단에 떡하니 배치해야 함
  useEffect(() => {
    const init = async () => {
      await postLoading();
    };
    init();
  }, []); // 의존성 배열을 비워두어 컴포넌트가 켜질 때 딱 한 번만 실행되도록 보장

  return (
    <div>
      <main>
        <h1>Today's Post</h1>
        <div className="card-grid">
          {posts && posts.length > 0
            ? posts.map((post) => {
                return (
                  <Link
                    to={`/detail/${post.id}`}
                    state={{ postData: post }}
                    key={post.id}
                  >
                    <Card post={post} />
                  </Link>
                );
              })
            : ""}
        </div>
      </main>
    </div>
  );
};

export default Home;
