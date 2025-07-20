import { useEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react";
import PropTypes from "prop-types";
import DialogDemo from "../../../../../assets/singlecomponents/dialog/dialog";
import Table from "../../../../commoncomponents/tableComponent/table";
import { returnAttendanceStatusEle, returnConvertedDate } from "../../../../../commonfn";
import { statusItems } from "../../../orders/allOrders/staticOptions";
import Attendanceform from "./Attendanceform";
import { useQueryClient } from "@tanstack/react-query";
import { useGetEmployeeAttendances, useUpdateEmployeeAttendance } from "./employeeAttendanceQueryHooks";
import { useFilterStore } from "../../../../../../strore/notificationStore";
import { returnEmployeeStringifiedFilter } from "../../employeeFilterFunctions";
import debounce from "lodash.debounce";



const Attendance = ({employeeId}) => { 
    const storeFilterData = useFilterStore(state => state[`employeeAttendance${employeeId}`]);
    const [openAttendanceForm, setOpenAttendanceForm] = useState(false);
    // const [allAttendanceinfo, setallAttendanceinfo] = useState([]);
    // const [tableData, settableData] = useState(null);
    const [selectedemployeeAttendance, setselectedemployeeAttendance] = useState(null);
    const employeeAttendanceTableRef = useRef(null);

    const queryClient = useQueryClient();

    const returnTableData = ( data ) => {
      console.log("🚀 ~ returnTableData ~ data:", data)
      if(!data){
        return null
      }
      const tableobj = convertDataForTable(data);
      return tableobj
     
    }

    const updateEmployeeSuccessfn = () => {
      // Invalidate or refetch the Employee list query
      queryClient.invalidateQueries({ queryKey:[`employeeAttendances-${employeeId}`] });
      setselectedemployeeAttendance(null)
      setOpenAttendanceForm(false)

   }

   const { data, error: getAttendanceerr, fetchNextPage, hasNextPage, isFetchingNextPage, fetchPreviousPage, hasPreviousPage, isFetchingPreviousPage, isLoading: getAttendanceIsLoading } = useGetEmployeeAttendances(employeeId, null, returnEmployeeStringifiedFilter(storeFilterData, 'EmployeeAttendance'));

   const allAttendanceinfo = (data?.pages ?? []).flatMap(page => page?.data ?? []);
   const summary = (data?.pages[0]?.summary ?? [])

   const { mutate: triggerUpdateAttendance , error: updateAttendanceerr, isLoading: updateAttendanceIsLoading } = useUpdateEmployeeAttendance(updateEmployeeSuccessfn);


// const getAllAttendance = async() => {
//       try {
//         let res = await Axios.get(`/employeeAttendance/getByEmployee/${employeeId}`)
//         if(res.data.success){
//           console.log(res.data.data)
//           let Attendancearr = [...res.data.data]
//           setallAttendanceinfo(Attendancearr)
//           let tableobj = convertDataForTable(Attendancearr);
//           settableData(tableobj)
//         }
//       } catch (error) {
//         console.log(error)
//       }
      
//     }
  // Infinite scroll event handler for loading next page
  const loadNextPage = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  // Infinite scroll event handler for loading previous page
  // const loadPreviousPage = () => {
  //   if (hasPreviousPage && !isFetchingPreviousPage) {
  //     fetchPreviousPage();
  //   }
  // };


   // Attach scroll event for loading next or previous page on table scroll
   useEffect(() => {
    const onScroll = debounce(() => {
      const table = employeeAttendanceTableRef.current;
      if (table) {
        const { scrollTop, clientHeight, scrollHeight } = table;
        // if (scrollTop === 0 && hasPreviousPage && !isFetchingPreviousPage) {
        //   loadPreviousPage();
        // } else
          console.log(scrollTop, clientHeight, scrollHeight)
         if (scrollTop + clientHeight + 20 >= scrollHeight && hasNextPage && !isFetchingNextPage) {
          loadNextPage();
        }
      }
    }, 200);

    const table = employeeAttendanceTableRef.current;
    if (table) {
      table.addEventListener('scroll', onScroll);
      return () => table.removeEventListener('scroll', onScroll);
    }
  }, [hasNextPage, hasPreviousPage, isFetchingNextPage, isFetchingPreviousPage]);


 

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

const rowWiseFunctions = [{funcName:'Update', funct:(employeeAttendance)=>AttendanceFormOpen(employeeAttendance, Attendancearr) , icon: <Icon
    icon="mynaui:edit-one"
    style={{
      width: "1.1rem",
      height: "1.1rem",
      Attendance: "rgb(82, 78, 70)",
      cursor: "pointer"
    }}
     />}]


const groupFunctions = [];
const name = `employeeAttendance${employeeId}`;
const tableRef = employeeAttendanceTableRef;

const tableContainerStyle = {
  maxHeight:"calc(100vh - 176px)"
}

const tableData = {name, groupFunctions, rowWiseFunctions,  header, rows, tableRef, tableContainerStyle}
console.log(tableData)
return tableData


    }




   

// const UpdateemployeeAttendance = async(data) => {
//       console.log(data)
//       try {
//         let body = {
//             attendance_id: `${data.attendanceid}`, 
            
//           ...data.data
//         }

//         let res = await Axios.post( `/employeeAttendance/updateByEmployee`, body )
//         if(res.data.success){
//           getAllAttendance()
//           setselectedemployeeAttendance(null)
//           setOpenAttendanceForm(false)
//         }

//       } catch (error) {
//         console.log(error)
//       }
//     }

const AttendanceFormOpen = ( Attendance, Attendancearr ) => {
      console.log(Attendance, Attendancearr)
      const selctedAttendanceRow = Attendancearr.filter((row)=>row.id===Attendance[0].id)[0] || null
      console.log(selctedAttendanceRow)
      setselectedemployeeAttendance(selctedAttendanceRow)
      setOpenAttendanceForm(true)

    }

    const openForm = () => {
      setselectedemployeeAttendance(null)
      setOpenAttendanceForm(true)
    }

    // useEffect(() => {
    //   getAllAttendance()
    // },[employeeId])

    console.log(allAttendanceinfo, summary, data)
    return (
<>
<div className="tablesummary">
     
        <div className="tablesummarytab">
        <div className="tablesummarytopic" style={{ background:"rgb(219 237 219 / 22%)"}}>   <Icon
    icon="la:hand-paper-solid"
    style={{
    width: "1.2rem",
    height: "1.2rem",
    color: "rgb(30, 197, 2)",
    cursor: "pointer",
   }} /> Present ( Total ) </div>
      <div className="tablesummaryinfo">
      {summary.present_count} days
    
      </div>
   
      </div>
      <div className="tablesummarytab">
        <div className="tablesummarytopic" style={{ background:"rgb(255 226 221 / 44%)"}}>   <Icon
    icon="fluent:hand-right-off-16-regular"
    style={{
    width: "1.2rem",
    height: "1.2rem",
    color: "rgb(228 8 8)",
    cursor: "pointer",
   }} /> Absent ( Total ) </div>
      <div className="tablesummaryinfo">
      {summary.absent_count} days
      </div>
   
      </div>
      </div>  
       {allAttendanceinfo && <div style={{position:"relative"}}>
         <div style={{ width: "fit-content", position: "absolute" , right: '30px', zIndex: 1}}> 
        <DialogDemo Open={openAttendanceForm} setOpen={(e)=>e?openForm():setOpenAttendanceForm(e)} buttontext=""  contentclass="dailogcontentclass" btnclass = 'primarybtndiv'> 
         {(props) => (
              <Attendanceform
                {...props}
                selectedAttendance={selectedemployeeAttendance}
                UpdateAttendance={triggerUpdateAttendance}
              />
            )}
         </DialogDemo>
         </div>

         
        <Table  data={returnTableData(allAttendanceinfo)} /> 

        
        </div> }
  </>
    )
}

Attendance.propTypes = {

    employeeId: PropTypes.any.isRequired
  
  };



export default Attendance;