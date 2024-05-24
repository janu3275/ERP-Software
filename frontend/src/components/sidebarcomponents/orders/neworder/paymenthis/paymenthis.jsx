

import PropTypes from "prop-types";
import { Icon } from '@iconify/react';
import DialogDemo from "../../../../../assets/singlecomponents/dialog/dialog";
import Paymentform from "../paymentform/paymentform";
import { calculatePaid } from "../../../../../commonfn";




const Paymenthis = ({
    openPaymentForm, 
    handleOpenPaymentForm,
    selectedpaymenthis,
    generalInfo,
    updatePaymentHistory,
    addPaymentHistory,
    setselectedpaymenthis,
    setOpenPaymentForm,
    selectedorder,
    DeletePaymenthis,
    DeletePaymentHis



}) => {


    return (
        <>
     <div
          style={{ marginTop: "20px", paddingBottom: "0", border:"1px solid rgb(233, 233, 231)", color:"rgb(55, 53, 47)" }}
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
              <div style={{ marginLeft: "20px" }}>
                <DialogDemo
                  Open={openPaymentForm}
                  setOpen={handleOpenPaymentForm}
                  buttontext="Add Payment"
                  contentclass="addpaymentdialogcontentclass"
                  btnclass = 'tertiarybtn'
                >
                  {(props) => (
                    <Paymentform
                   
                      selectedpaymenthis={selectedpaymenthis}
                      orderid={generalInfo.orderid}
                      updatePaymentHistoryOnFrontend={updatePaymentHistory}
                      addPaymentHistoryOnFrontend={addPaymentHistory}
                      
                      {...props}
                    />
                  )}
                </DialogDemo>
              </div>
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
                  .filter((option) => option.amount>0)
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
              <div
                style={{
                  width: "calc(20% - 40px)",
                  minWidth: "50px",
                  justifyContent: "center",
                  display: "flex",
                }}
              >
                <div
                  style={{
                    width: "150px",
                    minWidth: "50px",

                    display: "flex",
                    justifyContent: "space-evenly",
                    alignItems: "center",
                  }}
                >
                  <button
                    onClick={() => {
                      setselectedpaymenthis(payment);
                      setOpenPaymentForm(true);
                    }}
                    style={{
                      padding: "3px",
                      display: "flex",
                      alignItems: "center",
                    }}
                    className="oksecondarybtn"
                  >
                    <Icon
                      icon="mi:edit-alt"
                      style={{
                        width: "1.2rem",
                        height: "1.2rem",
                        color: "#3f3f3f",
                        cursor: "pointer",
                      }}
                    />
                  </button>
                  <button
                    onClick={() =>
                      selectedorder
                        ? DeletePaymenthis(payment)
                        : DeletePaymentHis(payment)
                    }
                    style={{
                      padding: "3px",
                      display: "flex",
                      alignItems: "center",
                    }}
                    className="oksecondarybtn"
                  >
                    <Icon
                      icon="ant-design:delete-outlined"
                      style={{
                        width: "1.2rem",
                        height: "1.2rem",
                        color: "#ff3b3b",
                        cursor: "pointer",
                      }}
                    />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
       
     
    
        </>
    )
}

Paymenthis.propTypes = { 


    openPaymentForm: PropTypes.bool.isRequired,
    handleOpenPaymentForm : PropTypes.func.isRequired,
    selectedpaymenthis : PropTypes.any.isRequired,
    generalInfo : PropTypes.object.isRequired,
    updatePaymentHistory : PropTypes.func.isRequired,
    addPaymentHistory : PropTypes.func.isRequired,
    setselectedpaymenthis : PropTypes.func.isRequired,
    setOpenPaymentForm : PropTypes.func.isRequired,
    selectedorder : PropTypes.object.isRequired,
    DeletePaymenthis : PropTypes.func.isRequired,
    DeletePaymentHis : PropTypes.func.isRequired

  };


export default Paymenthis;