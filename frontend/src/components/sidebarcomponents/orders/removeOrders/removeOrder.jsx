import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import PropTypes from "prop-types";
import AllOrder from "../allOrders/allorders";

const RemovedOrders = () => {
    
 

 

  




  
    return (

    <div className="detailoutercomp">
     
      <div className="infocomp">
      
      <div> 
        <div className="tabheading" style={{width:"auto"}}>Removed orders</div>
        <AllOrder status='removed' />
      </div>

       
      </div>
      </div>
    )
}

// RemovedOrders.propTypes = {
       
// };


export default RemovedOrders;