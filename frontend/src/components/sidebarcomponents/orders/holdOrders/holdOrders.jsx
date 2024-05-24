import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import PropTypes from "prop-types";
import AllOrder from "../allOrders/allorders";

const HoldOrders = () => {
    
 

 

  




  
    return (

    <div className="detailoutercomp">
     
      <div className="infocomp">
      
      <div> 
      <div className="tabheading" style={{width:"auto"}}>Hold orders</div>
        <AllOrder status='hold' />
      </div>

       
      </div>
      </div>
    )
}

// HoldOrders.propTypes = {
       
// };


export default HoldOrders;