import { useContext, useEffect } from 'react';
import './App.css'
import ThemeContext from './context/theme/themecontext';
import MainRoutes from './routes/MainRoutes';
import CompanyLoginRoutes from './routes/companyLoginRoutes';
import UserLoginRoutes from './routes/userLoginRoutes';
import { checkToken } from './commonfn';
import { Navigate, Route, Routes } from 'react-router-dom';
import CompanyLogin from './pages/companyLogin';
import CompanyRegister from './pages/companyRegister';
import UserRegister from './pages/userRegister';
import UserLogin from './pages/userlogin';
import Home from './pages/home';
import MainRoutesWrapper from './wrapper/mainRoutesWrapper';
import MarketPlaces from './pages/marketPlaces';
import UserAuthWrapper from './wrapper/userRoutesWrapper';
import MarketAuthWrapper from './wrapper/MarketRoutesWrapper';
import CompanyRoutesWrapper from './wrapper/companyRoutesWrapper';
import withBlurOnClick from './wrapper/BlurButtonWrapper';


function App() {

  const {theme} = useContext(ThemeContext);

 

 
  return (
  <div className = {theme==='light'? "app light":"app dark"} >
  
    <Routes>

     <Route  element={ <CompanyRoutesWrapper /> } >
      <Route path="/companyLogin" element={ <CompanyLogin /> } />
      <Route path="/companyRegister" element={ <CompanyRegister /> } />
     </Route>

     <Route  element={ <MarketAuthWrapper /> } >
      <Route path="/marketplace" element={  <MarketPlaces /> } />
     </Route>

     <Route  element={ <UserAuthWrapper /> } >
      <Route path="/userRegister" element={ <UserRegister /> } />
      <Route path="/userLogin" element={ <UserLogin /> } />
     </Route>

    <Route element={<MainRoutesWrapper />} >
     <Route path="/home" element={ <Home/> } />
     <Route path="*" element={<Navigate to="/home"/>  } />
    </Route>
    
   </Routes>
  </div>
  
  )
}

// const AppWithBlurOnClick = withBlurOnClick(App);


export default App;



