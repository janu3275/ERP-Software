import { Icon } from "@iconify/react/dist/iconify.js";
import PropTypes from "prop-types";

const PanelButton = ({ selected, name,  funct, functprop }) => {
    
    return (
        <button className={selected?"sidebarButton select":"sidebarButton"}  onClick={()=>functprop?funct(functprop): funct()}> 
        <div className={selected?"selctedsinglepanel":"singlepanel"}>
            <div>{name}</div>
            {selected && <div style={{position:"absolute", left:"-16px",
          width: "3.5px",
          height: "26px",
          borderRadius: "50px",
          background: "rgb(44 129 214)"
          }}>  
              
            </div>}
        </div>  
    </button>
    )
}

PanelButton.propTypes = {

   
    name: PropTypes.string.isRequired,
    selected: PropTypes.bool.isRequired,
    funct: PropTypes.func.isRequired,
    functprop: PropTypes.any,
   

  };

export default PanelButton; 