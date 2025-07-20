
import { Axios } from "../../utils/axios.mjs";
import { useNavigate } from "react-router-dom";
import CompanyRegisterform from '../authforms/companyRegisterform';
import { useNotificationStore } from "../../strore/notificationStore";
import { generateRandomId } from "../commonfn";
import loginimg from "../assets/images/6666912.jpg";
import logo from "../assets/images/ant_10102085.png";


const CompanyRegister = () => {

  const { addNotification } = useNotificationStore();

  const navigate = useNavigate();
  
  const registerCompany = async ( companyinfo ) => {
    try {
      let res = await Axios.post(`/register/company`, companyinfo);
      if (res.data.success) {
        addNotification({
          id: generateRandomId(5),
          type: "success",
          message: "Company registered successfully!",
          displaytime: 3000,
        });
        navigate("/CompanyLogin");
      } else {
        console.log(res);
        addNotification({
          id: generateRandomId(5),
          type: "error",
          message: "Failed to register company!",
          displaytime: 3000,
        });
      }
    } catch (error) {
      console.log(error);
      addNotification({
        id: generateRandomId(5),
        type: "error",
        message: `Failed to register company!, ${error}`,
        displaytime: 3000,
      });
    }
  };

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
        <CompanyRegisterform registerCompany={registerCompany} />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginTop: "50px",
            padding: "10px 0px",
          }}
        >
          <div style={{ fontSize: "medium" }}>
            {" "}
            Have already registered your company ?{" "}
          </div>{" "}
          <button
            onClick={() => navigate("/companyLogin")}
            className="tertiarybtn"
          >
            Login
          </button>{" "}
        </div>
      </div>
    </div>
  
  );
};

export default CompanyRegister;
