import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../src/Home/Home";
import Register from "../src/Register/register"
import Login from "../src/Login/login"
import Navigation from "./Navigation/Navigation";
import { AuthProvider } from "./Context/authContext";
import DonorRegister from "./donorRegister/donorRegister";
import DonorAppointment from "./DonorAppointment/DonarAppointment";
import RecipientRegister from "./donorRegister/recipientRegister";
import GetHospital from "./Hospital/getHospital"
import RequestDetails from "./Hospital/requestDetails";
export default function App() {
    return (
        <BrowserRouter>
         <AuthProvider>
                    <Navigation />
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/Register" element={<Register />} />
                        <Route path="/Login" element={<Login />} />
                        <Route path="/donorRegister" element={<DonorRegister/>}/>
                        <Route path="/donorAppointment" element={<DonorAppointment/>}/>
                        <Route path="/recipientRegister" element={<RecipientRegister/>}/>
                        <Route path="/getHospital" element={<GetHospital/>}/>
                        <Route path="/requestDetails" element={<RequestDetails/>}/>

                    </Routes>
                    </AuthProvider>
        </BrowserRouter>
    );
}
