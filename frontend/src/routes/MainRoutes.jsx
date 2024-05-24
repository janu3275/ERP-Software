import { Routes, Route, Navigate } from "react-router-dom"
import Home from "../pages/home";




const MainRoutes = () => {
    return (
    <Routes>
        <Route path="/" element={<Navigate to="/home" /> } />
        <Route path="/home" element={ <Home/> } />
        <Route path="*" element={<Navigate to="/home" /> } />

       
    </Routes>
    )
}

export default MainRoutes;