import "./orderform.css";
import PropTypes from "prop-types";
import Orderinput from "../productinput/orderinput";

const Orderform = ({ selectedobj, additem, updateitem }) => {
  return (
    <div style={{maxHeight:"80vh", overflow:"auto", padding:"0px 20px", paddingTop:"20px"}}>
      <div style={{marginBottom:"80px"}}>
        <div
          style={{
           marginLeft:"20px",
           marginBottom:"30px",
           fontSize:"19px",
           
          }}
          className="primaryformsectiontitle"
        >
         
            Order input{" "}
          
        </div>

        <Orderinput
          selectedobj={selectedobj}
          additem={additem}
          updateitem={updateitem}
          
        />
      </div>
    </div>
  );
};

Orderform.propTypes = {
  selectedobj: PropTypes.any,
  additem: PropTypes.func.isRequired,
  updateitem: PropTypes.func.isRequired,
  deleteitem: PropTypes.func.isRequired,
};

export default Orderform;
