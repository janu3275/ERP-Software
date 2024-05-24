import { useEffect, useState } from 'react';
import './customCalender.css';
import { Icon } from '@iconify/react';
import PropTypes from "prop-types";

const CustomCalendar = ({onMonthOrYearChange, onDateClick, datesinfo}) => {

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());


  const daysShortArr = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const monthNamesArr = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getMonthStartDay = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  const getCalendarDays = () => {
    const year = selectedYear;
    const month = selectedMonth;
    const monthStartDay = getMonthStartDay(year, month);
    const daysInMonth = getDaysInMonth(year, month);
    const daysArr = [];

    for (let i = 0; i < monthStartDay; i++) {
      daysArr.push('');
    }

    for (let i = 1; i <= daysInMonth; i++) {
      daysArr.push(i);
    }

    return daysArr;
  };

  const handlePrevMonth = () => {
    
    if (selectedMonth === 0) {
      setSelectedYear(selectedYear - 1);
      setSelectedMonth(11);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }

  };

  const handleNextMonth = () => {
    
    if (selectedMonth === 11) {
      setSelectedYear(selectedYear + 1);
      setSelectedMonth(0);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }

  };

  const handleYearChange = (e) => {
    setSelectedYear(parseInt(e.target.value));
  };

  const handleMonthChange = (e) => {
    setSelectedMonth(parseInt(e.target.value));
  };

  function areDatesEqual(date1, date2) {
    return (
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate()
    );
}


  const returnDayClassName = (day) => {

    const currentDay = currentDate.getDate();
    const dayArr = datesinfo.map((date)=>{
        const vardate = new Date(date);
        const dayOfmonth= vardate.getDate();
        return dayOfmonth
    })
    const date = new Date(selectedYear, selectedMonth, day);
     console.log(date.getTime(), currentDate.getTime(), day)
     if( dayArr.includes(day) ){ 
        console.log("1")
        return "attendanceMarked"
     }

     if(date>currentDate){
        console.log("2")
        return "disabled"
     }

     if(areDatesEqual(date, currentDate)){
        console.log("3")
        return "current-day"
     }

     console.log("4")

     return "attendanceNotMarked"

  }

  const onDayClick = (day) => {
    console.log(day)
   let className = returnDayClassName(day)
   if(className==='disabled'){
    return
   }
   onDateClick(day, selectedMonth, selectedYear)
  }

  useEffect(() => {

    onMonthOrYearChange(selectedMonth+1, selectedYear)

  }, [selectedYear, selectedMonth])




  return (

    <div className="calendar">
      <div className="calendar-header">
      <div className="month-nav">
          
          <button  style={{height:"fit-content", margin:"auto 0px"}} onClick={handlePrevMonth}  className="custcalenderbtn">
            <Icon
            icon="iconamoon:arrow-left-2"
            style={{
              width: "1.5rem",
              height: "1.5rem",
              color: "white",
              cursor: "pointer"
            }}
            
          />
      </button>
        
        </div>
        <div className="year-month-select">
          <select className='custcalenderSelect' value={selectedYear} onChange={handleYearChange}>
            {Array.from({ length: 100 }, (_, i) => currentDate.getFullYear() - 50 + i).map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          <select className='custcalenderSelect' value={selectedMonth} onChange={handleMonthChange}>
            {monthNamesArr.map((month, index) => (
              <option key={index} value={index}>
                {month}
              </option>
            ))}
          </select>
        </div>
        <div className="month-nav">
          
        <button  style={{height:"fit-content", margin:"auto 0px"}} onClick={handleNextMonth}  className="custcalenderbtn">
            <Icon
            icon="iconamoon:arrow-right-2"
            style={{
              width: "1.5rem",
              height: "1.5rem",
              color: "white",
              cursor: "pointer"
            }}
            
          />
      </button>
        </div>
      </div>
      <div className="calendar-body">
        <div className="day-names">
          {daysShortArr.map((day) => (
            <div key={day} className="week-day">
              {day}
            </div>
          ))}
        </div>
        <div className="day-numbers">
          {getCalendarDays().map((day, index) => (
            <div key={index} className={`day ${returnDayClassName(day)}`} onClick={()=>onDayClick(day)}>
              {day}
            </div>
          ))}
        </div>
      </div>
    </div>

  );
};

CustomCalendar.propTypes = {
    onMonthOrYearChange: PropTypes.func,
    onDateClick: PropTypes.func, 
    datesinfo: PropTypes.array
};

export default CustomCalendar;