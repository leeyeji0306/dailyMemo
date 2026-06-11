import "./SignInLogIn.css";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "./supabase";
import { useState } from "react";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function clickSignInButton() {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      alert("로그인에 실패하였습니다.");
      console.error(error);
    }

    if (data) {
      alert("로그인을 완료했습니다!");

      setEmail("");
      setPassword("");
    }
  }
  return (
    <>
      <div className="container">
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
