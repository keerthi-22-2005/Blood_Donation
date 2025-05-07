import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../Context/authContext";

const DonorAppointment = () => {
  const { user } = useContext(AuthContext);
  const [appointment, setAppointment] = useState(null);
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAppointmentDetails = async () => {
      try {
        if (!user) return;

        const res = await axios.get("https://blood-donation-back-piab.onrender.com/api/donarauth/appointment-details", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setAppointment(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch appointment details");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointmentDetails();
  }, [user]);

  useEffect(() => {
    const fetchHospitals = async () => {
      if (!appointment || !appointment.bloodGroup) return;

      try {
        const res = await axios.get(`https://blood-donation-back-piab.onrender.com/api/hospital/hospital-blood?bloodGroup=${encodeURIComponent(appointment.bloodGroup)}`);
        setHospitals(res.data);
      } catch (err) {
        setHospitals([]);
        setError("No hospitals found for this blood group.");
      }
    };

    fetchHospitals();
  }, [appointment]);

  return (
    <div
      style={{
        backgroundImage: "url('https://st3.depositphotos.com/1781787/19065/i/450/depositphotos_190655674-stock-photo-drops-blood-donation-medical-concept.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        padding: "20px"
      }}
    >
      <div className="container mt-5">
        <h2 className="text-center text-danger fw-bold">Your Blood Donation Appointment</h2>

        {loading && <p className="text-center text-primary">Loading...</p>}
        {error && <p className="text-center text-danger fw-bold">{error}</p>}

        {appointment ? (
          <div className="card shadow-lg p-4 mt-4">
            <h4 className="text-primary">Appointment Details</h4>
            <ul className="list-group">
              <li className="list-group-item"><strong>Full Name:</strong> {appointment.user.username}</li>
              <li className="list-group-item"><strong>Email:</strong> {appointment.user.email}</li>
              <li className="list-group-item"><strong>Mobile:</strong> {appointment.user.mobile}</li>
              <li className="list-group-item"><strong>Gender:</strong> {appointment.gender}</li>
              <li className="list-group-item"><strong>Age:</strong> {appointment.age}</li>
              <li className="list-group-item"><strong>Blood Group:</strong> {appointment.bloodGroup}</li>
              <li className="list-group-item"><strong>Address:</strong> {appointment.address}</li>
              <li className="list-group-item"><strong>Any Diseases:</strong> {appointment.anyDiseases || "None"}</li>
              <li className="list-group-item"><strong>Any Allergies:</strong> {appointment.anyAllergy || "None"}</li>
            </ul>
          </div>
        ) : (
          <>
            <p className="text-center text-muted mt-4">No appointment found.</p>
            <p className="text-center text-muted">No hospitals found.</p>
          </>
        )}

        {appointment && (
          <>
            <h3 className="text-center text-success mt-5">Hospitals Accepting Your Blood Group</h3>
            <div className="row mt-4">
              {hospitals.length > 0 ? (
                hospitals.map((hospital) => (
                  <div className="col-md-6 col-lg-4 mb-4" key={hospital._id}>
                    <div className="card border-primary shadow-sm">
                      <img 
                        src={hospital.photo} 
                        alt={hospital.name} 
                        className="card-img-top" 
                        style={{ maxHeight: "180px", objectFit: "cover" }} 
                      />
                      <div className="card-body">
                        <h5 className="card-title text-danger fw-bold">{hospital.name}</h5>
                        <p className="card-text"><strong>Location:</strong> {hospital.location}</p>
                        <p className="card-text"><strong>Contact:</strong> {hospital.contact}</p>
                        
                        {hospital.website ? (
                          <a 
                            href={hospital.website} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="btn btn-primary w-100"
                          >
                            View Website
                          </a>
                        ) : (
                          <p className="text-muted">No website available</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted">No hospitals found for your blood group.</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DonorAppointment;
