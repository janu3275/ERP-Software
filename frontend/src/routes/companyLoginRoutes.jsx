import { Routes, Route, Navigate } from "react-router-dom"
import CompanyRegister from "../pages/companyRegister";
import CompanyLogin from "../pages/companyLogin";




const CompanyLoginRoutes = () => {
  console.log("coming here")
    return (
        <Routes>
        <Route path="/" element={<Navigate to="/companyLogin" /> } />
        <Route path="/companyLogin" element={ <CompanyLogin/> } />
        <Route path="/companyRegister" element={ <CompanyRegister /> } />
        <Route path="*" element={<Navigate to="/companyLogin" />}/>
        </Routes>
    )
}

export default CompanyLoginRoutes;