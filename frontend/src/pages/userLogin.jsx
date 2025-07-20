
import { Axios } from "../../utils/axios.mjs";
import { useNavigate } from 'react-router-dom';

import { generateRandomId, setUserSession } from "../commonfn";

import { useCommonInfoStore, useNotificationStore } from "../../strore/notificationStore";

import Navbar from '../components/globalcomponents/navbar';
import UserLoginform from '../authforms/userLoginform';
import userloginimg from "../assets/images/5209312.jpg";

const UserLogin = () => {

    const setUserInfo = useCommonInfoStore(state=>state.setUserInfo);
    const {addNotification} = useNotificationStore();
    const navigate = useNavigate();

    const loginUser = async(userinfo) => {

      try {
       
        let res = await Axios.post(`/login/user`, userinfo)
        if(res.data.success){
          addNotification({
            id: generateRandomId(5),
            type: "success",
            message: "User login successfully!",
            displaytime: 5000,
          });
         let {usertoken, userid} = res.data.data; 
         setUserSession(usertoken)
         setUserInfo(userid)
         navigate('/home');
        }else{
            console.log(res)
            addNotification({
              id: generateRandomId(5),
              type: "error",
              message: "User login failed!",
              displaytime: 5000,
            });
        }
      } catch (error) {
        console.log(error)
        addNotification({
          id: generateRandomId(5),
          type: "error",
          message: `User login failed!, ${error}`,
          displaytime: 5000,
        });
      }
    }
    
    return (
      <>
       <Navbar />
        <div className="mainlayout">
        <div className="loginimgContainer">
           
           <img 
           src={userloginimg}
           alt="loginimg"
           className="loginimg1"
           />
        
           </div>
        <div className="loginlayout" > 
       
         <UserLoginform loginUser={loginUser} />
                
         <div style={{display:"flex", alignItems:"center",  marginTop:"50px", padding:"10px 0px",gap:"20px" }}><div style={{fontSize:"medium"}}> Haven't registered user yet ? </div> <button onClick={()=>navigate('/userRegister')} className="tertiarybtn">Register user</button> </div>
          
         </div>
        
        </div>
        </>
    )
}


export default UserLogin;
