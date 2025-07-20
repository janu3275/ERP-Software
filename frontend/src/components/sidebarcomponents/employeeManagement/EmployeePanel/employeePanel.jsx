import { useEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react";
import PropTypes from "prop-types";
import "./EmployeePanel.css";
import { toCamelCase } from "../../../../commonfn";
import Stextfield from "../../../../assets/singlecomponents/singletextfield/stextfield";
import "./employeePanel.css";
import { useGetEmployeesPanel } from "./employeePanelQueryHooks";
import PanelButton from "../../../../assets/singlecomponents/panelButton/panelbutton";

const EmployeePanel = ({ selectEmployee, selectSummaryTab, selectedTab , selectCatalogTab, selectAttendanceTab}) => {

    // const [employees, setemployees] = useState([])
    // const [filteredEmployees, setfilteredemployees] = useState([])
    const [searchvalue, setsearchValue] = useState('')
   


    const { data: employees, error: getEmployeeerr, isLoading: getEmployeeIsLoading } = useGetEmployeesPanel();

    // const initiliseData = async() => {
    //     const allemployees = await returnAllEmployee()
    //     console.log(employees)
    //     setemployees(allemployees)
    //     setfilteredemployees(allemployees)
    // }


    // const returnAllEmployee = async() => {
    //     try {

    //       let res = await Axios.get(`employee/getall`)
    //       if(res.data.success){
    //         console.log(res.data.data)
    //         let Employeearr = [...res.data.data]
    //         return Employeearr
    //       }
    //     } catch (error) {
    //       console.log(error)
    //     }

    //   }


      const setFilterValue = (e, name, index) => {
        let val = e.target.value

        setsearchValue(val)
      }

      const returnfilterEmployees = (val, employees) => {
         if(!employees){
            return []
         }
         if(!val){
          return employees;
         }
     
          const filterEmployees =  employees.filter((emp) => (emp.first_name + emp.last_name).toLowerCase().includes(val.toLowerCase()))
          return filterEmployees;
 
      }

     

      // useEffect(() => {
      //   initiliseData()
      // },[])
  
    return (
       
      <div className="OuterComp">

      
        <div className="Comp">
        <div className="sidebartopdiv" >
         {/* <div style={{display:"flex", alignItems:"center", justifyContent:"space-between", gap:"20px", width:"-webkit-fill-available"}}>
        <div>Employees</div> 
        <button  className="tertiarybtn">+ Add</button>
        </div>  */}
        
          {/* <button className={selectedTab.summary?"sidebarButton select":"sidebarButton"}  onClick={()=>selectSummaryTab()}> 
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
        </button> */}
        {/* <button className={selectedTab.catalog?"sidebarButton select":"sidebarButton"}  onClick={()=>selectCatalogTab()}> 
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
        </button> */}
        <PanelButton selected={selectedTab.catalog} name="Employees"  funct={selectCatalogTab}
        icon={<Icon
          icon="simple-line-icons:people"
          style={{
            width: "1.3rem",
            height: "1.3rem",
            color: "rgb(60, 137, 255)",
            cursor:"pointer"
            
            }}
        />}
        />
        {/* <button className={selectedTab.attendance?"sidebarButton select":"sidebarButton"}  onClick={()=>selectAttendanceTab()}> 
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
        </button> */}
        <PanelButton selected={selectedTab.attendance} name="Attendance"  funct={selectAttendanceTab}
        icon={<Icon
          icon="pepicons-pencil:raise-hand"
          style={{
            width: "1.3rem",
            height: "1.3rem",
            color: "rgb(30, 171, 7)",
            cursor:"pointer"
            
            }}
        />}
        />
        </div>
        <div className="sidebarmiddiv"  >
        <div style={{width:"100%", position:"sticky", top:"0", backgroundColor:"white", zIndex:"1", paddingTop:"10px", marginLeft:"-15px", paddingLeft:"15px"}}>
         <div style={{display:"flex", alignItems:"center", justifyContent:"space-between", gap:"20px", width:"-webkit-fill-available", color:"#9f9f9f", fontSize:"14px", padding:"10px 0px", paddingTop:"0"}}>
        <div>All employees</div> 
        </div> 
        <div style={{width:"-webkit-fill-available", marginBottom:"10px"}}>
        <Stextfield
          name='employee'
          label=""
          value={searchvalue}
          type="text"
          labelclassname=""
          textfieldclassname="primarytextfieldclass"
          divclassname="primarytextdivclass"
          placeholder="search employee .."
          onChange={setFilterValue}
          index={-1}
          disabled={false}
          error={undefined}
        />
        </div>   
         </div>
    
        {returnfilterEmployees(searchvalue, employees).length>0 && returnfilterEmployees(searchvalue, employees).map((employee, index)=>
        // <button key={index} className={selectedTab.employeeId==employee.id?"sidebarButton select":"sidebarButton"}   onClick={()=>selectEmployee(employee.id)}>

        // <div className="singlepanel" >
           
        //         <div className="PanelName">{toCamelCase(employee.first_name) + " " +  toCamelCase(employee.last_name)}</div>
                
        // <div>
        //     {selectedTab.employeeId==employee.id && <Icon
        //         icon="iconamoon:arrow-right-2-bold"
        //         style={{
        //           width: "1.2rem",
        //           height: "1.2rem",
        //           color: "#515151",
        //           cursor: "pointer",
        //         }}
        //         />}
        //     </div>
        // </div>
        // </button>)}
        <PanelButton key={index} selected={selectedTab.employeeId==employee.id} name={(employee.first_name) + " " +  (employee.last_name)}  funct={selectEmployee} functprop={employee.id} 
         icon={<Icon
           icon="ic:sharp-account-circle"
           style={{
             width: "2rem",
             height: "2rem",
             color: "rgb(170 170 170)",
             cursor:"pointer"
             
             }}
         />}
         left="-48.1px"
         color="rgb(228, 123, 78)"
         />
        )}
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