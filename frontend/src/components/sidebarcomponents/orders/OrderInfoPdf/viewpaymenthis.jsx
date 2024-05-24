import React from 'react';
// import "./Viewpaymenthis.css";
import PropTypes from "prop-types";
import { Icon } from '@iconify/react';
import { calculatePaid } from "../../../../commonfn";





const ViewPaymenthis = ({
   
    generalInfo
 
}) => {


  


    return (
        <>
     <div
          style={{ marginTop: "20px", paddingBottom: "0", border:"1px  solid rgb(233, 233, 231) ", color:"rgb(55, 53, 47)" }}
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
              Payment History after Bill
             
            </div>
          </div>

          {generalInfo.paymenthis.map((payment, index) => (
            <div
              key={index}
              style={{
                display: "flex",

                borderBottom: "1px solid rgb(233, 233, 231)",
              }}
            >
              <div
                style={{
                  width: "calc(5% - 40px)",
                  minWidth: "10px",
                  padding: "10px 20px",
                  borderRight: "1px solid rgb(233, 233, 231)",
                }}
              >
                {index + 1}
              </div>
              <div
                style={{
                  width: "calc(10% - 40px)",
                  borderRight: "1px solid rgb(233, 233, 231)",
                  padding: "10px 20px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {payment.date}
              </div>
              <div
                style={{
                  minWidth: "calc(40% - 40px)",
                  borderRight: "1px solid rgb(233, 233, 231)",
                  padding: "10px 20px",
                  display: "flex",
                  gap: "15px",
                  overflow: "hidden",
                }}
              >
                {payment.paidOptionInfo
                  .filter((option) => option.checked)
                  .map((option, index) => (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                      }}
                      key={index}
                    >
                      {option.icon}-<div>Rs. {option.amount}</div>
                    </div>
                  ))}
              </div>
              <div
                style={{
                  width: "calc(10% - 40px)",
                  borderRight: "1px solid rgb(233, 233, 231)",
                  padding: "10px 20px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                Rs. {calculatePaid(payment.paidOptionInfo)}
              </div>
              <div
                style={{
                  width: "calc(20% - 40px)",
                  borderRight: "1px solid rgb(233, 233, 231)",
                  padding: "10px 20px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {payment.note}
              </div>
             
            </div>
          ))}
        </div>
       
     
    
        </>
    )
}

ViewPaymenthis.propTypes = { 


   
    generalInfo : PropTypes.object.isRequired,


  };


export default ViewPaymenthis;