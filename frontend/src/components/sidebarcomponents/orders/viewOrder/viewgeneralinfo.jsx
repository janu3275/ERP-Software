// import "./generalinfo.css";
import PropTypes from "prop-types";
import React from 'react';



const ViewGeneralinfo = ({ generalInfo }) => {
    return (
        <>
     
        <div>
          <div
            style={{
              padding: "20px",
              border: "1px solid rgb(233, 233, 231)",
              borderBottom: "0",
              color:"rgb(55, 53, 47)",
              borderTopLeftRadius:"6px",
              borderTopRightRadius:"6px"
            }}
          >
            General Information
          </div>
          <div
            style={{
              padding: "20px",
              border: "1px solid rgb(233, 233, 231)",
              borderBottom: "1px solid rgb(233, 233, 231)",
              color:"rgb(55, 53, 47)",
              display:"flex",
              flexDirection:"column",
              gap:"15px",
              borderBottomLeftRadius:"6px",
              borderBottomRightRadius:"6px"
            }}
          >
            <div
              style={{
                display: "flex",
                gap: "20px",
                justifyContent: "space-between"
              }}
            >

             <div style={{display:"flex", gap:"15px"}}><div>Customer:</div> {generalInfo.customer.name}</div>
              <div style={{display:"flex", gap:"15px"}}>
              <div >Measured by:</div> {generalInfo.measuredby}
              </div>
            
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div
                style={{
                  paddingBottom: "0",
                  display: "flex",
                  gap: "15px",
                  alignItems: "center",
                }}
              >
                <div>Order to be dilevered by :</div>
               <div>{generalInfo.completionDate}</div>
              </div>

              <div
                style={{
                  paddingBottom: "0",
                  display: "flex",
                  gap: "15px",
                  alignItems: "center",
                }}
              >
                <div>Shipping address :</div>
               <div>{generalInfo.shipping_address}</div>
              </div>

            </div>
          

          </div>
        </div>
        
        </>
    )
}

ViewGeneralinfo.propTypes = { 
   generalInfo:PropTypes.object.isRequired, 
};


export default ViewGeneralinfo;