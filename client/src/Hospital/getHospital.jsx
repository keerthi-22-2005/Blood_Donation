import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const GetHospital = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const bloodGroup = queryParams.get("bloodGroup");

  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showReloadMessage, setShowReloadMessage] = useState(false);

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const response = await axios.get(
          `https://blood-donation-back-piab.onrender.com/api/hospital/hospital-blood?bloodGroup=${encodeURIComponent(bloodGroup)}`
        );
        setHospitals(response.data);
        setShowReloadMessage(true);
        setTimeout(() => setShowReloadMessage(false), 5000);
      } catch (err) {
        setError("Failed to fetch hospitals. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (bloodGroup) {
      fetchHospitals();
    } else {
      setLoading(false);
      setError("No blood group selected.");
    }
  }, [bloodGroup]);

  return (
    <div className="container mt-4" style={{ backgroundColor: "#fff", color: "#000", minHeight: "100vh" }}>
      <h2 className="text-center mb-4 text-danger fw-bold">
        Available Hospitals for Blood Group: <span className="text-primary">{bloodGroup || "N/A"}</span>
      </h2>

      {showReloadMessage && (
        <div className="alert alert-warning text-center">
          🔄 Please reload the page once for a better experience.
          <button className="btn btn-warning btn-sm ms-2" onClick={() => window.location.reload()}>
            Reload Now
          </button>
        </div>
      )}

      {loading && <div className="text-center text-muted">Loading hospitals...</div>}

      {error && !loading && <div className="alert alert-danger text-center">{error}</div>}

      {!loading && hospitals.length > 0 ? (
        <div className="row">
          {hospitals.map((hospital) => (
            <div key={hospital._id || hospital.id} className="col-md-4 mb-4">
              <div className="card shadow-lg border-0">
                <img
                  src={hospital.photo || "https://via.placeholder.com/200x150?text=No+Image"}
                  alt={hospital.name}
                  className="card-img-top"
                  style={{ height: "200px", objectFit: "cover", borderRadius: "8px 8px 0 0" }}
                  loading="lazy"
                />
                <div className="card-body">
                  <h5 className="card-title text-danger fw-bold">{hospital.name}</h5>
                  <p className="card-text"><strong>📍 Location:</strong> {hospital.location || "Not Available"}</p>
                  <p className="card-text"><strong>📞 Contact:</strong> {hospital.contact || "Not Available"}</p>
                  
                  {hospital.website ? (
                    <a 
                      href={hospital.website} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="btn btn-primary w-100"
                    >
                      Visit Website
                    </a>
                  ) : (
                    <p className="text-muted">No website available</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        !loading && <p className="text-center text-muted">No hospitals found.</p>
      )}
    </div>
  );
};

export default GetHospital;
