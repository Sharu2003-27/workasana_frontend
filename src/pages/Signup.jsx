import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import API from "../api/axios";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false)

  const navigate = useNavigate();

  const handleSignup = async (event) => {
    event.preventDefault();
    try {
      const res = await API.post("/auth/signup", { name, email, password });
      alert("Signup successful! Please login.");
      navigate("/login");
    } catch (err) {
      console.error("Signup Error:", err);
      alert(err.response?.data?.error || "Signup failed. The server might be having issues.");
    }
  };

  return (
    <div className="page">
      <form className="main-card" onSubmit={handleSignup}>
        <div className="login-card">
          <h1>Welcome to Workasana!</h1>
          <h2>Signup</h2>

          <label>Name</label>
          <input
            type="text"
            required
            onChange={(e) => setName(e.target.value)}
          />

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

          <button type="submit">Create Account</button>

          <p className="signup-login">
            Already have an account?{" "}
            <span
              className="signup-btn"
              onClick={() => navigate("/login")}
            >
              Login
            </span>
          </p>
        </div>
      </form>
    </div>
  );
}

export default Signup;
