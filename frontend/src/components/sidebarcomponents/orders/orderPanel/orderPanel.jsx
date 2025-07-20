import { Icon } from "@iconify/react";
import PropTypes from "prop-types";
import "./OrderPanel.css";
import PanelButton from "../../../../assets/singlecomponents/panelButton/panelbutton";


const OrderPanel = ({  selectTab, selectedTab }) => {



     

  
    return (
       
      <div className="OuterComp">
      <div className="Comp">
      <div className="sidebartopdiv" >
        {/* <button className={selectedTab.newOrder?"sidebarButton select":"sidebarButton"}  onClick={()=>selectTab('newOrder')}> 
            <div className="singlepanel" >
                <div className="PanelName">New order</div>
                <div>  
                    {selectedTab.newOrder && <Icon
                icon="iconamoon:arrow-right-2-bold"
                style={{
                  width: "1.2rem",
                  height: "1.2rem",
                  color: "#515151",
                  cursor: "pointer",
                }}
                />}</div>
            </div>  
        </button> */}
        <PanelButton selected={selectedTab.newOrder} name="New order" funct={selectTab} functprop='newOrder'
        icon={<Icon
            icon="mingcute:file-new-line"
            style={{
              width: "1.3rem",
              height: "1.3rem",
              color: "rgb(60, 137, 255)",
              cursor:"pointer"
              
              }}
          />}
        />
        {/* <button className={selectedTab.activeOrders?"sidebarButton select":"sidebarButton"}  onClick={()=>selectTab('activeOrders')}> 
            <div className="singlepanel">
                <div className="PanelName">Active orders</div>
                <div>  
                    {selectedTab.activeOrders && <Icon
                icon="iconamoon:arrow-right-2-bold"
                style={{
                  width: "1.2rem",
                  height: "1.2rem",
                  color: "#515151",
                  cursor: "pointer",
                }}
                />}</div>
            </div>  
        </button> */}
        <PanelButton selected={selectedTab.activeOrders} name="Active orders" funct={selectTab} functprop='activeOrders' 
        icon={<Icon
            icon="material-symbols-light:inactive-order-outline"
            style={{
              width: "1.3rem",
              height: "1.3rem",
              color: "rgb(14 151 50)",
              cursor:"pointer"
              
              }}
          />}
        />
        {/* <button className={selectedTab.holdOrders?"sidebarButton select":"sidebarButton"}  onClick={()=>selectTab('holdOrders')}> 
            <div className="singlepanel" >
                <div className="PanelName">Hold orders</div>
                <div>  
                    {selectedTab.holdOrders && <Icon
                icon="iconamoon:arrow-right-2-bold"
                style={{
                  width: "1.2rem",
                  height: "1.2rem",
                  color: "#515151",
                  cursor: "pointer",
                }}
                />}</div>
            </div>  
        </button> */}
         <PanelButton selected={selectedTab.holdOrders} name="Hold orders" funct={selectTab} functprop='holdOrders'
         icon={<Icon
            icon="hugeicons:hold-03"
            style={{
              width: "1.5rem",
              height: "1.5rem",
              color: "rgb(223 207 56)",
              cursor:"pointer"
              
              }}
          />}
          left="-42.8px"
         />
        {/* <button className={selectedTab.removedOrders?"sidebarButton select":"sidebarButton"}  onClick={()=>selectTab('removedOrders')}> 
            <div className="singlepanel" >
                <div className="PanelName">Removed orders</div>
                <div>  
                    {selectedTab.removedOrders && <Icon
                icon="iconamoon:arrow-right-2-bold"
                style={{
                  width: "1.2rem",
                  height: "1.2rem",
                  color: "#515151",
                  cursor: "pointer",
                }}
                />}</div>
            </div>  
        </button> */}
        <PanelButton selected={selectedTab.removedOrders} name="Removed orders" funct={selectTab} functprop='removedOrders'
        icon={<Icon
            icon="lets-icons:remove"
            style={{
              width: "1.3rem",
              height: "1.3rem",
              color: "rgb(185, 7, 7)",
              cursor:"pointer"
              
              }}
          />}
        />
        {/* <button className={selectedTab.allOrders?"sidebarButton select":"sidebarButton"}  onClick={()=>selectTab('allOrders')}> 
            <div className="singlepanel" >
                <div className="PanelName">All orders</div>
                <div>  
                    {selectedTab.allOrders && <Icon
                icon="iconamoon:arrow-right-2-bold"
                style={{
                  width: "1.2rem",
                  height: "1.2rem",
                  color: "#515151",
                  cursor: "pointer",
                }}
                />}</div>
            </div>  
        </button> */}
        <PanelButton selected={selectedTab.allOrders} name="All orders" funct={selectTab} functprop='allOrders' 
        icon={<Icon
            icon="charm:stack"
            style={{
              width: "1.3rem",
              height: "1.3rem",
              color: "rgb(60, 137, 255)",
              cursor:"pointer"
              
              }}
          />}
        />
       
        </div>
      
        </div>
      </div>
     

        
     
    )
}

OrderPanel.propTypes = {

    selectTab: PropTypes.func.isRequired,
    selectedTab: PropTypes.object.isRequired
   
  
  };


export default OrderPanel;