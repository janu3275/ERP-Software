import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";


import "./VendorAccounting.css";
import VendorPanel from "./vendorPanel/vendorPanel";
import VendorDetails from "./Details/details";
import VendorSummary from "./summary/summary";
import Vendor from "./catalog/vendor";

const VendorAccounting = () => {
    const [selectedTab, setselectedTab] = useState({
        summary:true, 
        vendorId: null,
        catalog: false
    })

    const selectVendor = (id) => {
    setselectedTab((prev)=>{
        return {
            ...prev,
            summary:false,
            vendorId:id,
            catalog:false
        }
    })
    }

    const selectSummaryTab = ()=>{
        setselectedTab((prev)=>{
            return {
                ...prev,
                summary:true,
                vendorId:null,
                catalog:false
            }
        })
    }

    const selectCatalogTab = ()=>{
        setselectedTab((prev)=>{
            return {
                ...prev,
                summary:false,
                vendorId:null,
                catalog:true
            }
        })
    }
   
  
    return (
        <div style={{display:"flex"}}>
       <VendorPanel
       selectVendor={selectVendor}
       selectSummaryTab={selectSummaryTab}
       selectCatalogTab={selectCatalogTab}
       selectedTab={selectedTab}
       />
       {
       selectedTab.vendorId ? 
       <VendorDetails
       vendorId={selectedTab.vendorId}
       />
       : 
       selectedTab.catalog ? 
       <Vendor
       
       />
       :
       <VendorSummary />
       }

      

        
        </div>
    )
}


export default VendorAccounting;