import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import PropTypes from "prop-types";
import AllOrder from "../allOrders/allorders";

const RemovedOrders = () => {
    
 

 

  




  
    return (

    <div className="detailoutercomp">
     
      <div className="infocomp">
      
      <div> 
        <div className="tabheading" style={{width:"auto"}}>
        <Icon
            icon="lets-icons:remove"
            style={{
              width: "3rem",
              height: "3rem",
              color: "rgb(185, 7, 7)",
              cursor:"pointer"
              
              }}
          />
          Removed orders</div>
        <AllOrder status='removed' />
      </div>

       
      </div>
      </div>
    )
}

// RemovedOrders.propTypes = {
       
// };


export default RemovedOrders;