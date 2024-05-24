
import { Axios } from "../../utils/axios.mjs";
import { useNavigate } from "react-router-dom";
import CompanyRegisterform from '../authforms/companyRegisterform';


const CompanyRegister = () => {
  const navigate = useNavigate();
  const registerCompany = async (companyinfo) => {
    try {
      let res = await Axios.post(`/register/company`, companyinfo);
      if (res.data.success) {
        navigate("/CompanyLogin");
      } else {
        console.log(res);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
   
    <div className="mainlayout">
      <div className="loginlayout ">
        
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
            className="oksecondarybtn"
          >
            Login company
          </button>{" "}
        </div>
      </div>
    </div>
  
  );
};

export default CompanyRegister;
