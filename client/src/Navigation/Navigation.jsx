import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Navigation() {
  const { user, logout } = useContext(AuthContext); // Access user state and logout function

  return (
    <nav className="navbar navbar-expand-lg navbar-danger bg-danger px-4 py-2">
      <div className="container-fluid d-flex justify-content-between align-items-center">
        
        {/* Left Section - Home, Appointments, and Request Details */}
        <div className="d-flex align-items-center gap-3">
          <Link to="/" className="navbar-brand text-white fw-bold fs-4">
            Home
          </Link>

          {/* Show Appointments & Request Details only when user is logged in */}
          {user && (
            <>
              <Link to="/donorAppointment" className="btn btn-light fw-bold">
                Appointments
              </Link>
              <Link to="/requestDetails" className="btn btn-light fw-bold">
                Request Details
              </Link>
            </>
          )}
        </div>

        {/* Right Section - Signup/Login OR Logout */}
        <div className="d-flex align-items-center gap-3">
          {user ? (
            <button onClick={logout} className="btn btn-light fw-bold">
              Logout
            </button>
          ) : (
            <>
              <Link to="/register" className="btn btn-light fw-bold">
                Signup
              </Link>
              <Link to="/login" className="btn btn-light fw-bold">
                Login
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
