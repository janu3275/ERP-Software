import { Axios } from "../../utils/axios.mjs";
import { useNavigate } from 'react-router-dom';

import { checkToken, setCompanySession } from "../commonfn";
import "./companylogin.css";
import { useCommonInfoStore } from "../../strore/notificationStore";
import CompanyLoginform from '../authforms/companyLoginForm/companyLoginform';


const CompanyLogin = () => {
    const setCompanyInfo = useCommonInfoStore(state=>state.setCompanyInfo);
    const navigate = useNavigate();


   
    const loginCompany = async(companyinfo) => {
        console.log(companyinfo)
      try {
        let res = await Axios.post(`/login/company`, companyinfo)
        if(res.data.success){
          let {token, companyName} = res.data.data;
          setCompanySession(token);
          setCompanyInfo(companyName)
          console.log("kjbdfkjd")
          navigate('/marketplace', {replace: true});
          
        }else{
            console.log(res)
        }
      } catch (error) {
        console.log(error)
      }
    }


    console.log("company login")
    return (
     
        <div className="mainlayout">
         <div className="loginlayout "> 
        
         <CompanyLoginform loginCompany={loginCompany} />
                
        <div style={{display:"flex", alignItems:"center",  marginTop:"50px", padding:"10px 0px", }}><div style={{fontSize:"medium"}}> Haven't registered your company yet ? </div> <button onClick={()=>navigate('/companyRegister')} className="oksecondarybtn">Register</button> </div>
          
         </div>
        
        </div>
      
    )
}


export default CompanyLogin;
