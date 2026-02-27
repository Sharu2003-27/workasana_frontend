import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import API from "../api/axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const res = await API.post("/auth/login", { email, password });
      alert("Login successful");
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      console.error("Login Error:", err);
      alert(err.response?.data?.error || "Login failed. Check your connection.");
    }
  };

  return (
    <div className="page">
      <form className="main-card" onSubmit={handleLogin}>
        <div className="login-card">
          <h1>Welcome to Workasana!</h1>
          <h2>Login</h2>

          <label>Email</label>
          <input
            type="email"
            required
            onChange={(e) => setEmail(e.target.value)}
          />

          <label>Password</label>
          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              required
              onChange={(e) => setPassword(e.target.value)}
            />

            <span
              className="eye-icon"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <button type="submit">Sign In</button>

          <p className="signup-label">Don't have an account?</p>
          <p className="signup-btn">
            <span onClick={() => navigate("/signup")}>
              Sign Up
            </span>
          </p>
        </div>
      </form>
    </div>
  );
}

export default Login;
