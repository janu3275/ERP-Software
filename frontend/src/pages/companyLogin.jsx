import { Axios } from "../../utils/axios.mjs";
import { useNavigate } from 'react-router-dom';
import { checkToken, generateRandomId, setCompanySession } from "../commonfn";
import "./companylogin.css";
import { useCommonInfoStore, useNotificationStore } from "../../strore/notificationStore";
import CompanyLoginform from '../authforms/companyLoginForm/companyLoginform';
import loginimg from "../assets/images/6666912.jpg";
import logo from "../assets/images/ant_10102085.png";

const CompanyLogin = () => {
    const setCompanyInfo = useCommonInfoStore(state=>state.setCompanyInfo);
    const {addNotification} = useNotificationStore();
    const navigate = useNavigate();


   
    const loginCompany = async(companyinfo) => {
        console.log(companyinfo)
      try {
        let res = await Axios.post(`/login/company`, companyinfo)

        if(res.data.success){

          addNotification({
            id: generateRandomId(5),
            type: "success",
            message: "Company login successfully!",
            displaytime: 3000,
          });
          let { token, companyID } = res.data.data;
          setCompanySession(token);
          setCompanyInfo(companyID)
          console.log("kjbdfkjd")
          navigate('/marketplace', { replace: true });
          
        }else{

            console.log(res)
            addNotification({
              id: generateRandomId(5),
              type: "error",
              message: "Company login failed!",
              displaytime: 3000,
            });

        }

      } catch (error) {

        console.log(error)
        addNotification({
          id: generateRandomId(5),
          type: "error",
          message: `Company login failed!, ${error}`,
          displaytime: 3000,
        });
        
      }
    }


    console.log("company login")
    return (
     
        <div className="mainlayout">
          
          <div className="loginimgContainer">
           
          <img 
          src={loginimg}
          alt="loginimg"
          className="loginimg1"
          />
       
          </div>
         <div className="loginlayout "> 
          <div style={{ display:"flex", gap:"20px", alignItems:"center" }}>
          <img 
          src={logo}
          alt="logo"
          className="logo"
          />
         <h1>AasanVyapaar</h1>
         </div>
         <CompanyLoginform loginCompany={loginCompany} />
                
        <div style={{display:"flex", alignItems:"center",  marginTop:"50px", padding:"10px 0px", }}><div style={{fontSize:"medium"}}> Haven't registered your company yet ? </div> <button onClick={()=>navigate('/companyRegister')} className="tertiarybtn">Register</button> </div>
          
         </div>
        
        </div>
      
    )
}


export default CompanyLogin;
