import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import PropTypes from "prop-types";
import AllOrder from "../allOrders/allorders";

const HoldOrders = () => {
    
 

 

  




  
    return (

    <div className="detailoutercomp">
     
      <div className="infocomp">
      
      <div> 
      <div className="tabheading" style={{width:"auto"}}> <Icon
            icon="hugeicons:hold-03"
            style={{
              width: "3rem",
              height: "3rem",
              color: "rgb(223 207 56)",
              cursor:"pointer"
              
              }}
          /> Hold orders</div>
        <AllOrder status='hold' />
      </div>

       
      </div>
      </div>
    )
}

// HoldOrders.propTypes = {
       
// };


export default HoldOrders;