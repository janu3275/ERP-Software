import React from 'react';
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Axios } from "../../../../../utils/axios.mjs";
import ViewGeneralinfo from "./viewgeneralinfo";
import ViewProductsinfo from './viewproducts';
import ViewPaymentinfo from './viewpaymentinfo';
// import ViewPaymenthis from './viewpaymenthis';
// import { formatpaidOptionInfo } from "../../../../commonfn";


const PDFView = ({ selectedorder, items}) => {

const [generalInfo, setGeneralInfo] = useState(null);



  const calculateProductCharge = () => {
    let total = 0;
    generalInfo.products.forEach((product) => {
      let totalofsize = product.sizearr
        .map((item) => parseInt(item.total))
        .reduce((acc, currentValue) => acc + currentValue, 0);
      let totalofaccessory = product.accessoryarr
        .map((acc) => parseInt(acc.total))
        .reduce((acc, currentValue) => acc + currentValue, 0);
      let producttotal = totalofaccessory + totalofsize;
      total = total + producttotal;
    });

    return total
  };


  const calculatePending = () => {
    return (
      calculateTotalBill() - 
      parseInt(generalInfo.payment.discount)
    );
  };



  const calculateTotalBill = () => {
    return (
      calculateProductCharge() +
      parseInt(generalInfo.payment.MeasurementCharge.total) +
      parseInt(generalInfo.payment.DileveryCharge.total) +
      parseInt(generalInfo.payment.fittingCharge.total) +
      parseInt(generalInfo.payment.labourCharge)
    );
  };

  // const calculateTotalPaid = () => {
  //   let total = 0
  //   generalInfo.paymenthis.forEach((payment)=>{
  //     let paidOptionInfo = payment.paidOptionInfo
  //     let cash = paidOptionInfo[0].checked?paidOptionInfo[0].amount:0
  //     let upi = paidOptionInfo[1].checked?paidOptionInfo[1].amount:0
  //     let cheque = paidOptionInfo[2].checked?paidOptionInfo[2].amount:0
  //     let other = paidOptionInfo[3].checked?paidOptionInfo[3].amount:0
  //     total = total + cash + upi + cheque + other
  //   });

  //   return total
  // }



 

  const formatData = (selectedobj) => {
    console.log(selectedobj);
    let obj = {
      ...selectedobj,
      // payment: {
      //   ...selectedobj.payment,
      //   MeasurementCharge: JSON.parse(selectedobj.payment.MeasurementCharge),
      //   DileveryCharge: JSON.parse(selectedobj.payment.DileveryCharge),
      //   fittingCharge: JSON.parse(selectedobj.payment.fittingCharge),
      // }
      // paymenthis: selectedobj.paymenthis.map((payhis) => {
      //   return {
      //     ...payhis,
      //     paidOptionInfo: formatpaidOptionInfo(payhis.paidOptionInfo),
      //   };
      // }),
    };
    return obj;
  };



  //**************************************************************************************************************************/



  useEffect(() => {
    console.log("jhbj");
    if (selectedorder) {
      console.log("jhbj");
      // let data = formatData(selectedorder);
      console.log(selectedorder);
      setGeneralInfo(selectedorder);
   
    }
 
  }, [selectedorder]);



  console.log("jhbj", generalInfo, selectedorder);

  return (
    <div>
      { generalInfo && <div
        style={{ padding: "40px", border: "1px solid rgb(233, 233, 231)", borderRadius: "6px", color:"rgb(55, 53, 47)", }}
        className="Vieworderinfo"
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "0px 20px",
            paddingBottom: "20px",
            marginBottom: "20px",
            borderBottom: "1px solid rgb(233, 233, 231)",
            fontWeight:"600"
          }}
        >
          <div>Order No: {generalInfo.orderno}</div>
          <div>Date: {generalInfo.date}</div>
        </div>

      <ViewGeneralinfo

       generalInfo={generalInfo}
  

       />

      <ViewProductsinfo

       generalInfo={generalInfo}
       items={items}
       calculateProductCharge={calculateProductCharge}
       
       />

       <ViewPaymentinfo

  
       calculatePending={calculatePending}
       calculateTotalBill={calculateTotalBill}

       calculateProductCharge={calculateProductCharge}
       generalInfo={generalInfo}
  

       />

       
      {/* {selectedorder && 
      
       <ViewPaymenthis
     
       generalInfo={generalInfo}
       
       />

        } */}
        
        {/* {selectedorder && <div 
       style={{
            padding: "10px",
            display: "flex",
            justifyContent: "space-between",
            marginTop: "10px",
            borderBottom:"1px solid rgb(233, 233, 231)",
            width:"fit-content",
            gap:"20px"
          }}>
        <div>Net Pending : {" "} </div>
        <div> Rs. {calculateNetPending()}</div>
        </div>} */}

      
      </div>}
      
    </div>

  );
};

PDFView.propTypes = {
  selectedorder: PropTypes.object,
  items: PropTypes.object.isRequired
};

export default PDFView;
