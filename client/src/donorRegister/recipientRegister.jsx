import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../Context/authContext";
import Swal from "sweetalert2";

const RecipientRegister = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    age: "",
    bloodGroup: "",
    address: "",
    contactNumber: "",
    requiredDate: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Handle input changes properly
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value, // Ensures all fields, including time, update correctly
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user || !user.token) {
      Swal.fire({
        title: "Login Required",
        text: "You must be logged in to request blood.",
        icon: "warning",
        confirmButtonText: "Login Now",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/login");
        }
      });
      return;
    }

    // Validation
    if (Object.values(formData).some((value) => !value)) {
      setMessage("All fields are required.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        "https://blood-donation-back-piab.onrender.com/api/recipientauth/request-blood",
        { ...formData },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      Swal.fire({
        title: "Success",
        text: response.data.message || "Blood request submitted successfully.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });

      setTimeout(() => {
        navigate(`/getHospital?bloodGroup=${encodeURIComponent(formData.bloodGroup)}`);
      }, 2000);
    } catch (error) {
      setMessage(error.response?.data?.message || "Request submission failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal fade" id="recipientModal" tabIndex="-1" aria-labelledby="recipientModalLabel" aria-hidden="true">
      <div className="modal-dialog">
        <div className="modal-content rounded-3">
          <div className="modal-header bg-danger text-white">
            <h4 className="modal-title w-100 text-center">Request Blood</h4>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" id="closeModal"></button>
          </div>

          <div className="modal-body p-4">
            {message && <div className="alert alert-info text-center">{message}</div>}
            <form onSubmit={handleSubmit}>
              <input type="number" name="age" className="form-control mb-2" value={formData.age} onChange={handleChange} placeholder="Enter your age" required />

              <select name="bloodGroup" className="form-control mb-2" value={formData.bloodGroup} onChange={handleChange} required>
                <option value="">Select Blood Group</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>

              <input type="text" name="address" className="form-control mb-2" value={formData.address} onChange={handleChange} placeholder="Enter your address" required />

              <input type="text" name="contactNumber" className="form-control mb-2" value={formData.contactNumber} onChange={handleChange} placeholder="Enter your contact number" required />

              <input type="date" name="requiredDate" className="form-control mb-2" value={formData.requiredDate} onChange={handleChange} required />

              {/* Ensure time updates properly */}
              <input
                type="time"
                name="requiredTime"
                className="form-control mb-2"
                value={formData.requiredTime}
                onChange={handleChange}
                required
              />

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                  Cancel
                </button>
                <button type="submit" className="btn btn-danger" disabled={loading}>
                  {loading ? "Submitting..." : "Submit Request"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipientRegister;
