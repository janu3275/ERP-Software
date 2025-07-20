import { Icon } from "@iconify/react";
import PropTypes from "prop-types";
import PanelButton from "../../../../assets/singlecomponents/panelButton/panelbutton";


const ExpensePanel = ({ selectEmiPayments, selectServiceUsedPayments, selectedTab, selectOtherExpensesTab }) => {

    return (
       
      <div className="OuterComp">

      
        <div className="Comp">
        <div className="sidebartopdiv" >
    
{/*         
          <button className={selectedTab.servicesUsedPayents?"sidebarButton select":"sidebarButton"}  onClick={()=>selectServiceUsedPayments()}> 
            <div className="singlepanel" >
                <div className="PanelName">Used services payments</div>
                <div>  
                    {selectedTab.servicesUsedPayents && <Icon
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
        <PanelButton selected={selectedTab.servicesUsedPayents} name="Used services payments"  funct={selectServiceUsedPayments}
        icon={<Icon
          icon="material-symbols:design-services-outline-rounded"
          style={{
            width: "1.3rem",
            height: "1.3rem",
            color: "rgb(60, 137, 255)",
            cursor:"pointer"
            
            }}
        />}
        />
      {/* <button className={selectedTab.emiPayments?"sidebarButton select":"sidebarButton"}  onClick={()=>selectEmiPayments()}> 
            <div className="singlepanel" >
                <div className="PanelName">Emi payments</div>
                <div>  
                    {selectedTab.emiPayments && <Icon
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
        <PanelButton selected={selectedTab.emiPayments} name="Emi payments"  funct={selectEmiPayments}
        icon={<Icon
          icon="ph:bank"
          style={{
            width: "1.3rem",
            height: "1.3rem",
            color: "rgb(228, 123, 78)",
            cursor:"pointer"
            
            }}
        />}
        />
        {/* <button className={selectedTab.otherExpenses?"sidebarButton select":"sidebarButton"}  onClick={()=>selectOtherExpensesTab()}> 
            <div className="singlepanel" >
                <div className="PanelName">Other expenses</div>
                <div>  
                    {selectedTab.otherExpenses && <Icon
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
        <PanelButton selected={selectedTab.otherExpenses} name="Other expenses"  funct={selectOtherExpensesTab}
        icon={<Icon
          icon="fluent-mdl2:checked-out-by-other-12"
          style={{
            width: "1.3rem",
            height: "1.3rem",
            color: "rgb(185, 7, 7)",
            cursor:"pointer"
            
            }}
        />}
        />
    
         </div>
        
        </div>

       
      </div>
     

        
     
    )
}

ExpensePanel.propTypes = {

    selectServiceUsedPayments: PropTypes.func.isRequired,
    selectEmiPayments: PropTypes.func.isRequired,
    selectedTab: PropTypes.object.isRequired,
    selectOtherExpensesTab: PropTypes.func.isRequired,
  
  };


export default ExpensePanel;