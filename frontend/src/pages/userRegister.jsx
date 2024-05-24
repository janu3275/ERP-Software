
import { Axios } from "../../utils/axios.mjs";
import {  useNavigate } from 'react-router-dom';
import Navbar from "../components/globalcomponents/navbar";
import UserRegisterform from '../authforms/userRegisterform';



const UserRegister = () => {
    const navigate = useNavigate();
    const registerUser = async(userinfo) => {
      try {
        let res = await Axios.post(`/register/user`, userinfo)
        if(res.data.success){
         navigate('/userLogin');
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
       
         <UserRegisterform registerUser={registerUser} />
                
         <div style={{display:"flex", alignItems:"center",  marginTop:"50px", padding:"10px 0px",gap:"20px" }}><div style={{fontSize:"medium"}}> Already a registered user ? </div> <button onClick={()=>navigate('/userLogin')} className="oksecondarybtn">Login user</button> </div>      
          
         </div>
        
        </div>
      </>
    )
}


export default UserRegister;
