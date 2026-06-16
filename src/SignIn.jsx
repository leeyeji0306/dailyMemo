import "./SignInLogIn.css";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "./supabase";
import { useState } from "react";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function clickSignInButton() {
    const { data: signInData, error: signInError } =
      await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

    if (signInError) {
      alert("로그인에 실패하였습니다.");
      console.error(signInError);
    }

    if (signInData) {
      alert("로그인을 완료했습니다!");
      console.log(signInData);
      const userId = signInData.user.id;
      const { data: nicknameGetData, error: nicknameGetError } = await supabase
        .from("profiles")
        .select()
        .eq("id", userId);
      const userName = nicknameGetData[0].nickname;
      let userInfo = {
        id: userId,
        name: userName,
        email: email,
      };
      localStorage.setItem("user", JSON.stringify(userInfo));
      navigate("/home");
    }

    setEmail("");
    setPassword("");
  }
  return (
    <>
      <div className="signin-container">
        <div className="left">
          <div className="form-area">
            <h1>Login</h1>

            <label>Email</label>
            <input
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              type="email"
              placeholder="example@gmail.com"
            />

            <label>Password</label>
            <input
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              type="password"
              placeholder="Enter your password"
            />

            <button className="main-btn" onClick={clickSignInButton}>
              Login
            </button>

            <div className="switch-page">
              Create an account
              <Link to="/SignUp">Signup</Link>
            </div>
          </div>
        </div>

        <div className="right planner">
          <div className="planner-line"></div>

          <div className="planner-title">
            <h2>PLANNER</h2>
            <p>Daily Memo</p>
          </div>
        </div>
      </div>
    </>
  );
}
