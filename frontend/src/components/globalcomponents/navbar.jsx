import PropTypes from 'prop-types';
import "./navbar.css";

import { useState } from 'react';
import { Icon } from '@iconify/react';
import { checkToken, setCompanySession, setUserSession } from '../../commonfn';
import { useCommonInfoStore } from '../../../strore/notificationStore';
import PopoverDemo from '../../assets/singlecomponents/popover/popover';
import UserSetting from './settings/usersetting';



const Navbar = ({open, onMenuClick }) => {
  
  const [openSettingPop, setOpenSettingPop] = useState(false);
  const { CompanyTokenValid, UserTokenValid, marketTokenValid } = checkToken();
  const company = useCommonInfoStore(state=>state.company);

 

  

  return (
    <nav className="navbar">
      {/* <div style={{display:"flex", gap:"20px"}}>
      {CompanyTokenValid && UserTokenValid && marketTokenValid && <button className={open?"menu-button open":"menu-button"} onClick={onMenuClick}>
        ☰
      </button> }
      <h2 className="brand">AasanVyapaar</h2>
      </div> */}
      {/* Add your user profile icon or any other content here */}
      <div></div>
      <PopoverDemo
                Open={openSettingPop}
                setOpen={setOpenSettingPop}
                contentclass="loginpopclass"
                btnclass="loginpopbtnclass"
                side="bottom"
                icon={<button className={"PopIconButton " + "loginpopbtnclass"} aria-label="Update dimensions">{company}</button>}
              >
          <UserSetting  /> 
    </PopoverDemo>
    </nav>
  );
};

Navbar.propTypes = {
    open: PropTypes.bool,
    onMenuClick: PropTypes.func,
  };

export default Navbar;
