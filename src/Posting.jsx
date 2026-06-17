import { useState } from "react";
import "./Posting.css";
import { supabase } from "./supabase";

const Posting = () => {
  const [imageURL, setImageURL] = useState(null); // 브라우저 미리보기용 주소 (blob)
  const [rawFile, setRawFile] = useState(null); // 💡 Supabase 스토리지에 보낼 진짜 파일 객체
  const [content, setContent] = useState("");
  const [tags, setTags] = useState(""); // input value가 문자열이므로 초기값을 ""로 변경
  let user = JSON.parse(localStorage.getItem("user"));
  let user_id = user.id;
  const user_name = user.name;

  // 파일 선택 시 처리
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // 💡 진짜 파일 객체를 상태에 보관
    setRawFile(file);

    // 이전 Object URL 메모리 해제 및 새 미리보기 주소 생성
    if (imageURL) URL.revokeObjectURL(imageURL);
    const objectUrl = URL.createObjectURL(file);
    setImageURL(objectUrl);
  };

  async function shareButtonClick() {
    if (!rawFile) {
      alert("사진을 업로드해 주세요!");
      return;
    }

    // 💡 공백 태그나 빈 문자열을 걸러내는 작업 (.filter(Boolean) 추가)
    // 예: "#일기 #일상 #" -> ["일기", "일상"] 깔끔하게 정제됨
    let resultTags = tags
      .split("#")
      .map((tag) => tag.trim())
      .filter(Boolean);

    let date = new Date();

    let fullDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

    const fileExt = rawFile.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `diaries_images/${fileName}`;

    // 1. 오늘 이미 작성했는지 확인
    const { data: checkOnceData, error: checkOnceError } = await supabase
      .from("diaries")
      .select("*")
      .eq("user_id", user_id)
      .eq("date", fullDate);

    if (checkOnceError) {
      console.error("값 검증 실패: ", checkOnceError);
      return;
    }

    if (checkOnceData && checkOnceData.length > 0) {
      alert("오늘 이미 일기를 작성하셨습니다!");
      return;
    }

    // 2. 파일 업로드
    const { data: imageSaveData, error: imageSaveError } =
      await supabase.storage.from("photos").upload(filePath, rawFile);

    if (imageSaveError) {
      console.error("스토리지 저장 실패:", imageSaveError);
      alert("사진 저장에 실패했습니다.");
      return;
    }

    console.log("사진을 스토리지에 저장했습니다!");

    // 3. 스토리지 URL 가져오기
    const { data: publicUrlData } = supabase.storage
      .from("photos")
      .getPublicUrl(filePath);

    const storageImageURL = publicUrlData.publicUrl;
    console.log("스토리지 사진 불러오기 성공:", storageImageURL);

    // 4. DB 테이블에 게시글 insert
    const { data: diariesData, error: diariesError } = await supabase
      .from("diaries")
      .insert([
        {
          content: content,
          user_id: user_id,
          date: fullDate,
          photo_url: storageImageURL,
        },
      ])
      .select();

    if (diariesError) {
      console.error("게시글 저장 실패:", diariesError);
      alert("게시글 저장 중 오류가 발생했습니다.");
      return;
    }

    alert("게시글이 성공적으로 저장되었습니다! 🎉");

    // 💡 1번 수정: diariesData는 '배열'이므로 [0]번째 아이템에서 id를 추출해야 함!
    // 💡 1. diariesData는 '배열'이므로 [0]번째 아이템에서 id를 추출해야 함!
    const diary_id = diariesData[0].id;

    // 💡 매핑할 태그들의 id만 모아둘 배열 선언
    const finalTagIds = [];

    // [1단계] tags 테이블에 태그들 먼저 안전하게 '전부' 저장하고 id만 싹 모으기
    for (const tag of resultTags) {
      // 이미 존재하는지 체크 후 처리하는 로직 (기존 로직 유지)
      const { data: existingTag, error: findError } = await supabase
        .from("tags")
        .select("id")
        .eq("name", tag);

      if (findError) {
        console.error("태그 조회 중 오류:", findError);
        continue;
      }

      if (existingTag && existingTag.length > 0) {
        finalTagIds.push(existingTag[0].id);
        console.log(`기존 태그 발견: [${tag}] -> id: ${existingTag[0].id}`);
      } else {
        const { data: newTagData, error: tagsError } = await supabase
          .from("tags")
          .insert({ name: tag })
          .select();

        if (tagsError) {
          console.error(`${tag} 태그 신규 저장 실패:`, tagsError);
          continue;
        }
        finalTagIds.push(newTagData[0].id);
        console.log(`신규 태그 저장: [${tag}] -> id: ${newTagData[0].id}`);
      }
    }

    // 💡 [2단계] 확보된 tag_id 배열을 가지고 diary_tags 매핑 테이블에 '한 번에 몽땅' 집어넣기!
    // Supabase는 배열을 인서트하면 여러 행(Row)을 한 번에 Bulk Insert 해줘서 누락이 절대 안 생겨!
    if (finalTagIds.length > 0) {
      // 인서트할 대량의 매핑 객체 배열 만들기
      // 예: [{ diary_id: 5, tag_id: 1 }, { diary_id: 5, tag_id: 2 }]
      const mappingRows = finalTagIds.map((tId) => ({
        diary_id: diary_id,
        tag_id: tId,
      }));

      console.log("매핑 테이블에 보낼 최종 데이터 배열:", mappingRows);

      const { data: mappingData, error: mappingError } = await supabase
        .from("diary_tags")
        .insert(mappingRows); // 👈 반복문 돌리지 않고 통째로 주입!

      if (mappingError) {
        console.error(
          "❌ 매핑 테이블 저장 실패 원인!! :",
          mappingError.message,
        );
        console.error("에러 코드:", mappingError.code);
        console.error("에러 디테일:", mappingError.details);
        alert(`매핑 저장 실패: ${mappingError.message}`);
      } else {
        console.log(
          "🎉 모든 태그가 매핑 테이블에 완벽하게 일괄 연결되었습니다!",
        );
      }
    }

    // 모든 작업이 순서대로 끝난 뒤에 깔끔하게 입력창 비워주기
    setContent("");
    setTags("");
    setImageURL(null);
    setRawFile(null);
  }

  return (
    <div>
      <main>
        <div className="posting-wrap">
          <div className="posting-box">
            <div className="posting-header">
              <span className="posting-title">새 게시물 만들기</span>
              <button className="share" onClick={shareButtonClick}>
                공유하기
              </button>
            </div>
            <div className="posting-body">
              <div className="posting-photo">
                {imageURL ? (
                  <img src={imageURL} alt="업로드된 이미지" />
                ) : (
                  <label htmlFor="file-input" className="upload-placeholder">
                    <span>+</span>
                    <p>사진을 업로드하세요</p>
                  </label>
                )}

                <input
                  id="file-input"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>

              <div className="posting-right">
                <div className="posting-content">
                  <div className="posting-author">
                    <img
                      src="src/assets/프로필.png"
                      className="posting-avatar"
                      alt="Avatar"
                    />
                    <span className="posting-name">{user_name}</span>
                  </div>
                  <textarea
                    className="posting-text"
                    placeholder="(본문 내용 넣기)"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  ></textarea>
                </div>
                <div className="posting-tags">
                  <input
                    type="text"
                    placeholder="#태그 입력"
                    value={tags}
                    onChange={(e) => {
                      setTags(e.target.value);
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Posting;
