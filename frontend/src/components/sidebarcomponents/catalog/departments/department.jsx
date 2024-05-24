import { useEffect, useState } from "react";

import { Icon } from "@iconify/react";

import Departmentform from './departmentform';
import { Axios } from "../../../../../utils/axios.mjs";
import DialogDemo from "../../../../assets/singlecomponents/dialog/dialog";
import Table from "../../../commoncomponents/tableComponent/table";



const Department = () => {
    const [openDepartmentForm, setOpenDepartmentForm] = useState(false);
    const [allDepartmentinfo, setallDepartmentinfo] = useState([]);
    const [tableData, settableData] = useState(null);
    const [selectedDepartment, setselectedDepartment] = useState(null);

    const createNewDepartment = async(data) => {
      try {
        let body = {
            department_name: data.Department
       
        }
        let res = await Axios.post(`/Department/add`, body )

        if(res.data.success){
          getAllDepartment()
          setOpenDepartmentForm(false)
        }

      } catch (error) {
        console.log(error)
      }
    }

    const getAllDepartment = async() => {
      try {
        let res = await Axios.get(`/Department/getall`)
        if(res.data.success){
          console.log(res.data.data)
          let Departmentarr = [...res.data.data]
          setallDepartmentinfo(Departmentarr)
          let tableobj = convertDataForTable(Departmentarr);
          settableData(tableobj)
        }
      } catch (error) {
        console.log(error)
      }
    }

  const convertDataForTable = (data) => {
    let Departmentarr = [...data]
    const header =  [{
      "columnName": "Department",
      "type": "string",
      "colNo": 1,
      "width": 100,
      "sorted":null
    }]
    
    const rows = Departmentarr.map((obj, index) => {
        let row = [];
        Object.entries(obj).forEach(([key, value]) => {
        if(key==='department_name'){
         row.push({ key, value, type:'string', width:100, rowNo:index+1, colNo:1, id:obj.id })
        }
      
      })
      return row
    })

    const rowWiseFunctions = [{funcName:'edit', funct:(Department)=>DepartmentFormOpen(Department, Departmentarr) , icon: <Icon
    icon="mi:edit-alt"
    style={{
      width: "1.2rem",
      height: "1.2rem",
      Department: "#3f3f3f",
      cursor: "pointer"
    }}
  />}, {funcName:'delete', funct:(Department)=>DeleteDepartment(Department, Departmentarr), icon: <Icon
  icon="mi:edit-alt"
  style={{
    width: "1.2rem",
    height: "1.2rem",
    Department: "#3f3f3f",
    cursor: "pointer",
  }}
/>}]


const groupFunctions = [];
const name = 'Department'

const tableData = {name, groupFunctions, rowWiseFunctions, header, rows}
console.log(tableData)
return tableData


    }

    const DeleteDepartment = async(Department, Departmentarr) => {
      try {
        const selctedDepartmentRow = Departmentarr.filter((row)=>row.id===Department[0].id)[0] || null
        if(!selctedDepartmentRow){
          console.log(selctedDepartmentRow)
          return 
        }
        let res = await Axios.delete(`/Department/delete?department_id=${selctedDepartmentRow.id}`)
        if(res.data.success){
          getAllDepartment()
          
        }
      } catch (error) {
        console.log(error)
      }
    }

    const UpdateDepartment = async(data) => {
      console.log(data)
      try {
        let body = {
          department_id: `${data.Departmentid}`, 
          department_name: data.data.Department
        }
        let res = await Axios.post(`/Department/update`, body)
        if(res.data.success){
          getAllDepartment()
          setselectedDepartment(null)
          setOpenDepartmentForm(false)
        }
      } catch (error) {
        console.log(error)
      }
    }

    const DepartmentFormOpen = (Department,Departmentarr ) => {
      console.log(Department, Departmentarr, tableData)
      const selctedDepartmentRow = Departmentarr.filter((row)=>row.id===Department[0].id)[0] || null
      console.log(selctedDepartmentRow)
      setselectedDepartment(selctedDepartmentRow)
      setOpenDepartmentForm(true)

    }

    useEffect(() => {
      getAllDepartment()
    },[])

    console.log(allDepartmentinfo)
    return (
        <div>
         <div style={{position:"relative"}}>
         <div style={{ width: "fit-content", position: "absolute" , right: '30px', zIndex: 1}}> 
        <DialogDemo Open={openDepartmentForm} setOpen={setOpenDepartmentForm} buttontext="Add department" btnclass = 'primarybtndiv'> 
         {(props) => (
              <Departmentform
                {...props}
                createNewDepartment={createNewDepartment}
                selectedDepartment={selectedDepartment}
                UpdateDepartment={UpdateDepartment}
              />
            )}
         </DialogDemo>
         </div>
           </div>
         
       { tableData && <Table  data={tableData} /> }

        
        </div>
    )
}


export default Department;