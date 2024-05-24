import { useEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react";
import PropTypes from "prop-types";
import "./EmployeePanel.css";
import { Axios } from "../../../../../utils/axios.mjs";
import { toCamelCase } from "../../../../commonfn";
import Stextfield from "../../../../assets/singlecomponents/singletextfield/stextfield";
import "./employeePanel.css";

const EmployeePanel = ({ selectEmployee, selectSummaryTab, selectedTab , selectCatalogTab, selectAttendanceTab}) => {

    const [employees, setemployees]  =  useState([])
    const [filteredEmployees, setfilteredemployees] = useState([])
    const [searchvalue, setsearchValue] = useState('')

    const initiliseData = async() => {
        const allemployees = await returnAllEmployee()
        console.log(employees)
        setemployees(allemployees)
        setfilteredemployees(allemployees)
    }


    const returnAllEmployee = async() => {
        try {

          let res = await Axios.get(`employee/getall`)
          if(res.data.success){
            console.log(res.data.data)
            let Employeearr = [...res.data.data]
            return Employeearr
          }
        } catch (error) {
          console.log(error)
        }

      }

      const filterEmployees = (e, name, index) => {
          let val = e.target.value
          setsearchValue(val)
          const filterEmployees =  employees.filter((emp)=>(emp.first_name + emp.last_name).toLowerCase().includes(val))
          setfilteredemployees(filterEmployees)
      }

     

      useEffect(() => {
        initiliseData()
      },[])
  
    return (
       
      <div className="OuterComp">

      
        <div className="Comp">
        <div className="sidebartopdiv" >
         {/* <div style={{display:"flex", alignItems:"center", justifyContent:"space-between", gap:"20px", width:"-webkit-fill-available"}}>
        <div>Employees</div> 
        <button  className="tertiarybtn">+ Add</button>
        </div>  */}
        
          <button className={selectedTab.summary?"sidebarButton select":"sidebarButton"}  onClick={()=>selectSummaryTab()}> 
            <div className="singlepanel" >
                <div className="PanelName">Summary</div>
                <div>  
                    {selectedTab.summary && <Icon
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
        <button className={selectedTab.catalog?"sidebarButton select":"sidebarButton"}  onClick={()=>selectCatalogTab()}> 
            <div className="singlepanel" >
                <div className="PanelName">Catalog</div>
                <div>  
                    {selectedTab.catalog && <Icon
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
        <button className={selectedTab.attendance?"sidebarButton select":"sidebarButton"}  onClick={()=>selectAttendanceTab()}> 
            <div className="singlepanel" >
                <div className="PanelName">Attendance</div>
                <div>  
                    {selectedTab.attendance && <Icon
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
        <div style={{width:"-webkit-fill-available", marginTop:"10px"}}>
        <Stextfield
          name='employee'
          label=""
          value={searchvalue}
          type="text"
          labelclassname=""
          textfieldclassname="primarytextfieldclass"
          divclassname="primarytextdivclass"
          placeholder="search employee .."
          onChange={filterEmployees}
          index={-1}
          disabled={false}
          error={undefined}
        /></div>   
         </div>
         <div className="sidebarmiddiv">
        {filteredEmployees.length>0 && filteredEmployees.map((employee, index)=><button key={index} className={selectedTab.employeeId==employee.id?"sidebarButton select":"sidebarButton"}   onClick={()=>selectEmployee(employee.id)}>
        <div className="singlepanel" >
           
                <div className="PanelName">{toCamelCase(employee.first_name) + " " +  toCamelCase(employee.last_name)}</div>
                
          
            <div>
            {selectedTab.employeeId==employee.id && <Icon
                icon="iconamoon:arrow-right-2-bold"
                style={{
                  width: "1.2rem",
                  height: "1.2rem",
                  color: "#515151",
                  cursor: "pointer",
                }}
                />}
            </div>
        </div>
        </button>)}
        </div>
        </div>

       
      </div>
     

        
     
    )
}

EmployeePanel.propTypes = {

    selectSummaryTab: PropTypes.func.isRequired,
    selectEmployee: PropTypes.func.isRequired,
    selectedTab: PropTypes.object.isRequired,
    selectCatalogTab: PropTypes.func.isRequired,
    selectAttendanceTab: PropTypes.func.isRequired

  };


export default EmployeePanel;