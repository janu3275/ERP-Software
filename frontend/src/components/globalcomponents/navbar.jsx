import PropTypes from 'prop-types';
import "./navbar.css";

import { useState } from 'react';
import { Icon } from '@iconify/react';
import { checkToken, setCompanySession, setUserSession } from '../../commonfn';
import { useCommonInfoStore } from '../../../strore/notificationStore';
import PopoverDemo from '../../assets/singlecomponents/popover/popover';
import UserSetting from './settings/usersetting';
import logo from "../../assets/images/ant_10102085.png"



const Navbar = ({open, onMenuClick }) => {
  
  const [openSettingPop, setOpenSettingPop] = useState(false);
  const { CompanyTokenValid, UserTokenValid, marketTokenValid } = checkToken();
  const { user, company, marketplace, marketimg } = useCommonInfoStore();

 

  

  return (
    <nav className="navbar">
      {/* <div style={{display:"flex", gap:"20px"}}>
      {CompanyTokenValid && UserTokenValid && marketTokenValid && <button className={open?"menu-button open":"menu-button"} onClick={onMenuClick}>
        ☰
      </button> }
      <h2 className="brand">AasanVyapaar</h2>
      </div> */}
      {/* Add your user profile icon or any other content here */}
      <div style={{display:"flex", gap:"2.5px", alignItems:"center"}}>
        {company && <div style={{height:"25px"}} className='navbarbox'>{company}</div>}
        {marketimg && marketplace && <Icon
                    icon="iconamoon:arrow-right-2-duotone"
                    style={{
                      width: "1.2rem",
                      height: "1.2rem",
                      color: "green"
                   
                    }}
                  />}
        {marketplace && marketimg && <div className='navbarbox' >
          <div className='avatar' style={{height:"25px", width:"25px", margin:"0", display:"flex"}}>
            <img className='marketavatar' src={marketimg} />
            </div>
            <div>{marketplace}</div>
            </div>}
           {user && <Icon
                    icon="iconamoon:arrow-right-2-duotone"
                    style={{
                      width: "1.2rem",
                      height: "1.2rem",
                      color: "green"
                     
                    }}
                  />} 
        {user && <div className='navbarbox'> <Icon
                    icon="carbon:user-avatar-filled"
                    style={{
                      width: "1.6rem",
                      height: "1.6rem",
                      color: "green"
                     
                    }}
                  /> <div>{user}</div>
                  
        </div>}
      </div>
      <PopoverDemo
                Open={openSettingPop}
                setOpen={setOpenSettingPop}
                contentclass="loginpopclass"
                btnclass="loginpopbtnclass"
                side="bottom"
                icon={<button className={"loginpopbtnclass"} aria-label="Update dimensions"><img 
                src={logo}
                alt="logo"
                style={{height:"32px", width:"32px"}}
                className='navbarlogo'
                /></button>}
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
