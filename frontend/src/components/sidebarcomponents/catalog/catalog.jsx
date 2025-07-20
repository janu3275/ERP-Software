import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import CommonComp from "./commonComp";
import CatalogPanel from "./catalogPanel/catalogPanel";

const Catalog = () => {

    const [selectedTab, setselectedTab] = useState({
        customers:false, 
        departments: false,
        positions: false,
        expenseServices: false,
        emiTypes: false,
        glassColor: false,
        glassCompany:false, 
        glassSize: false,
        glassThickness: false,
        glassTypes: false,
        glassCustomisation: false,
        glassDilevery: false,
        glassFitting: false,
        glassMeasurement: false,
        glassAccessory: true,
        glassInventory: false,
        glassProducts: false,
        otherProducts: false,
        units: false
    })

  

    const selectTab = (tab) => {
       
        setselectedTab((prev) => {
            const newState = Object.keys(prev).reduce((acc, key) => {
              acc[key] = key === tab;
              return acc;
            }, {});
            return newState;
          });
    }
   
  
    return (
    <div style={{display:"flex"}}>
       <CatalogPanel
       selectTab={selectTab}
       selectedTab={selectedTab}
       />
       <CommonComp selectedtab={selectedTab}/>

      

        
        </div>
    )
}


export default Catalog;