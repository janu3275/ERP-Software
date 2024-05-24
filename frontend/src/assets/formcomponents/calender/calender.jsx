import { format } from "date-fns";
import { forwardRef } from "react";
import { Icon } from "@iconify/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import 'react-day-picker/dist/style.css';
import PropTypes from 'prop-types';
import "./calender.css"
import CustomInput from "./customInput";







const Calendarform = forwardRef(({ label, labelclassname , disable, divclassname, name , value,  errors, ...rest}, forwardedRef) => {


  let { onChange, ...props} = {...rest};

  const clearDate = () => {
    onChange(null)
  }

  console.log("calender value --> ", value)

  return (
    
     <div  className={divclassname}>
      <div className={labelclassname}>{label}</div>
      <div style={{display:"flex", flexDirection:"column", gap:"5px", marginTop:"-2px"}} >
    
    <DatePicker
      name={name}
      value={value}
      selected={value}
      onChange={onChange}
      // onSelect={onChange}
      peekNextMonth
      showMonthDropdown
      showYearDropdown
      dropdownMode="select"
      ref={forwardedRef}
      disabled={disable}
      customInput={<CustomInput disable={disable}  clearDate={clearDate} />}
      
      enableTabLoop={false}
 
      {...props}
    />
    
     
    
    <div style={{height:"1rem", display:"flex", justifyContent:"end", padding:"0px 20px"}}>{errors[name] && <div style={{fontSize:"0.8rem", color:"red"}}>{errors[name].message}</div>}</div>
    </div>
    </div>

 
)})

Calendarform.displayName = 'Calendar';


Calendarform.propTypes = {

 name: PropTypes.string.isRequired,
 
 errors:PropTypes.object.isRequired,
 label: PropTypes.string,
 labelclassname: PropTypes.string,
 divclassname: PropTypes.string,
 value: PropTypes.any,
 disable: PropTypes.bool
 


};

export default Calendarform;
