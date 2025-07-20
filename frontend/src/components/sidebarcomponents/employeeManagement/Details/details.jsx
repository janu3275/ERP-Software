import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import PropTypes from "prop-types";
import "./details.css";
import { Axios } from "../../../../../utils/axios.mjs";
import EmployeeInfoform from "./Info/Infoform";
import EmployeePayments from './payments/payments';
import Attendance from "./Attendance/attendance";
import { returnItems } from "../../../../commonfn";


const EmployeeDetails = ({employeeId}) => {
    
    const components = [{name:'Employee details', 
      icon:<Icon
      icon="mdi:file-account-outline"
      style={{
        width: "1.5rem",
        height: "1.5rem",
        color: "rgb(228 123 78)",
        cursor:"pointer"
        
        }}
    />,
    largeicon: <Icon
    icon="mdi:file-account-outline"
    style={{
      width: "3rem",
      height: "3rem",
      color: "rgb(228 123 78)",
      cursor:"pointer"
      
      }}
  />
    },{name:'Employee Payments',
      icon:<Icon
      icon="tdesign:money"
      style={{
        width: "1.3rem",
        height: "1.3rem",
        color: "rgb(30 171 7)",
        cursor:"pointer"
        
        }}
    />,
    largeicon: <Icon
  icon="tdesign:money"
  style={{
    width: "3rem",
    height: "3rem",
    color: "rgb(30 171 7)",
    cursor:"pointer"
    
    }}
/>}, {name:'Employee Attendance', icon:<Icon
      icon="icon-park-outline:people-bottom"
      style={{
        width: "1.5rem",
        height: "1.5rem",
        color: "rgb(60, 137, 255)",
        cursor:"pointer"
        
        }}
    />,
    largeicon: <Icon
  icon="icon-park-outline:people-bottom"
  style={{
    width: "2.8rem",
    height: "2.8rem",
    color: "rgb(60, 137, 255)",
    cursor:"pointer"
    
    }}
/>}]

    const [selectedtab, setselectedtab] = useState('Employee details')
    const [selectedtabIcon, setselectedtabIcon] = useState(<Icon
      icon="mdi:file-account-outline"
      style={{
        width: "3rem",
        height: "3rem",
        color: "rgb(228 123 78)",
        cursor:"pointer"
        
        }}
    />);
    const [employeeInfo, setemployeeInfo] = useState(null)
    const [posAndDepartArr, setposAndDepartArr] = useState({
      posItems:[],
      DepartItems:[]
  });

  const returnPositionid = (position, items) => { 
        
    const positionid = items[0].items.filter((item)=>item.value===position)[0].id
    if(positionid){
        return positionid
    }
    return null
}

    const returnDepartmentid = (department, items) => { 
        
      const departmentid = items[0].items.filter((item)=>item.value===department)[0].id
      if(departmentid){
          return departmentid
      }
      return null

    }

    const returnAllPosition = async() => {
        try {
          let res = await Axios.get(`/position/getall`)
          if(res.data.success){
            console.log(res.data.data)
            let arr = [...res.data.data]
            return arr
         }
        } catch (error) {
          console.log(error)
          return []
        }
    }

    const returnAllDepartment = async() => {
        try {
          let res = await Axios.get(`/department/getall`)
          if(res.data.success){
            console.log(res.data.data)
            let arr = [...res.data.data]
            return arr
         }
        } catch (error) {
          console.log(error)
          return []
        }
    }

    // label and value are the keys used to get values for label and values, name is just for dropdown title
  
    const initialiseData = async(employeeId) => {
      const posArr = await returnAllPosition()
      const departmentArr = await returnAllDepartment()
      const positems = returnItems(posArr, 'position_name', 'position_name', 'Positions')
      const departitems = returnItems(departmentArr, 'department_name', 'department_name', 'Departments')

      setposAndDepartArr({
        posItems:positems,
        DepartItems: departitems
      })
      const employee = await returnEmployeeInfoById(employeeId)
      setemployeeInfo(employee)
    }

    const returnEmployeeInfoById = async(employeeId) => { 
        console.log(employeeId)
        try {
            let res = await Axios.get(`/employee/getbyid/${employeeId}`)
            if(res.data.success){
              console.log(res.data.data)
              let Employeeinfo = res.data.data
              return Employeeinfo
              
            }
          } catch (error) {
            console.log(error)
          }
    }

    const switchTab = (comp) => {
      
      if(selectedtab!==comp.name){
          setselectedtab(comp.name)
          setselectedtabIcon(comp.largeicon)
      }
    
  }

    const UpdateEmployee = async({data, Employeeid}) => {

      console.log(data)

      const position = data.position_name
      const positionid = returnPositionid(position, posAndDepartArr.posItems)
      const department = data.department_name
      const departmentid = returnDepartmentid(department, posAndDepartArr.DepartItems)


      if(!positionid || !departmentid){
          console.log("no position or department id found")
          return 
      }

      try {
        let body = {
          employee_id: `${Employeeid}`, 
          ...data,
          position_id:positionid,
          department_id: departmentid

        }

        let res = await Axios.post( `/employee/update`, body )

        if(res.data.success){
          const employee = await returnEmployeeInfoById(Employeeid)
          setemployeeInfo(employee)
        }

      } catch (error) {
        console.log(error)
      }
    }

  



    useEffect(() => {
    initialiseData(employeeId)
    },[employeeId])

  
    return (
        <div style={{overflow:"auto", marginRight:"-20px"}} className="detailoutercomp">
      <div className="switchtabletabs">
        {components.length>0 && components.map((comp, index)=><button onClick={()=>switchTab(comp)}  className={selectedtab===comp.name ? "tabletabbtn select":"tabletabbtn"} key={index}> <div className={selectedtab===comp.name ? "tabletabdiv select":"tabletabdiv"}>{comp.icon}{comp.name}</div> </button>)}
      </div>
      <div className="infocomp">
      {employeeInfo && selectedtab==='Employee details' && 
      <div style={{width:"max-content", margin:"auto", marginBottom:"80px"}}>  
        <div style={{width:"auto"}} className="tabheading">{selectedtabIcon}{selectedtab}</div>
        {employeeInfo && <EmployeeInfoform selectedEmployee={employeeInfo} UpdateEmployee={UpdateEmployee} posItems={posAndDepartArr.posItems} departItems={posAndDepartArr.DepartItems}/> }
        
        </div>}
        {employeeId && selectedtab==='Employee Payments' && 
      <div> 
        <div className="billtabheading">{selectedtabIcon} {selectedtab} </div>
        <EmployeePayments Payments employeeId={employeeId}/> 
        
        </div>}

        {employeeId && selectedtab==='Employee Attendance' && 
      <div> 
        <div className="billtabheading">{selectedtabIcon} {selectedtab} </div>
        <Attendance employeeId={employeeId}/> 
        
        </div>}
      </div>
      </div>
    )
}

EmployeeDetails.propTypes = {
       employeeId: PropTypes.any.isRequired
};


export default EmployeeDetails;