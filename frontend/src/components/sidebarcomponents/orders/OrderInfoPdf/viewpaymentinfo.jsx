import React from 'react';
// import "./Viewpaymentinfo.css";
import PropTypes from "prop-types";
import { Icon } from '@iconify/react';





const ViewPaymentinfo = ({ 

   
    calculatePending,
    calculateTotalBill,
    calculateProductCharge,
    generalInfo
    



}) => {

 

    return (
        <>
     
       
     <div
        style={{ marginTop: "20px", paddingBottom: "0" , border:"1px solid rgb(233, 233, 231)", color:"rgb(55, 53, 47)",borderRadius:"6px"}}
        className="orderform"
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "0px 20px",
            paddingBottom: "20px",
            borderBottom: "1px solid rgb(233, 233, 231)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            {" "}
            Payment information{" "}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",

            borderBottom: "1px solid rgb(233, 233, 231)",
          }}
        >
          <div
            style={{
              width: "calc(90% - 40px)",
              borderRight: "1px solid rgb(233, 233, 231)",
              padding: "10px 20px",
              display: "flex",
              justifyContent: "end",
            }}
          >
            Product charge
          </div>
          <div
            style={{
              width: "calc(10%)",
              minWidth: "50px",
              padding: "10px 20px",
            }}
          >
            {calculateProductCharge()}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",

            borderBottom: "1px solid rgb(233, 233, 231)",
          }}
        >
          <div
            style={{
              width: "calc(90% - 40px)",
              borderRight: "1px solid rgb(233, 233, 231)",
              padding: "10px 20px",
              display: "flex",
              justifyContent: "end",
              gap:"10px"
            }}
          >
            <div>
            Measurement charges
            </div>
           
          </div>
          <div style={{  width: "calc(10%)",
              minWidth: "50px",
              padding: "10px 20px", }} >
          {generalInfo.payment.MeasurementCharge.total}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            borderBottom: "1px solid rgb(233, 233, 231)",
          }}
        >
          <div
            style={{
              width: "calc(90% - 40px)",
              borderRight: "1px solid rgb(233, 233, 231)",
              padding: "10px 20px",
              display: "flex",
              justifyContent: "end",
              gap:"10px"
            }}
          >
            <div>
            Dilevery charges 
            </div>
           
          </div>
          <div style={{  width: "calc(10%)",
              minWidth: "50px",
              padding: "10px 20px", }}>
          {generalInfo?.payment?.DileveryCharge?.total || 0}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",

            borderBottom: "1px solid rgb(233, 233, 231)",
          }}
        >
          <div
            style={{
              width: "calc(90% - 40px)",
              borderRight: "1px solid rgb(233, 233, 231)",
              padding: "10px 20px",
              display: "flex",
              justifyContent: "end",
              gap:"10px"
            }}
          >
            <div>
            Fitting charges
            </div>
           
          </div>
          <div style={{  width: "calc(10%)",
              minWidth: "50px",
              padding: "10px 20px", }}>
          {generalInfo?.payment?.fittingCharge?.total || 0}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",

            borderBottom: "1px solid rgb(233, 233, 231)",
          }}
        >
          <div
            style={{
              width: "calc(90% - 40px)",
              borderRight: "1px solid rgb(233, 233, 231)",
              padding: "10px 20px",
              display: "flex",
              justifyContent: "end",
            }}
          >
            Labour charges
          </div>
          <div style={{  width: "calc(10%)",
              minWidth: "50px",
              padding: "10px 20px", }}>
           {generalInfo.payment.labourCharge}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            borderBottom: "1px solid rgb(233, 233, 231)",
          }}
        >
          <div
            style={{
              width: "calc(90% - 40px)",
              borderRight: "1px solid rgb(233, 233, 231)",
              padding: "10px 20px",
              display: "flex",
              justifyContent: "end",
            }}
          >
            Bill
          </div>

          <div
            style={{
              width: "calc(10%)",
              minWidth: "50px",
              padding: "10px 20px",
            }}
          >
            {calculateTotalBill()}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",

            borderBottom: "1px solid rgb(233, 233, 231)",
          }}
        >
          <div
            style={{
              width: "calc(90% - 40px)",
              borderRight: "1px solid rgb(233, 233, 231)",
              padding: "10px 20px",
              display: "flex",
              justifyContent: "end",
            }}
          >
            Discount
          </div>
          <div style={{  width: "calc(10%)",
              minWidth: "50px",
              padding: "10px 20px", }}>
          {generalInfo.payment.discount}
          </div>
        </div>
        {/* <div style={{display:"flex", alignItems:"center",padding:"0px 20px", borderBottom:"1px solid rgb(233, 233, 231)"}}>
          <div style={{width:"90%",borderRight:"1px solid rgb(233, 233, 231)", padding:"10px 20px", display:"flex", justifyContent:"end"}}>Total ( after GST(18%) )</div>
          <div style={{width:"10%", minWidth:"50px", padding:"10px 20px"}}>{calculateProductCharge()+Viewpaymentinfo.MeasurementCharge+Viewpaymentinfo.LabourCharge+Viewpaymentinfo.fittingCharge + (calculateProductCharge()+Viewpaymentinfo.MeasurementCharge+Viewpaymentinfo.LabourCharge+Viewpaymentinfo.fittingCharge)*(18/100)}</div>
         </div> */}
        <div
          style={{
            display: "flex",
            alignItems: "center",

            borderBottom: "1px solid rgb(233, 233, 231)",
          }}
        >
        
       
          <div
            style={{
              width: "calc(90% - 40px)",
              borderRight: "1px solid rgb(233, 233, 231)",
              padding: "10px 20px",
              display: "flex",
              justifyContent: "end",
            }}
          >
            Final bill after discount
          </div>
          <div
            style={{
              width: "calc(10%)",
              minWidth: "50px",
              padding: "10px 20px",
            }}
          >
           {calculatePending()}
          </div>
        </div>
      </div>

     
    
        </>
    )
}

ViewPaymentinfo.propTypes = { 

 
  calculatePending: PropTypes.func.isRequired,
 
  calculateTotalBill: PropTypes.func.isRequired,

  calculateProductCharge: PropTypes.func.isRequired,
  generalInfo: PropTypes.any.isRequired,
 

  };


export default ViewPaymentinfo;