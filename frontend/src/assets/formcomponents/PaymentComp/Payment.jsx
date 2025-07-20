import PropTypes from 'prop-types';
import Stextfield from "../../singlecomponents/singletextfield/stextfield";
import "./payment.css";
import { forwardRef } from 'react';


const PaymentFormComp = forwardRef(({  name , value, onChange,  errors, ...rest }, forwardedRef ) => {
    console.log("k")
    const onPayAmountChange = (e, name, index) => {

        console.log(e.target.value, name, index)
        // handlePayAmountChange(e, name, index)
        let valuearr = [...value]
        valuearr[index].amount = e.target.value
        onChange(valuearr)

    }
  



    return (
<>
    <div style={{display:"flex", flexDirection:"column", padding:"10px 0px", gap:"10px"}}  ref={forwardedRef}>
    {value.map((option,index)=><div key={index} style={{display:"flex", alignItems:"center", justifyContent:"space-between",paddingTop:index===0 ? "0":"0px", paddingBottom:(index+1)===value.length ? "0":"0px", gap:"10px",  borderBottom:(index+1)!==value.length && "0px solid rgb(240 240 240)"}}>
    <div style={{display:"flex", alignItems:"center", gap:"10px"}}>
    {option.icon}
    <div style={{ minWidth:'120px', display:"flex", justifyContent:"start" }}>{option.label}</div>
    </div>
    <div  style={{ minWidth:'120px', display:"flex", flexDirection:"column" }}>
    <Stextfield
          name={option.via}
          label=""
          value={option.amount}
          type="number"
          labelclassname="sizelabelclass"
        //   labelclassname=""
          textfieldclassname="primarytextfieldclass"
          divclassname="primarytextdivclass"
          placeholder=""
          onChange={onPayAmountChange}
          index={index}
          error={undefined}
        />
     
     </div>
    </div>)}
    

    </div>
    <div style={{height:"1rem"}}>{errors[name] && <div style={{fontSize:"0.8rem", color:"red"}}>{errors[name].message}</div>}</div>
</>
    )
})

PaymentFormComp.displayName = 'PaymentFormComp';

PaymentFormComp.propTypes = {
 
    name: PropTypes.string.isRequired,
    errors:PropTypes.object.isRequired,
    value: PropTypes.any.isRequired,
    onChange: PropTypes.func.isRequired 
    
};


export default PaymentFormComp;