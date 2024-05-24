import { useState } from "react";
import "./CustomerManagement.css";
import CustomerPanel from "./CustomerPanel/customerPanel";
import CustomerDetails from "./Details/details";
import CustomerSummary from "./summary/summary";
import Customer from "./catalog/customer";



const CustomerManagement = () => { 

    const [selectedTab, setselectedTab] = useState({
        summary:true, 
        CustomerId: null,
        catalog: false
        
    })

    const selectCustomer = (id) => {
    setselectedTab((prev) => {
        return {
            ...prev,
            summary:false,
            CustomerId:id,
            catalog: false
           
        }
    })
    }

    const selectSummaryTab = () => {
        setselectedTab((prev)=>{
            return {
                ...prev,
                summary:true,
                CustomerId:null,
                catalog: false
               
            }
        })
    }


    const selectCatalogTab = () => {

        setselectedTab((prev) => {
            return {
                ...prev,
                summary:false,
                CustomerId:null,
                catalog: true
            }
        })
    }

 

   
  
    return (

    <div style={{display:"flex", height:"-webkit-fill-available"}} >
      
       <CustomerPanel
       selectCustomer={selectCustomer}
       selectSummaryTab={selectSummaryTab}
       selectedTab={selectedTab}
       selectCatalogTab={selectCatalogTab}
       

       />

       {
       selectedTab.CustomerId ? 
       <CustomerDetails
       CustomerId={selectedTab.CustomerId}
       />
       :
       selectedTab.summary? <CustomerSummary />
       :
       selectedTab.catalog? <Customer />
      : <></>

       }

      

        
    </div>
    )
}


export default CustomerManagement;