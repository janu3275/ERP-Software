import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Axios } from "../../../../../utils/axios.mjs";
import Table from "../../../commoncomponents/tableComponent/table";
import { returnAllemployee, returnAttendanceStatusEle, returnConvertedDate, returnItems, returnOtherEle } from "../../../../commonfn";
import StackedImages from "../../../../assets/singlecomponents/stackedimages/stackedimages";
import { statusItems } from "../../orders/allOrders/staticOptions";
import { Icon } from "@iconify/react/dist/iconify.js";



const TakeAttendance = ({ choosenDate, closeForm }) => {
  
  
    const [allemployeeinfo, setallemployeeinfo] = useState([]);
    const [attendanceExisted, setAttendanceExisted] = useState(false);
    const [tableData, settableData] = useState(null);
    const [posAndDepartArr, setposAndDepartArr] = useState({
        posItems:[],
        DepartItems:[]
    });

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

    const returnAllEmployeeAttendance = async() => {
      try {

        const res = await Axios.get(`/employeeAttendance/getbydate/${choosenDate}`)

          if(res.data.success){
            console.log(res.data.data)
            let employeearr = [...res.data.data]
            return employeearr
          }

        } catch (error) {
          console.log(error)
        }

      }



      const setinitialData = async () => {

        const posArr = await returnAllPosition()
        const departmentArr = await returnAllDepartment()
        const positems = returnItems(posArr, 'position_name', 'position_name', 'Positions')
        const departitems = returnItems(departmentArr, 'department_name', 'department_name', 'Departments')

        setposAndDepartArr({
          posItems:positems,
          DepartItems: departitems
        })
        
        getDataAndRefreshTable(positems, departitems)
       

    }

    const getDataAndRefreshTable = async(positems, departitems) => {

        let employeearr = await returnAllemployee()
        const currentDateAttendanceArr = await returnAllEmployeeAttendance() 
        console.log(currentDateAttendanceArr)
        if(currentDateAttendanceArr && currentDateAttendanceArr.length>0){
            employeearr = [...currentDateAttendanceArr]
            setAttendanceExisted(true)
        }
        console.log(employeearr)
            employeearr = employeearr.map((employee) => {
                return {
                    ...employee,
                    attendance_status: employee.attendance_status? employee.attendance_status: 'absent'
                }
            })
       
            setallemployeeinfo(employeearr)
      
        const tableobj = convertDataForTable(employeearr, positems, departitems);
        settableData(tableobj)
        
    }

 

const convertDataForTable = (data, positems, departitems) => {

       let employeearr = [...data]

       const header =  [
        {
            "columnName": "Photo",
            "type": "attachment/link",
            "colNo": 1,
            "width": 100,
            "sorted": null
        },      
       {
      "columnName": "Name",
      "type": "string",
      "colNo": 2,
      "width": 100,
      "sorted": null
      },
    
      
        { 
                "columnName": "Department",
                "type": "options",
                "colNo": 3,
                "width": 100,
                "sorted": null,
                "options": departitems
              },
              { 
                "columnName": "Position",
                "type": "options",
                "colNo": 4,
                "width": 100,
                "sorted": null,
                "options": positems
              },{ 
                "columnName": "Status",
                "type": "options",
                "colNo": 5,
                "width": 100,
                "sorted":null,
                "options": statusItems
              }
             ]
    
      let rows = []
    
      employeearr.forEach((obj, index) => {
        let row = [];
       
         if(obj.employee_photo){
            row.push({ key:'employee_photo', value: <StackedImages key={index} images={obj.employee_photo} imageSize={20} />, type:'attachment/link', width:100, rowNo:index+1, colNo:1, id:obj.id })
         }
         if(obj.first_name && obj.last_name){
            row.push({ key:'name', value:`${obj.first_name} ${obj.last_name} `, type:'string', width:100, rowNo:index+1, colNo:2, id:obj.id })
         }
         if(obj.department_name){
            row.push({ key:'department_name', value: obj.department_name, type:'string', width:100, rowNo:index+1, colNo:3, id:obj.id })
         } 
         if(obj.position_name){
            row.push({ key:'position_name', value: obj.position_name, type:'string', width:100, rowNo:index+1, colNo:4, id:obj.id })
         }
         if(obj.attendance_status){
            row.push({ key:'attendance_status', value: obj.attendance_status, ele: returnAttendanceStatusEle(obj.attendance_status),  type:'options', width:100, rowNo:index+1, colNo:5, id:obj.id })
         }
        
      console.log(row)
      if(row.length==5){
        rows.push(row) 
      }

    })

const rowWiseFunctions = [];
const groupFunctions = [];
const checkedRows = employeearr.filter((employee)=>employee.attendance_status==='present')
const funcOnRowCheak = (selectedrows) => selectRows(selectedrows, employeearr, positems, departitems)
const name = 'employee'

const tableData = { name, groupFunctions, rowWiseFunctions, funcOnRowCheak,  header, rows , checkedRows }
console.log(tableData)
return tableData


}




      const selectRows = ( rows, employeearr, positems, departitems ) => {

        const selectedIdArr = rows.map((row)=> row[0].id)
        let newemployeearr = employeearr.map((employee) => {
            return {
                ...employee,
                attendance_status: selectedIdArr.includes(employee.id)? 'present':'absent'
            } 
        })
        setallemployeeinfo(newemployeearr)
        const tableobj = convertDataForTable(newemployeearr, positems, departitems);
        settableData(tableobj)
       
    }
    

    const saveAttendance = async() => {

        const attendanceArr = allemployeeinfo.map((employee)=>{
            return {
                employee_id: employee.id,
                attendance_status: employee.attendance_status
            }
            
        }) 

        console.log(attendanceArr)

        try { 

      let body = {
        date: choosenDate,
        attendance: attendanceArr
      }

     let res = await Axios.post( `/employeeAttendance/addbydate`, body )
        if(res.data.success){
            const currentMonth = choosenDate.getMonth() + 1;
            const currentYear = choosenDate.getFullYear();
            closeForm(currentMonth, currentYear)
        }

      } catch (error) {
        console.log(error)
      }


    }

    const updateAttendance = async() => {

        const attendanceArr = allemployeeinfo.map((employee)=>{
            return {
                employee_id: employee.id,
                attendance_status: employee.attendance_status
            }
            
        }) 
        try { 

      let body = {
        date: choosenDate,
        attendance: attendanceArr
      }

     let res = await Axios.post( `/employeeAttendance/updatebydate`, body )
        if(res.data.success){
          const currentMonth = choosenDate.getMonth() + 1;
          const currentYear = choosenDate.getFullYear();
          closeForm(currentMonth, currentYear)
        }

      } catch (error) {
        console.log(error)
      }


    }

    const removeAttendance = async() => {
        try {
        
          let res = await Axios.delete(`/employeeAttendance/deletebydate?date=${choosenDate}`)
          if(res.data.success){
            const currentMonth = choosenDate.getMonth() + 1;
            const currentYear = choosenDate.getFullYear();
            closeForm(currentMonth, currentYear)
            
          }
        } catch (error) {
          console.log(error)
        }
      }

      
   
   



   

    useEffect(() => {
      setinitialData()
    },[])

    console.log(allemployeeinfo, posAndDepartArr, tableData)
    return (

        <div className="normalDialog">
     <div className="infocomp">
        <div style={{ fontWeight:"500", color:"#0f0f0f", border:"1px solid rgba(55, 53, 47, 0.09)", borderRadius:"4px", width:"fit-content", padding:"5px 8px"}}>{returnConvertedDate(choosenDate)}</div>
        {attendanceExisted?<div style={{position:"absolute", top:"10px", right:"20px" , background:"rgba(219, 237, 219, 0.39)", color:"rgb(28, 56, 41)",  display:"flex", gap:"2px", borderRadius:"4px", padding:"2px 14px 2px 8px" , alignItems:"center"}}><div style={{height:"fit-content", display:"flex", alignItems:"center"}}>
        <Icon
      icon="hugeicons:tick-03"
      style={{
      width: "1.2rem",
      height: "1.2rem",
      color: "rgb(30 197 2)",
      cursor: "pointer"
     }} />
     </div>
     <div style={{whiteSpace:"nowrap", textOverflow:"ellipsis",  minHeight:"25px", display:"flex", alignItems:"center"}}>Attendance marked</div>
     </div>:
      <div style={{position:"absolute", top:"10px", right:"20px", background:"rgb(255 212 87 / 23%)",  color:"rgb(28, 56, 41)", display:"flex", gap:"2px", borderRadius:"4px", padding:"2px 14px 2px 8px", alignItems:"center"}}><div style={{height:"fit-content", display:"flex", alignItems:"center"}}>
      <Icon
    icon="radix-icons:dot-filled"
    style={{
    width: "1.2rem",
    height: "1.2rem",
    color: "rgb(230 191 76)",
    cursor: "pointer"
   }} />
   </div>
   <div style={{whiteSpace:"nowrap", textOverflow:"ellipsis", minHeight:"25px", display:"flex", alignItems:"center"}}>Attendance pending</div>
   </div>
     }
        <div style={{position:"relative", marginBottom:"100px"}}>
      

         
       { tableData && <Table  data={tableData} /> }
       

        </div>
        <div
       className='formbottomdiv'
      >
        <button
          
          type="submit"
          className='secondarybtn'
          onClick={()=>attendanceExisted? updateAttendance(): saveAttendance()}
          
        >
          {attendanceExisted ? "Update" : "Save"}
        </button>

        {attendanceExisted  && <button
          
          type="submit"
          className='dangerbtn'
          onClick={()=> removeAttendance()}
          
        >
         Remove
        </button>}
      </div>
        </div>
        </div>
    )
}

TakeAttendance.propTypes = {
    choosenDate: PropTypes.any,
    closeForm: PropTypes.func
};


export default TakeAttendance;