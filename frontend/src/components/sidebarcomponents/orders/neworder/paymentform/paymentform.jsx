import "./paymentform.css";
import PropTypes from "prop-types";
import Payment from "../../../../../assets/singlecomponents/payment/payment";

import { useEffect, useState } from "react";
import { calculatePaid, generateRandomId } from "../../../../../commonfn";

import Cashicon from "../../../../../assets/icons/reshot-icon-money-2AJCZGWB6U.svg";
import Chequeicon from "../../../../../assets/icons/cheque-finance-business-svgrepo-com.svg";
import UPIIcon from "../../../../../assets/icons/upi-payment-icon.svg";
import OtherIcon from "../../../../../assets/icons/apps-grid-icon.svg";
import { useNotificationStore } from "../../../../../../strore/notificationStore";
import SingleLabelwithtextarea from '../../../../../assets/singlecomponents/textarea/singletextarea';
import { Axios } from "../../../../../../utils/axios.mjs";
import Calendar from "../../../../../assets/singlecomponents/calender/calender";


const Paymentform = ({selectedpaymenthis, orderid, updatePaymentHistoryOnFrontend, addPaymentHistoryOnFrontend}) => {
  const {addNotification} = useNotificationStore(
    // (state) => state.addNotification
  );
  const [addpaymentinfo, setaddpaymentinfo] = useState({
    paymentid: generateRandomId(10),
    paid: 0,
    date: "",
    paidOptionInfo: [
      {
        via: "Cash",
        label: "Cash",
        icon: (
          <div className="cashdiv">
            <img src={Cashicon} style={{ height: "20px", width: "20px" }} />
          </div>
        ),
        checked: true,
        amount: 0
      },
      {
        via: "UPI",
        label: "Google Pay UPI",
        icon: (
          <div className="UPIdiv">
            <img src={UPIIcon} style={{ height: "30px", width: "30px" }} />
          </div>
        ),
        checked: true,
        amount: 0,
      },
     {
        via: "Cheque",
        label: "Cheque",
        icon: (
          <div className="chequediv">
            <img src={Chequeicon} style={{ height: "30px", width: "30px" }} />
          </div>
        ),
        checked: true,
        amount: 0,
      }, {
        via: "Other",
        label: "Other",
        icon: (
          <div className="Otherdiv">
            <img src={OtherIcon} style={{ height: "15px", width: "15px" }} />
          </div>
        ),
        checked: true,
        amount: 0,
      }
    ],
    note: "",
  });


  const handlePaymenthisAmountChange = (e, via, index) => {
    let newamount = e.target.value;
    console.log("🚀 ~ handlePaymenthisAmountChange ~ newamount:", newamount);
    
    newamount = parseInt(newamount);
    console.log(typeof newamount, newamount);

    if (!(Number.isInteger(newamount) && newamount >= 0)) {
      return;
    }
    console.log(newamount);

    let newpaymentinfo = {
      ...addpaymentinfo,
      paidOptionInfo: addpaymentinfo.paidOptionInfo.map((option) => {
        if (option.via === via) {
          return {
            ...option,
            amount: newamount,
          };
        }
        return option;
      }),
    };

    let totalpaid = 0;
    newpaymentinfo.paidOptionInfo
      .filter((option) => option.checked)
      .forEach((option) => {
        totalpaid = totalpaid + parseInt(option.amount);
      });

    setaddpaymentinfo({
      ...newpaymentinfo,
      paid: totalpaid,
    });
  };

  const handlePaymenthischeckchange = (check, via) => {
    console.log(check);
    let newpaymentinfo = {
      ...addpaymentinfo,
      paidOptionInfo: addpaymentinfo.paidOptionInfo.map((option) => {
        if (option.via === via) {
          return {
            ...option,
            checked: check,
            amount: check ? option.amount : 0,
          };
        }
        return option;
      }),
    };

    let totalpaid = 0;

    // setpaymentoptions(newpaymentinfo)

    newpaymentinfo.paidOptionInfo
      .filter((option) => option.checked)
      .forEach((option) => {
        totalpaid = totalpaid + parseInt(option.amount);
      });

    setaddpaymentinfo({
      ...newpaymentinfo,
      paid: totalpaid,
    });
  };
    const handleDateChange = (date) => {
      setaddpaymentinfo((prev)=>{
        return {
            ...prev,
            date:date
    }}); // Update the state with the selected date
};


const UpdatePaymenthis = async (updatedpayment) => {
  console.log(updatedpayment)
  let body = {
    orderid: orderid,
    paymentid: updatedpayment.paymentid,
    date: updatedpayment.date,
    note: updatedpayment.note,
    paidOptionInfo: updatedpayment.paidOptionInfo.map((option) => {
      let {via, checked, amount} = option
      return {
       via,
       checked,
       amount:parseFloat(amount)
      }
    })
  };

  try {
    let response = await Axios.post(`/order/updatePaymenthis`, body);
    if (response.data.success) {
      console.log("true");
      updatePaymentHistoryOnFrontend(updatedpayment);
      addNotification({
        id: generateRandomId(5),
        type: "success",
        message: "Payment history updated successfully !",
        displaytime: 3000,
      });
      clearPaymentInfo()
    } else {
      console.log("false");
      addNotification({
        id: generateRandomId(5),
        type: "error",
        message: "Payment history updation failed !",
        displaytime: 3000,
      });
    }
  } catch (error) {
    console.log(error);
    addNotification({
      id: generateRandomId(5),
      type: "error",
      message: "Payment history updation failed !",
      displaytime: 3000,
    });
  }
};

const clearPaymentInfo = ()=>{
  setaddpaymentinfo({
    paymentid: "",
    paid: 0,
    date: "",
    paidOptionInfo: [
      {
        via: "Cash",
        label: "Cash",
        icon: (
          <div className="cashdiv">
            <img src={Cashicon} style={{ height: "20px", width: "20px" }} />
          </div>
        ),
        checked: true,
        amount: 0
      },
      {
        via: "UPI",
        label: "Google Pay UPI",
        icon: (
          <div className="UPIdiv">
            <img src={UPIIcon} style={{ height: "30px", width: "30px" }} />
          </div>
        ),
        checked: true,
        amount: 0,
      },
     {
        via: "Cheque",
        label: "Cheque",
        icon: (
          <div className="chequediv">
            <img src={Chequeicon} style={{ height: "30px", width: "30px" }} />
          </div>
        ),
        checked: true,
        amount: 0,
      }, {
        via: "Other",
        label: "Other",
        icon: (
          <div className="Otherdiv">
            <img src={OtherIcon} style={{ height: "15px", width: "15px" }} />
          </div>
        ),
        checked: true,
        amount: 0,
      }
    ],
    note: "",
  });
}

const AddPaymenthis = async (addedpayment, orderid) => {
  let finalPaidOptionInfo = addedpayment.paidOptionInfo
    .map((option) => {
      return {
        via: option.via,
        amount: parseFloat(option.amount) || 0,
        checked: true
      };
    });

  let body = {
    orderid: orderid,
    date: addedpayment.date,
    note: addedpayment.note,
    paidOptionInfo: finalPaidOptionInfo
  };

  try {
    let response = await Axios.post(`/order/addPaymenthis`, body);
    console.log(response.data)
    if (response.data.success) {
      console.log("true");
      addNotification({
        id: generateRandomId(5),
        type: "success",
        message: "Payment history added successfully !",
        displaytime: 3000,
      });
      
      addPaymentHistoryOnFrontend(response.data.data);
      clearPaymentInfo()
    } else {
      console.log("false");
      addNotification({
        id: generateRandomId(5),
        type: "error",
        message: "Payment history addition failed !",
        displaytime: 3000,
      });
    }
  } catch (error) {
    console.log(error);
    addNotification({
      id: generateRandomId(5),
      type: "error",
      message: "Payment history addition failed !",
      displaytime: 3000,
    });
  }
};


      useEffect(() => {
        
        if(selectedpaymenthis){
          console.log(selectedpaymenthis)
          setaddpaymentinfo(selectedpaymenthis)
        }else{
          clearPaymentInfo()
        }
       
      },[selectedpaymenthis])

  return (
    <div>
      <div className="Paymentform" style={{color:"rgb(55, 53, 47)"}}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "10px 0px",
            paddingBottom: "20px",
            marginBottom: "20px",
            borderBottom: "1px solid rgb(233, 233, 231)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
           <div style={{fontSize:"larger"}}>New Payment</div>
            
          </div>
          {/* <input
          style={{border:"1px solid rgb(233, 233, 231)", padding:"2px 5px", borderRadius:"4px", cursor:"pointer"}}
        type="date"
        id="dateInput"
        name="date"
        value={addpaymentinfo.date} 
        onChange={handleDateChange} 
        /> */}
            <Calendar
             name='date'
             onDateSelect={(date) => {
              handleDateChange(date)
              }}

             date = {addpaymentinfo.date }
             />

        </div>
        <Payment
         
         paymentinfo={addpaymentinfo}
         handlePayAmountChange={handlePaymenthisAmountChange}
         handlePaycheckchange={handlePaymenthischeckchange}
         />
        <div 
         style={{
              display: "flex",
              alignItems: "center",
              marginTop:"20px",
              border:"1px solid rgb(233, 233, 231)",
              marginBottom:"20px"
            }}
            >
            <div   
            style={{
                width: "calc(67% - 40px)",
                borderRight: "1px solid rgb(233, 233, 231)",
                padding: "10px 20px",
                display: "flex",
                justifyContent: "end",
              }}>Total</div>
            <div
            style={{ width: "calc(33% - 40px)", minWidth: "50px", padding: "10px 20px" }}
            >{calculatePaid(addpaymentinfo.paidOptionInfo)}</div>
        </div>
        <SingleLabelwithtextarea
             name="paymentnote"
             label="Note"
             value={addpaymentinfo.note}
             type="text"
             labelclassname="formlabel"
             textfieldclassname="primarytextareaclass"
             divclassname="primarytextdivclass"
             placeholder=""
             onChange={(e)=>setaddpaymentinfo((prev)=>{
               return {
                 ...prev,
                 note: e.target.value
               }
             })}
             disabled={false}
          />
        <div
        style={{
          display: "flex",
          justifyContent: "end",
          marginTop: "10px",
          // padding: "0 10px",
        }}
      >
        <button onClick={()=>{
           selectedpaymenthis?UpdatePaymenthis(addpaymentinfo):AddPaymenthis(addpaymentinfo, orderid)
        }}
        disabled={calculatePaid(addpaymentinfo.paidOptionInfo) <= 0 || addpaymentinfo.date===""}
        className="secondarybtn" style={{ marginTop: "10px" }}>
        {selectedpaymenthis? 'Update payment': 'Add payment' }
        </button>
      </div>
      </div>
    </div>
  );
};

Paymentform.propTypes = {
  selectedpaymenthis: PropTypes.any,
  orderid: PropTypes.number,
  updatePaymentHistoryOnFrontend:PropTypes.func.isRequired,
  addPaymentHistoryOnFrontend: PropTypes.func.isRequired,
 
};

export default Paymentform;