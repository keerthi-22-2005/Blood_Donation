import { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const DonorRegister = () => {
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    gender: "",
    age: "",
    bloodGroup: "",
    address: "",
    anyDiseases: "",
    anyAllergy: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!user || !user.token) return "You must be logged in to register.";
    if (!formData.gender || !formData.age || !formData.bloodGroup || !formData.address) {
      return "All fields are required.";
    }
    if (isNaN(formData.age) || formData.age < 18) {
      return "You must be at least 18 years old to donate blood.";
    }
    if (formData.anyDiseases.toLowerCase() === "yes" || formData.anyAllergy.toLowerCase() === "yes") {
      return "You are not eligible to donate blood due to medical conditions.";
    }
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      await axios.post(
        "https://blood-donation-back-piab.onrender.com/api/donarauth/book-appointment",
        formData,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setMessage("Registration successful! Thank you for your contribution.");
      setFormData({
        gender: "",
        age: "",
        bloodGroup: "",
        address: "",
        anyDiseases: "",
        anyAllergy: "",
      });

      setTimeout(() => {
        setMessage("");
        document.getElementById("closeModal").click();
      }, 2000);
    } catch (error) {
      setError(error.response?.data?.message || "Registration failed.");
    }
  };

  return (
    <div className="modal fade" id="donorModal" tabIndex="-1" aria-labelledby="donorModalLabel" aria-hidden="true">
      <div className="modal-dialog">
        <div className="modal-content rounded-3">
          <div className="modal-header bg-success text-white">
            <h4 className="modal-title w-100 text-center">Become a Blood Donor</h4>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" id="closeModal"></button>
          </div>

          <div className="modal-body p-4">
            {error && <div className="alert alert-danger text-center">{error}</div>}
            {message && <div className="alert alert-success text-center">{message}</div>}

            <form onSubmit={handleSubmit}>
              <select name="gender" className="form-control mb-2" value={formData.gender} onChange={handleChange} required>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>

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

              <select name="anyDiseases" className="form-control mb-2" value={formData.anyDiseases} onChange={handleChange} required>
                <option value="">Do you have any diseases?</option>
                <option value="No">No</option>
                <option value="Yes">Yes</option>
              </select>

              <select name="anyAllergy" className="form-control mb-2" value={formData.anyAllergy} onChange={handleChange} required>
                <option value="">Do you have any allergies?</option>
                <option value="No">No</option>
                <option value="Yes">Yes</option>
              </select>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                <button type="submit" className="btn btn-success">Register as Donor</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonorRegister;
