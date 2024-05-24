import { useState } from "react";
import ExpensePanel from "./ExpensesPanel/expensesPanel";
import OtherExpensePayments from "./OtherExpensesPayments/OtherExpensesPayments";
import EmiPayments from "./EmiPayments/EmiPayments";
import ServicesUsedPayments from "./ServicesUsedpayments /ServicesUsedpayments ";


const OtherExpenses = () => {
    const [selectedTab, setselectedTab] = useState({
        emiPayments:true, 
        servicesUsedPayents: false,
        otherExpenses: false
        
    })

    const selectEmiPayments = () => {
    setselectedTab((prev)=>{
        return {
            ...prev,
            emiPayments:true, 
            servicesUsedPayents: false,
            otherExpenses: false
        }
    })
    }

    const selectServiceUsedPayments = ()=>{
        setselectedTab((prev)=>{
            return {
                ...prev,
                emiPayments: false, 
                servicesUsedPayents: true,
                otherExpenses: false
            }
        })
    }


    const selectOtherExpensesTab = () => {
        setselectedTab((prev)=>{
            return {
                ...prev,
                emiPayments: false, 
                servicesUsedPayents: false,
                otherExpenses: true
            }
        })
    }



   
  
    return (
        <div style={{display:"flex", height:"-webkit-fill-available"}}>
      
       <ExpensePanel
       selectEmiPayments={selectEmiPayments}
       selectServiceUsedPayments={selectServiceUsedPayments}
       selectedTab={selectedTab}
       selectOtherExpensesTab={selectOtherExpensesTab}
       
       />
       {
       selectedTab.emiPayments ? 
       <EmiPayments />
       :
       selectedTab.servicesUsedPayents? <ServicesUsedPayments />
       :
       selectedTab.otherExpenses? <OtherExpensePayments />
       :
       <></>

       }

      

        
        </div>
    )
}


export default OtherExpenses;