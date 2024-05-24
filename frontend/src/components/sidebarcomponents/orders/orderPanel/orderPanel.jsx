import { Icon } from "@iconify/react";
import PropTypes from "prop-types";
import "./OrderPanel.css";


const OrderPanel = ({  selectTab, selectedTab }) => {



     

  
    return (
       
      <div className="OuterComp">
      <div className="Comp">
      <div className="sidebartopdiv" >
        <button className={selectedTab.newOrder?"sidebarButton select":"sidebarButton"}  onClick={()=>selectTab('newOrder')}> 
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
        </button>
        <button className={selectedTab.activeOrders?"sidebarButton select":"sidebarButton"}  onClick={()=>selectTab('activeOrders')}> 
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
        </button>
        <button className={selectedTab.holdOrders?"sidebarButton select":"sidebarButton"}  onClick={()=>selectTab('holdOrders')}> 
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
        </button>
        <button className={selectedTab.removedOrders?"sidebarButton select":"sidebarButton"}  onClick={()=>selectTab('removedOrders')}> 
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
        </button>
        <button className={selectedTab.allOrders?"sidebarButton select":"sidebarButton"}  onClick={()=>selectTab('allOrders')}> 
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
        </button>
       
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