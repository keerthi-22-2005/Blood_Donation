import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../Context/authContext"; // Import AuthContext
import DonorRegister from "../donorRegister/donorRegister"; // Import the Donor modal component
import RecipientRegister from "../donorRegister/recipientRegister"; // Import the Recipient modal component
import Swal from "sweetalert2"; // For popups

export default function Home() {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext); // Get user data from AuthContext

    // Handle Donor Button Click
    const handleDonorClick = () => {
        if (user) {
            document.getElementById("openDonorModal").click(); // Trigger Donor modal manually
        } else {
            Swal.fire({
                title: "Access Denied!",
                text: "Please login first to donate blood.",
                icon: "warning",
                confirmButtonText: "Login Now",
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate("/login"); // Redirect to login page
                }
            });
        }
    };

    // Handle Recipient Button Click
    const handleRecipientClick = () => {
        if (user) {
            document.getElementById("openRecipientModal").click(); // Trigger Recipient modal manually
        } else {
            Swal.fire({
                title: "Access Denied!",
                text: "Please login first to request blood.",
                icon: "warning",
                confirmButtonText: "Login Now",
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate("/login"); // Redirect to login page
                }
            });
        }
    };

    return (
        <div 
            className="container-fluid d-flex flex-column align-items-center justify-content-center min-vh-100 text-center"
            style={{
                backgroundImage: "url('https://t3.ftcdn.net/jpg/01/37/30/90/360_F_137309034_4oK5BoYqUc7sUoNor1ltGW0PAYNzExK9.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                minHeight: "100vh",
            }}
        >
            {/* Main Content */}
            <div className="position-relative w-100 px-3 text-center">
                <h1 className="text-danger fw-bold" style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.8)" }}>
                    Welcome To Blood Donation Management System ❤️🩸
                </h1>
                <p className="lead text-dark fw-bold mb-4 mx-auto w-50">
                    🌟 Donating blood is a simple act of kindness that can save countless lives.
                    A few minutes of your time can bring hope and healing to someone in need. 🌟
                </p>

                {/* Flex container for images and buttons */}
                <div className="d-flex justify-content-center align-items-start gap-5 flex-wrap w-100">
                    {/* Become a Donor Section */}
                    <div className="d-flex flex-column align-items-center justify-content-between">
                        <img 
                            src="https://png.pngtree.com/png-vector/20210601/ourlarge/pngtree-blood-donation-line-art-concept-png-image_3401794.jpg" 
                            alt="Donate Blood" 
                            className="img-fluid w-100"
                            style={{ maxHeight: "300px", objectFit: "contain" }}
                        />
                        <button 
                            className="btn btn-success mt-3 px-4 py-2 fw-bold" 
                            onClick={handleDonorClick}
                        >
                            Become a Donor
                        </button>
                    </div>

                    {/* Need Blood Section */}
                    <div className="d-flex flex-column align-items-center justify-content-between">
                        <img 
                            src="https://png.pngtree.com/png-vector/20210528/ourlarge/pngtree-give-blood-and-save-a-life-vector-design-png-image_3371837.jpg" 
                            alt="Need Blood" 
                            className="img-fluid w-100"
                            style={{ maxHeight: "300px", objectFit: "contain" }}
                        />
                        <button 
                            className="btn btn-danger mt-3 px-4 py-2 fw-bold" 
                            onClick={handleRecipientClick}
                        >
                            Need Blood
                        </button>
                    </div>
                </div>
            </div>

            {/* Hidden Buttons to Trigger Modals */}
            <button id="openDonorModal" className="d-none" data-bs-toggle="modal" data-bs-target="#donorModal"></button>
            <button id="openRecipientModal" className="d-none" data-bs-toggle="modal" data-bs-target="#recipientModal"></button>

            {/* Include Donor & Recipient Modals */}
            <DonorRegister />
            <RecipientRegister />
        </div>
    );
}
