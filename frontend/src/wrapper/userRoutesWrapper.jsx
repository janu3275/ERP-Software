import { checkToken, clearCompanyData, clearUserData} from '../commonfn';
import {  Outlet, Navigate } from 'react-router-dom';
import PropTypes from "prop-types";
import { useCommonInfoStore } from '../../strore/notificationStore';

const UserAuthWrapper = ({children}) => {
  
  const { CompanyTokenValid, marketTokenValid, UserTokenValid } = checkToken();

  const setUserInfo = useCommonInfoStore(state=>state.setUserInfo);
  const setCompanyInfo = useCommonInfoStore(state=>state.setCompanyInfo);
  
  if (CompanyTokenValid) {
    if(marketTokenValid){
        if(UserTokenValid){
            return <Navigate to="/home" replace/>
        }else{
            return children ? children : <Outlet /> 
        }
        
    }else{
        // clearUserData(setUserInfo)
        return <Navigate to="/marketplace" replace/> 
    }
    
    }else {
    // clearCompanyData(setCompanyInfo)
    console.log("jhbkjbs", children)
    return <Navigate to="/companyLogin" replace/> 
  }

};


UserAuthWrapper.propTypes = {
  children: PropTypes.array,
  };

export default UserAuthWrapper;
