// Create a user Login/signup page
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase-database/config";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";


const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        navigate("/");
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        navigate("/");
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  return (
    <div className="auth">
      <h2>{isLogin ? "Login" : "Sign Up"}</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          className="auth-form-input"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          className="auth-form-input"
        />
        <button type="submit" className="auth-form-btn">
          {isLogin ? "Login" : "Sign Up"}
        </button>
      </form>
      <button onClick={() => setIsLogin(!isLogin)} className="auth-switch-btn">
        {isLogin ? "Switch to Sign Up" : "Switch to Login"}
      </button>
    </div>

    
  );
};

export default Auth;
