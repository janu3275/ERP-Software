
import { Axios } from "../../utils/axios.mjs";
import { useNavigate } from 'react-router-dom';

import { setUserSession } from "../commonfn";

import { useCommonInfoStore } from "../../strore/notificationStore";

import Navbar from '../components/globalcomponents/navbar';
import UserLoginform from '../authforms/userLoginform';


const UserLogin = () => {

    const setUserInfo = useCommonInfoStore(state=>state.setUserInfo);

    const navigate = useNavigate();

    const loginUser = async(userinfo) => {

      try {
       
        let res = await Axios.post(`/login/user`, userinfo)
        if(res.data.success){
         let {usertoken, userid} = res.data.data; 
         setUserSession(usertoken)
         setUserInfo(userid)
         navigate('/home');
        }else{
            console.log(res)
        }
      } catch (error) {
        console.log(error)
      }
    }
    
    return (
      <>
       <Navbar />
        <div className="mainlayout">
        <div className="loginlayout "> 
       
         <UserLoginform loginUser={loginUser} />
                
         <div style={{display:"flex", alignItems:"center",  marginTop:"50px", padding:"10px 0px",gap:"20px" }}><div style={{fontSize:"medium"}}> Haven't registered user yet ? </div> <button onClick={()=>navigate('/userRegister')} className="oksecondarybtn">Register user</button> </div>
          
         </div>
        
        </div>
        </>
    )
}


export default UserLogin;
