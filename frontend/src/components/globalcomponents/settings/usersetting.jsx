import PropTypes from 'prop-types';
import "./usersetting.css";
import { Icon } from '@iconify/react';
import { clearCompanyData, clearMarketData, clearUserData } from '../../../commonfn';
import { useCommonInfoStore } from '../../../../strore/notificationStore';
import {   useNavigate } from 'react-router-dom';

const UserSetting = ()=>{
  const { user, company, marketplace, marketimg, setUserInfo, setCompanyInfo , setMarketInfo } = useCommonInfoStore();
  const navigate = useNavigate(); 
  console.log(user, company, marketplace, marketimg)
    return (
    <div>
      
    { user && <div>
    <div className='actiondiv'>
    <div className='avatar' style={{height:"25px", width:"25px", margin:"0"}}>
    <Icon
                    icon="carbon:user-avatar-filled"
                    style={{
                      width: "1.6rem",
                      height: "1.6rem",
                      color: "black",
                      cursor:"pointer"
                    }}
                  />
      </div>
                <div>{user}</div>
               
      </div>
        <button className='actiondiv' onClick={()=>{
          clearUserData(setUserInfo)
          navigate('/userLogin')
          }}>
            <div>
                 <Icon
                    icon="mdi:account-switch-outline"
                    style={{
                      width: "1.6rem",
                      height: "1.6rem",
                      color: "black",
                      cursor:"pointer"
                    }}
                  />
            </div>
        <div> Switch user </div>
        
        </button>
      </div>}


    { marketplace && marketimg && <div>
    <div className='actiondiv'>
      <div className='avatar' style={{height:"25px", width:"25px", margin:"0"}}>
                 <img
                 src={marketimg}
                 alt='image'
                 className='marketavatar'
                 />
      </div>
                <div>{marketplace}</div>
               
    </div>
        <button className='actiondiv' onClick={()=>{
          clearMarketData(setMarketInfo, setUserInfo)
          navigate('/marketplace')
          }}>
            <div >
                 <Icon
                    icon="mdi:home-switch"
                    style={{
                      width: "1.6rem",
                      height: "1.6rem",
                      color: "black",
                      cursor:"pointer"
                    }}
                  />
                  </div>
        <div> Switch marketplace</div>
        
        </button>
    </div>}

   
    
        { company && <button className='actiondiv' onClick={()=>{
          clearCompanyData(setCompanyInfo, setMarketInfo, setUserInfo)
          navigate('/companyLogin')
          }}>
         
                 <Icon
                    icon="ph:sign-out-bold"
                    style={{
                      width: "1.3rem",
                      height: "1.3rem",
                      color: "black",
                      cursor:"pointer"
                    }}
                  />
                 
        <div> Sign Out</div>
        
        </button>}
   
    </div>

          )
}




export default UserSetting;