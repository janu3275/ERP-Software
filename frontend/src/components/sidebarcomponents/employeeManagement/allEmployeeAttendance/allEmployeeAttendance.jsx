import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Axios } from "../../../../../utils/axios.mjs";
import CustomCalendar from "../../../../assets/singlecomponents/customCalender/customCalender";
import DialogDemo from "../../../../assets/singlecomponents/dialog/dialog";
import TakeAttendance from "./takeAttendance";


const AllEmployeeAttendance = () => {

    const [openAttendanceForm, setOpenAttendanceForm] = useState(false);
    const [selectedDate, setselectedDate] = useState(null);
    const [datesinfo, setdatesinfo] = useState([])

    const choooseDate = (day, month , year) => {
        console.log(day)
         const date = new Date(year, month, day);
         console.log(date)
         setselectedDate(date)
         setOpenAttendanceForm(true)
    }

    const returncurrentMonthDatesInfo = async(month, year) => { 

        try {

            let dateobj = {
                month, year
            }

            const encodedParams = encodeURIComponent(JSON.stringify(dateobj));

            const res = await Axios.get(`/employeeAttendance/getMarkedDays/${encodedParams}`)

            if(res.data.success){
              console.log(res.data.data)
              let datearr = [...res.data.data]
              return datearr
            }

          } catch (error) {
            console.log(error)
          }

    }
    

    const RefreshData = async(currentMonth, currentYear) => {
       
     let datearr = await returncurrentMonthDatesInfo(currentMonth, currentYear)

     datearr = datearr.filter((obj)=>obj.attendance_count>0).map((obj)=>obj.attendance_date)

     setdatesinfo(datearr)

    }

    const closeForm = (month, year) => {

        RefreshData(month, year)
        setselectedDate(null)
        setOpenAttendanceForm(false)
    }


    useEffect(() => {

    const currentDate = new Date()
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();
    RefreshData(currentMonth, currentYear)

    },[])


  
    return (

        <div className="detailoutercomp">
        <div className="infocomp">
        <div className="tabheading" style={{width:"370px"}}>Attendance</div>
        <div style={{display:"flex", justifyContent:"center"}}>
        <CustomCalendar onMonthOrYearChange={RefreshData} onDateClick={choooseDate} datesinfo={datesinfo} />
        </div>
        <DialogDemo Open={openAttendanceForm} setOpen={setOpenAttendanceForm} buttontext="" contentclass="normalDialog"  btnclass = 'primarybtndiv'> 
         {(props) => (
              <TakeAttendance
                {...props}
                choosenDate={selectedDate}
                closeForm={closeForm}
              />
            )}
         </DialogDemo>
        </div>
        </div>
   
    )
}




export default AllEmployeeAttendance;