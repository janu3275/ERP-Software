import { checkToken, clearCompanyData, clearMarketData, clearUserData } from '../commonfn';
import { Navigate, Outlet } from 'react-router-dom';
import PropTypes from "prop-types";
import { useCommonInfoStore } from '../../strore/notificationStore';

const MainRoutesWrapper = ({children}) => {
  const { CompanyTokenValid, UserTokenValid, marketTokenValid } = checkToken();
  const setCompanyInfo = useCommonInfoStore(state=>state.setCompanyInfo);
  const setMarketInfo  = useCommonInfoStore(state=>state.setMarketInfo);
  const setUserInfo = useCommonInfoStore(state=>state.setUserInfo);
console.log("lllll")
  if (CompanyTokenValid) {
    if(marketTokenValid){
      if (UserTokenValid) {
        return children ? children:<Outlet />
      } else {
        // clearUserData(setUserInfo)
        return <Navigate to="/userLogin" replace />
      }

    }else{
      // clearMarketData(setMarketInfo)
      return <Navigate to="/marketplace" replace />
    }
 
  } else {
    // clearCompanyData(setCompanyInfo)
    return <Navigate to="/companyLogin" replace/>
  }
};

MainRoutesWrapper.propTypes = {
    children: PropTypes.element,
    };

export default MainRoutesWrapper;
