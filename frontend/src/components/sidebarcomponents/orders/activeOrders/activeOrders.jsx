import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import PropTypes from "prop-types";
import AllOrder from "../allOrders/allorders";




const ActiveOrders = () => {
    
    const components = ['Not yet started', 'In process', 'completed', 'sent for dilevery', 'dilevered']
    const [selectedtab, setselectedtab] = useState('Not yet started')
   

 


    const switchTab = (name) => {
      
        if(selectedtab!==name){
            setselectedtab(name)
        }
      
    }

 

  




  
    return (

        <div className="detailoutercomp">
      <div className="switchtabletabs">
        {components.length>0 && components.map((name, index)=><button onClick={()=>switchTab(name)}  className={selectedtab===name ? "tabletabbtn select":"tabletabbtn"} key={index}> <div className={selectedtab===name ? "tabletabdiv select":"tabletabdiv"}>{name}</div>  </button>)}
      </div>
      <div className="infocomp">
      
      <div > 
        <div className="tabheading" style={{width:"auto"}}>{selectedtab}</div>
        <AllOrder status={selectedtab} />
        
        </div>

       
      </div>
      </div>
    )
}

// ActiveOrders.propTypes = {
       
// };


export default ActiveOrders;