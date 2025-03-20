import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const RequestDetails = () => {
  const { user } = useContext(AuthContext);
  const [requestDetails, setRequestDetails] = useState(null);
  const [hospitals, setHospitals] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [assigning, setAssigning] = useState(false);

  useEffect(() => {
    const fetchRequestDetails = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/recipientauth/request-details", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data?.recipient) {
          setRequestDetails(response.data.recipient);
        } else {
          setError("No blood request found.");
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch request details.");
      } finally {
        setLoading(false);
      }
    };

    const fetchHospitals = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/hospital/list");
        setHospitals(response.data);
      } catch (err) {
        console.error("Failed to fetch hospitals:", err);
      }
    };

    fetchRequestDetails();
    fetchHospitals();
  }, []);

  const handleAssignHospital = async () => {
    if (!selectedHospital) return;

    setAssigning(true);
    try {
      const token = localStorage.getItem("token");

      const response = await axios.put(
        `http://localhost:5000/api/recipientauth/assign-hospital/${requestDetails._id}`,
        { hospitalId: selectedHospital },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setRequestDetails((prev) => ({
        ...prev,
        hospital: hospitals.find((h) => h._id === selectedHospital),
        status: "Processing",
      }));

      console.log("✅ Hospital assigned:", response.data);
    } catch (err) {
      console.error("❌ Error assigning hospital:", err.response?.data?.message || err.message);
    } finally {
      setAssigning(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage: "url('https://cdn.vectorstock.com/i/500p/79/53/banner-with-red-blood-cellis-vector-41517953.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      {/* Content Wrapper */}
      <div className="container">
        <h2
          className="text-center mb-4"
          style={{
            color: "#fff",
            fontWeight: "bold",
            textShadow: "2px 2px 4px rgba(0,0,0,0.8)",
          }}
        >
          Blood Request Details
        </h2>

        {loading && <div className="text-center text-light">Loading request details...</div>}
        {error && !loading && <div className="alert alert-danger text-center">{error}</div>}

        {!loading && requestDetails && (
          <div className="card shadow p-4" style={{ backgroundColor: "rgba(255, 255, 255, 0.9)" }}>
            <p><strong>Age:</strong> {requestDetails.age || "N/A"}</p>
            <p><strong>Blood Group:</strong> {requestDetails.bloodGroup || "N/A"}</p>
            <p><strong>Address:</strong> {requestDetails.address || "N/A"}</p>
            <p><strong>Contact Number:</strong> {requestDetails.contactNumber || "N/A"}</p>
            <p><strong>Required Date:</strong> {requestDetails.requiredDate ? new Date(requestDetails.requiredDate).toDateString() : "N/A"}</p>
            <p><strong>Required Time:</strong> {requestDetails.requiredTime || "N/A"}</p>
            <p>
              <strong>Status:</strong> 
              <span className={`badge ${requestDetails.status === "Approved" ? "bg-success" : "bg-warning"}`}>
                {requestDetails.status || "Pending"}
              </span>
            </p>

            {requestDetails.hospital ? (
              <p><strong>Hospital:</strong> {requestDetails.hospital.name} - {requestDetails.hospital.location}</p>
            ) : (
              <div>
                <p className="text-muted">No hospital assigned yet.</p>
                <select
                  className="form-select mb-3"
                  value={selectedHospital}
                  onChange={(e) => setSelectedHospital(e.target.value)}
                >
                  <option value="">Select Hospital</option>
                  {hospitals.map((hospital) => (
                    <option key={hospital._id} value={hospital._id}>
                      {hospital.name} - {hospital.location}
                    </option>
                  ))}
                </select>
                <button
                  className="btn btn-primary"
                  onClick={handleAssignHospital}
                  disabled={!selectedHospital || assigning}
                >
                  {assigning ? "Assigning..." : "Assign Hospital"}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestDetails;
