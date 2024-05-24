import { useState } from "react";
import "./employeeManagement.css";
import EmployeePanel from "./EmployeePanel/employeePanel";
import EmployeeDetails from "./Details/details";
import EmployeeSummary from "./summary/summary";
import employeeWallPaper from "../../../assets/images/dark-grunge-style-scratched-metal-surface_1048-12951.avif"
import Employee from "./catalog/employee";
import AllEmployeeAttendance from './allEmployeeAttendance/allEmployeeAttendance';


const EmployeeManagement = () => {
    const [selectedTab, setselectedTab] = useState({
        summary:true, 
        employeeId: null,
        catalog: false,
        attendance: false
    })

    const selectEmployee = (id) => {
    setselectedTab((prev)=>{
        return {
            ...prev,
            summary:false,
            employeeId:id,
            catalog: false,
            attendance: false
        }
    })
    }

    const selectSummaryTab = ()=>{
        setselectedTab((prev)=>{
            return {
                ...prev,
                summary:true,
                employeeId:null,
                catalog: false,
                attendance: false
            }
        })
    }


    const selectCatalogTab = ()=>{
        setselectedTab((prev)=>{
            return {
                ...prev,
                summary:false,
                employeeId:null,
                catalog: true,
                attendance: false
            }
        })
    }

    const selectAttendanceTab = ()=>{
        setselectedTab((prev)=>{
            return {
                ...prev,
                summary:false,
                employeeId:null,
                catalog: false,
                attendance: true
            }
        })
    }

   
  
    return (
        <div style={{display:"flex", height:"-webkit-fill-available"}}>
      
       <EmployeePanel
       selectEmployee={selectEmployee}
       selectSummaryTab={selectSummaryTab}
       selectedTab={selectedTab}
       selectCatalogTab={selectCatalogTab}
       selectAttendanceTab={selectAttendanceTab}
       />
       {
       selectedTab.employeeId ? 
       <EmployeeDetails
       employeeId={selectedTab.employeeId}
       />
       :
       selectedTab.summary? <EmployeeSummary />
       :
       selectedTab.catalog? <Employee />
       :
       selectedTab.attendance ? <AllEmployeeAttendance />
       : <></>

       }

      

        
        </div>
    )
}


export default EmployeeManagement;