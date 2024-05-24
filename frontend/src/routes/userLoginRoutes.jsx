import { Routes, Route, Navigate } from "react-router-dom"
import UserRegister from "../pages/userRegister";
import UserLogin from "../pages/userlogin";



const UserLoginRoutes = () => {
    console.log("kjnk")
    return (

    <Routes>
        <Route path="/" element={<Navigate to="/userLogin" /> } />
        <Route path="/userRegister" element={ <UserRegister /> } />
        <Route path="/userLogin" element={ <UserLogin /> } />
        <Route path="*" element={<Navigate to="/userLogin" /> } />
       
      </Routes>
    )
}

export default UserLoginRoutes;