import { checkToken, clearCompanyData} from '../commonfn';
import {  Outlet , Navigate} from 'react-router-dom';
import PropTypes from "prop-types";
import { useCommonInfoStore } from '../../strore/notificationStore';


const MarketAuthWrapper = ({children}) => {
  const setCompanyInfo = useCommonInfoStore(state=>state.setCompanyInfo);
  
  const { CompanyTokenValid, marketTokenValid } = checkToken();
  console.log("kjbnkjs", CompanyTokenValid)
  if (CompanyTokenValid) {
    if(marketTokenValid){
      return <Navigate to="/userLogin" replace/> 
    }else{
      return children ? children : <Outlet /> 
    }
    
    }else {
    console.log("jhbkjbs", children)
    // clearCompanyData(setCompanyInfo)
    return <Navigate to="/companyLogin" replace/> 
  }
};


MarketAuthWrapper.propTypes = {
  children: PropTypes.array,
  };

export default MarketAuthWrapper;
