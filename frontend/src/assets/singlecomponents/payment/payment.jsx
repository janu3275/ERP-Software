import CheckboxDemo from "../checkbox/checkbox";
import PropTypes from 'prop-types';
import Stextfield from "../singletextfield/stextfield";
import "./payment.css";

const Payment = ({  paymentinfo, handlePayAmountChange, handlePaycheckchange }) => {

    const onPayAmountChange = (e, name, index) => {
        console.log(e.target.value, name, index)
        handlePayAmountChange(e, name, index)
    }
  



    return (
    <div style={{display:"flex", flexDirection:"column"}} >
    {paymentinfo.paidOptionInfo.map((option,index)=><div key={index} style={{display:"flex", alignItems:"center", justifyContent:"space-between",paddingTop:index===0 ? "0":"10px", paddingBottom:(index+1)===paymentinfo.paidOptionInfo.length ? "0":"10px", gap:"20px",  borderBottom:(index+1)!==paymentinfo.paidOptionInfo.length && "0px solid rgb(240 240 240)"}}>
    {/* <CheckboxDemo onChange={(e)=>handlePaycheckchange(e, option.via )} value={option.checked} /> */}
    {option.icon}
    <div style={{minWidth:'120px', display:"flex", justifyContent:"start"}}>{option.label}</div>
    <Stextfield
          name={option.via}
          label=""
          value={option.amount}
          type="number"
          labelclassname="sizelabelclass"
          textfieldclassname="primarytextfieldclass"
          divclassname="paymentdivclass"
          placeholder="h"
          onChange={onPayAmountChange}
          index={index}
          disabled={false}
          error={undefined}
        />
        
    </div>)}

    </div>
    )
}

// name="width"
// label=""
// value={size.width}
// type="number"
// labelclassname="sizelabelclass"
// textfieldclassname="sizetextclass"
// divclassname="sizedivclass"
// placeholder="width in sqft"
// onChange={handlesizefieldchange}
// index={index}
// disabled={false}
// error={validationerr?validationerr[`sizearr[${index}].width`]:undefined}

Payment.propTypes = {
    paymentoptions: PropTypes.array,
    setpaymentoptions:PropTypes.func,
    setGeneralInfo: PropTypes.func,
    paymentinfo: PropTypes.object,
    handlePayAmountChange: PropTypes.func, 
    handlePaycheckchange: PropTypes.func
 
};


export default Payment;