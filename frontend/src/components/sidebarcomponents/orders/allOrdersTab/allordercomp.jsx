import { Icon } from "@iconify/react/dist/iconify.js";
import Allorders from "./allorders";


const AllOrdersComp = () => {
    
 

 

  




  
    return (

    <div className="detailoutercomp">
     
      <div className="infocomp">
      
      <div> 
      <div className="tabheading" style={{width:"auto"}}>
      <Icon
            icon="charm:stack"
            style={{
              width: "3rem",
              height: "3rem",
              color: "rgb(60, 137, 255)",
              cursor:"pointer"
              
              }}
          />All orders</div>
        <Allorders  />
      </div>

       
      </div>
      </div>
    )
}



export default AllOrdersComp;