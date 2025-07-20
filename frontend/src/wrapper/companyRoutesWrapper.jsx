import { checkToken } from '../commonfn';
import {  Outlet, Navigate } from 'react-router-dom';
import PropTypes from "prop-types";


const CompanyRoutesWrapper = ({children}) => {
  const { CompanyTokenValid } = checkToken();
  

  if (CompanyTokenValid) {
    return <Navigate to="/marketplace" replace/>
 
  } else {
    // clearCompanyData(setCompanyInfo)
    return children ? children:<Outlet />
  }
};

CompanyRoutesWrapper.propTypes = {
    children: PropTypes.element,
    };

export default CompanyRoutesWrapper;
