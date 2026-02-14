import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();

    const res = await fetch("https://workasana-backend-puce.vercel.app/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      alert("Login successful");
      localStorage.setItem("token", data.token);
      navigate("/dashboard");
    } else {
      alert(data.error);
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
