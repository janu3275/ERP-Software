import { checkToken, clearCompanyData } from '../commonfn';
import {  Outlet, Navigate } from 'react-router-dom';
import PropTypes from "prop-types";
import { useCommonInfoStore } from '../../strore/notificationStore';

const CompanyRoutesWrapper = ({children}) => {
  const { CompanyTokenValid } = checkToken();
  const setCompanyInfo = useCommonInfoStore((state)=>state.setCompanyInfo);
console.log("lllll", CompanyTokenValid)
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
