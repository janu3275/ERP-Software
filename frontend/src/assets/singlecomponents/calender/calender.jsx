import { format } from "date-fns";
import { forwardRef, useRef, useState } from "react";
import PopoverDemo from "../popover/popover";
import { Icon } from "@iconify/react";
import { DayPicker } from 'react-day-picker';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import 'react-day-picker/dist/style.css';
import PropTypes from 'prop-types';
import "./calender.css"







const Calendar = ({onDateSelect, date, name, mindate, disable}) => {

const [openCalender, setOpenCalender] = useState(false);
// const [date, setselectedDate] = useState(null)



    

 const onSelect = (date) => {

  console.log(date)
  
  onDateSelect(date)

  }

  const clearDate = () => {
    
    onDateSelect(null)
  }

  console.log(date)

  return (
   
      //  <PopoverDemo
      //       Open={openCalender}
      //       setOpen={setOpenCalender}
      //       contentclass=""
      //       btnclass="calender-button"
      //       side="top"
      //       icon = {

      //       <button className={"Input " + "calender-button"} aria-label="Update dimensions" >
               
             
      //         <div style={{display:"flex", alignItems:"center", justifyContent:"space-between", width:"-webkit-fill-available"}}>

      //           <div>{date && (
      //                   format(date, "PPP")
      //                 )}
      //           </div> 

      //         <Icon
      //           icon="uil:calender"
      //           style={{
      //             width: "1.2rem",
      //             height: "1.2rem",
      //             color: "black",
      //             cursor: "pointer",
      //           }}
      //         />
             
      //         </div>

      //         </button>
      //       }
      //     >
           <div>

            {/* <DayPicker
                    mode="single"
                    selected={date}
                    onSelect={onSelect}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  /> */}

      <DatePicker
      name={name}
      selected={date}
      onChange={onSelect}
      minDate={mindate}
      // peekNextMonth
      showMonthDropdown
      showYearDropdown
      dropdownMode="select"
     
      customInput={
        <div style={{display:"flex", alignItems:"center", gap:"5px"}}>
      <button
   
   style={{minWidth:"8rem", width:"-webkit-fill-available"}} 
   className={"Input primarycalenderfieldclass"}
     aria-label="Update dimensions"
  
    disabled={disable}
     // ref={ref}
   >
     <div
       style={{
         display: "flex",
         alignItems: "center",
         justifyContent: "space-between",
         width: "-webkit-fill-available",
       }}
     >
       <div>{date && format(date, "PPP")}</div>

       {date ? (
         <Icon
           icon="iwwa:delete"
           style={{
             width: "1rem",
             height: "1rem",
             color: "rgb(82 78 70)",
             cursor: "pointer",
           }}
           onClick={() => clearDate()}
         />
       ) : (
         <Icon
           icon="uil:calender"
           style={{
             width: "1rem",
             height: "1rem",
             color: "rgb(82 78 70)",
             cursor: "pointer",
           }}
         />
       )}
     </div>
   </button>
              </div>
    }
    />

            
          

        {/* </PopoverDemo> */}

        </div>
             
)};

Calendar.propTypes = {

 onDateSelect: PropTypes.func.isRequired,
 date: PropTypes.any,
 name: PropTypes.string,
 mindate: PropTypes.any,
 disable: PropTypes.bool

};

export default Calendar;
