
import { Axios } from "../../utils/axios.mjs";
import {  useNavigate } from 'react-router-dom';
import Navbar from "../components/globalcomponents/navbar";
import UserRegisterform from '../authforms/userRegisterform';
import userloginimg from "../assets/images/5209312.jpg";
import { useNotificationStore } from "../../strore/notificationStore";
import { generateRandomId } from "../commonfn";


const UserRegister = () => {
    const {addNotification} = useNotificationStore();
    const navigate = useNavigate();
    const registerUser = async(userinfo) => {
      try {
        let res = await Axios.post(`/register/user`, userinfo)
        if(res.data.success){
          addNotification({
            id: generateRandomId(5),
            type: "success",
            message: "User registered successfully!",
            displaytime: 5000,
          });
         navigate('/userLogin');
        }else{
            console.log(res)
            addNotification({
              id: generateRandomId(5),
              type: "error",
              message: "Failed to register user!",
              displaytime: 5000,
            });
        }
      } catch (error) {
        console.log(error)
        addNotification({
          id: generateRandomId(5),
          type: "error",
          message: `Failed to register user!, ${error}`,
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
        <div className="loginlayout "> 
       
         <UserRegisterform registerUser={registerUser} />
                
         <div style={{display:"flex", alignItems:"center",  marginTop:"50px", padding:"10px 0px",gap:"20px" }}><div style={{fontSize:"medium"}}> Already a registered user ? </div> <button onClick={()=>navigate('/userLogin')} className="tertiarybtn">Login user</button> </div>      
          
         </div>
        
        </div>
      </>
    )
}


export default UserRegister;
