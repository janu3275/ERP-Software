import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import PropTypes from "prop-types";
import AllOrder from "../allOrders/allorders";
import { toCamelCase } from "../../../../commonfn";




const ActiveOrders = () => {
    
    const components = [{name:'Not yet started', icon:<Icon
      icon="mdi:stop-circle-outline"
      style={{
        width: "1.3rem",
        height: "1.3rem",
        color: "rgb(185 7 7)",
        cursor:"pointer"
        
        }}
    />,  
  
  largeicon: <Icon
  icon="mdi:stop-circle-outline"
  style={{
    width: "3rem",
    height: "3rem",
    color: "rgb(185 7 7)",
    cursor:"pointer"
    
    }}
/>}, {name:'In process', icon:<Icon
      icon="material-symbols:not-started-outline-rounded"
      style={{
        width: "1.3rem",
        height: "1.3rem",
        color: "rgb(60 137 255)",
        cursor:"pointer"
        
        }}
    />,
    largeicon: <Icon
  icon="material-symbols:not-started-outline-rounded"
  style={{
    width: "3rem",
    height: "3rem",
    color: "rgb(60 137 255)",
    cursor:"pointer"
    
    }}
/>}, {name:'completed', icon:<Icon
      icon="fluent-mdl2:completed"
      style={{
        width: "1.3rem",
        height: "1.3rem",
        color: "rgb(30 171 7)",
        cursor:"pointer"
        
        }}
    />,
    largeicon: <Icon
  icon="fluent-mdl2:completed"
  style={{
    width: "2.5rem",
    height: "2.5rem",
    color: "rgb(30 171 7)",
    cursor:"pointer"
    
    }}
/>}, {name:'sent for dilevery', icon:<Icon
      icon="hugeicons:delivery-truck-02"
      style={{
        width: "1.3rem",
        height: "1.3rem",
        color: "rgb(228, 123, 78)",
        cursor:"pointer"
        
        }}
    />,
    largeicon: <Icon
  icon="hugeicons:delivery-truck-02"
  style={{
    width: "3rem",
    height: "3rem",
    color: "rgb(228, 123, 78)",
    cursor:"pointer"
    
    }}
/>}, {name:'dilevered', icon:<Icon
      icon="hugeicons:package-delivered"
      style={{
        width: "1.3rem",
        height: "1.3rem",
        color: "rgb(30 171 7)",
        cursor:"pointer"
        
        }}
    />,
    largeicon: <Icon
  icon="hugeicons:package-delivered"
  style={{
    width: "3rem",
    height: "3rem",
    color: "rgb(30 171 7)",
    cursor:"pointer"
    
    }}
/>}]
    const [selectedtab, setselectedtab] = useState('Not yet started');
    const [selectedtabIcon, setselectedtabIcon] = useState(<Icon
      icon="mdi:stop-circle-outline"
      style={{
        width: "3rem",
        height: "3rem",
        color: "rgb(185 7 7)",
        cursor:"pointer"
        
        }}
    />);



    const switchTab = (comp) => {
      
        if(selectedtab!==comp.name){
            setselectedtab(comp.name)
            setselectedtabIcon(comp.largeicon)
        }
      
    }

 

  




  
    return (

        <div className="detailoutercomp">
      <div className="switchtabletabs">
        {components.length>0 && components.map((comp, index)=><button onClick={()=>switchTab(comp)}   className={selectedtab===comp.name ? "tabletabbtn select":"tabletabbtn"} key={index}>
           
           <div className={selectedtab===comp.name ? "tabletabdiv select":"tabletabdiv"}>{comp.icon}{toCamelCase(comp.name)}</div>  
           </button>)}
      </div>
      <div className="infocomp">
      
      <div > 
        <div className="tabheading" style={{width:"auto"}}>{selectedtabIcon}{toCamelCase(selectedtab)}</div>
        <AllOrder status={selectedtab} />
        
        </div>

       
      </div>
      </div>
    )
}

// ActiveOrders.propTypes = {
       
// };


export default ActiveOrders;