import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import PropTypes from "prop-types";
import { Axios } from "../../../../../../utils/axios.mjs";
import DialogDemo from "../../../../../assets/singlecomponents/dialog/dialog";
import Table from "../../../../commoncomponents/tableComponent/table";
import { returnAttendanceStatusEle, returnConvertedDate } from "../../../../../commonfn";
import { statusItems } from "../../../orders/allOrders/staticOptions";
import Attendanceform from "./Attendanceform";


const Attendance = ({employeeId}) => { 

    const [openAttendanceForm, setOpenAttendanceForm] = useState(false);
    const [allAttendanceinfo, setallAttendanceinfo] = useState([]);
    const [tableData, settableData] = useState(null);
    const [selectedemployeeAttendance, setselectedemployeeAttendance] = useState(null);

 

const getAllAttendance = async() => {
      try {
        let res = await Axios.get(`/employeeAttendance/getByEmployee/${employeeId}`)
        if(res.data.success){
          console.log(res.data.data)
          let Attendancearr = [...res.data.data]
          setallAttendanceinfo(Attendancearr)
          let tableobj = convertDataForTable(Attendancearr);
          settableData(tableobj)
        }
      } catch (error) {
        console.log(error)
      }
      
    }

 

const convertDataForTable = (data) => {

       let Attendancearr = [...data]
       const header =  [{ 
        "columnName": "Date",
        "type": "date",
        "colNo": 1,
        "width": 100,
        "sorted":null
      },
      {
        "columnName": "Status",
        "type": "options",
        "colNo": 2,
        "width": 100,
        "sorted":null,
        "options": statusItems
      },
      { 
        "columnName": "Note",
        "type": "string",
        "colNo": 3,
        "width": 100,
        "sorted":null
      }]
    
      let rows = []
    
      Attendancearr.forEach((obj, index) => {
        let row = [];
         console.log(obj)

         if(obj.attendance_date){
            row.push({ key:'attendance_date', value:returnConvertedDate(obj.attendance_date), type:'date', width:100, rowNo:index+1, colNo:1, id:obj.id })
         }
       
         if(obj.attendance_status){
            row.push({ key:'attendance_status', value: obj.attendance_status, ele: returnAttendanceStatusEle(obj.attendance_status),  type:'options', width:100, rowNo:index+1, colNo:2, id:obj.id })
         }
        
         if(obj.note || obj.note===''){
            row.push({ key:'note', value: obj.note, type:'string', width:300, rowNo:index+1, colNo:4, id:obj.id })
         }
        
      console.log(row)
      if(row.length==3){
        rows.push(row) 
      }

    })

const rowWiseFunctions = [{funcName:'Edit', funct:(employeeAttendance)=>AttendanceFormOpen(employeeAttendance, Attendancearr) , icon: <Icon
    icon="mynaui:edit-one"
    style={{
      width: "1.1rem",
      height: "1.1rem",
      Attendance: "rgb(82, 78, 70)",
      cursor: "pointer"
    }}
     />}]


const groupFunctions = [];



const name = 'Attendance'

const tableData = {name, groupFunctions, rowWiseFunctions,  header, rows}
console.log(tableData)
return tableData


    }




   

const UpdateemployeeAttendance = async(data) => {
      console.log(data)
      try {
        let body = {
            attendance_id: `${data.attendanceid}`, 
            
          ...data.data
        }

        let res = await Axios.post( `/employeeAttendance/updateByEmployee`, body )
        if(res.data.success){
          getAllAttendance()
          setselectedemployeeAttendance(null)
          setOpenAttendanceForm(false)
        }

      } catch (error) {
        console.log(error)
      }
    }

const AttendanceFormOpen = ( Attendance, Attendancearr ) => {
      console.log(Attendance, Attendancearr, tableData)
      const selctedAttendanceRow = Attendancearr.filter((row)=>row.id===Attendance[0].id)[0] || null
      console.log(selctedAttendanceRow)
      setselectedemployeeAttendance(selctedAttendanceRow)
      setOpenAttendanceForm(true)

    }

    const openForm = () => {
      setselectedemployeeAttendance(null)
      setOpenAttendanceForm(true)
    }

    useEffect(() => {
      getAllAttendance()
    },[employeeId])

    console.log(allAttendanceinfo)
    return (

        <div style={{position:"relative"}}>
         <div style={{ width: "fit-content", position: "absolute" , right: '30px', zIndex: 1}}> 
        <DialogDemo Open={openAttendanceForm} setOpen={(e)=>e?openForm():setOpenAttendanceForm(e)} buttontext=""  contentclass="dailogcontentclass" btnclass = 'primarybtndiv'> 
         {(props) => (
              <Attendanceform
                {...props}
             
                selectedAttendance={selectedemployeeAttendance}
                UpdateAttendance={UpdateemployeeAttendance}
              />
            )}
         </DialogDemo>
         </div>

         
       { tableData && <Table  data={tableData} /> }

        
        </div>
    )
}

Attendance.propTypes = {

    employeeId: PropTypes.any.isRequired
  
  };



export default Attendance;