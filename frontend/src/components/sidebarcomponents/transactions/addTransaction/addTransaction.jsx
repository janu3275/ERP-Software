import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { Axios } from "../../../../../utils/axios.mjs";
import Table from '../../../commoncomponents/tableComponent/table';
import DialogDemo from '../../../../assets/singlecomponents/dialog/dialog';
import "./addTransaction.css";



const AddTansactions = () => {

    const incomeOptions = ['Customer payment']
    const expenseOptions = [ "EMI", 'Paid service', 'Vendor payment', 'Purchased glass accessories', 'Purchased other products', 'Salaries', 'others']

    return (

        <div style={{display:"flex", flexDirection:"row", minHeight:"60vh", width:"70vw"}}>
            <div className="leftbar" >
             <div style={{display:"flex", flexDirection:"column", gap:"10px"}}>
             <div className="optHead"> <div >Income </div>  
           
              
                    </div>
             <div style={{display:"flex", flexDirection:"column"}}>
             {incomeOptions.map((opt, index)=><button className="Button silver" key={index}>{opt}</button>)}
             </div>
             </div>
            
            <div style={{display:"flex", flexDirection:"column", gap:"10px"}}>
            <div className="optHead" > <div > Expense </div>  
           
                    </div>
            <div style={{display:"flex", flexDirection:"column"}}>
             {expenseOptions.map((opt, index)=><button className="Button silver" key={index}>{opt}</button>)}
             </div>
           </div>
           
            </div>

            <div className="rightbar"> form </div>

        
        </div>

    )
}


export default AddTansactions;