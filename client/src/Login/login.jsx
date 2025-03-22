import { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../Context/authContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://blood-donation-back-piab.onrender.com/api/auth/login", formData);
      const { token, user } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("userId", user.id);
      localStorage.setItem("username", user.username);
      localStorage.setItem("email", user.email);
      localStorage.setItem("mobile", user.mobile);

      setUser({ token, ...user });
      setMessage("Login successful");
      navigate("/");
    } catch (error) {
      setMessage(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center min-vh-100"
      style={{
        backgroundImage: "url('https://cdn.storymd.com/optimized/Ro6kepcXdx/thumbnail.png')",
        backgroundSize :"cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Overlay */}
      <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark opacity-50"></div>

      <div className="card p-4 shadow-lg position-relative" style={{ width: "400px", backgroundColor: "rgba(255, 255, 255, 0.9)", borderRadius: "10px" }}>
        <h2 className="text-center text-primary fw-bold mb-3">Login</h2>
        {message && <p className="text-center text-danger fw-bold">{message}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-bold">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter email"
              value={formData.email}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label fw-bold">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100 fw-bold">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
