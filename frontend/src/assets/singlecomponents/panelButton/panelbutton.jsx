// import { Icon } from "@iconify/react/dist/iconify.js";
import PropTypes from "prop-types";

const PanelButton = ({ selected, name,  funct, functprop, icon, left, color }) => {
    
    return (
        <button className={selected?"sidebarButton select":"sidebarButton"}  onClick={()=>functprop?funct(functprop): funct()}> 
        {icon}
        <div className={selected?"selctedsinglepanel":"singlepanel"}>
            <div>{name}</div>
            {selected && <div style={{position:"absolute", left:left?left:"-40.5px",
          width: "3.5px",
          height: "26px",
          borderRadius: "50px",
          background: color?color:"rgb(44 129 214)"
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
    icon: PropTypes.element,
    left: PropTypes.string,
    color: PropTypes.string
   

  };

export default PanelButton; 