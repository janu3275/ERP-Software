import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import OrderPanel from "./orderPanel/orderPanel";
import NewOrder from "./neworder/neworder";
import ActiveOrders from "./activeOrders/activeOrders";
import HoldOrders from "./holdOrders/holdOrders";
import RemovedOrders from "./removeOrders/removeOrder";
import AllOrdersComp from "./allOrdersTab/allordercomp";

const OrderManagement = () => {

    const [selectedTab, setselectedTab] = useState({
        newOrder:true, 
        activeOrders: false,
        holdOrders: false,
        removedOrders: false,
        allOrders: false
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
       <OrderPanel
       selectTab={selectTab}
       selectedTab={selectedTab}
       />
       {
       selectedTab.newOrder ? 
       <NewOrder/>
       :
       selectedTab.activeOrders ? 
       <ActiveOrders/>
        :
        selectedTab.holdOrders ? 
        <HoldOrders/>
        :
        selectedTab.removedOrders ? 
       <RemovedOrders/>
       :
       selectedTab.allOrders ?
       <AllOrdersComp />:
       <></> 
       }

      

        
        </div>
    )
}


export default OrderManagement;