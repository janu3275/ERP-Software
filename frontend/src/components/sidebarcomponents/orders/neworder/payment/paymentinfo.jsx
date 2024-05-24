import Payment from "../../../../../assets/singlecomponents/payment/payment";
import PopoverDemo from "../../../../../assets/singlecomponents/popover/popover";
import Stextfield from "../../../../../assets/singlecomponents/singletextfield/stextfield";
import "./paymentinfo.css";
import PropTypes from "prop-types";
import { Icon } from '@iconify/react';
import Dileverypop from "./dileverypop/dileverypop";
import Fittingpop from "./fittingpop/fittingpop";
import Measurementpop from "./measurementpop/measurementpop";
import { useState } from "react";





const Paymentinfo = ({ 

    // handlePaymentAmountChange,
    // handlePaymentcheckchange,
    // calculatePending,
    calculateTotalBill,
    setGeneralInfo,
    calculateProductCharge,
    generalInfo,
    selectedorder,
    UpdatePayment,
    handleVehichleTypeField,
    handleDistanceField,
    calculateFinalBill

  }) => {

  const [openDileveryPop, setOpenDileveryPop] = useState(false);
  console.log(generalInfo)

    return (
        <>
     
       
     <div
        style={{ marginTop: "20px", paddingBottom: "0", border:"1px solid rgb(233, 233, 231)", color:"rgb(55, 53, 47)" , borderRadius:"6px"}}
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
              width: "calc(10% - 40px)",
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
            <PopoverDemo
                // Open={openPaymentPop}
                // setOpen={setOpenPaymentPop}
                contentclass=""
                btnclass=""
                side="top"
                icon={
                  <button
                    className={"PopIconButton "}
                    aria-label="Update dimensions"
                  >
                    <Icon
                      icon="tabler:ruler-measure"
                      style={{
                        width: "0.8rem",
                        height: "0.8rem",
                        color: "black",
                        cursor: "pointer",
                      }}
                    />
                  </button>
                }
              >
                <Measurementpop
                  setGeneralInfo={setGeneralInfo}
                  generalInfo={generalInfo}
                />
              </PopoverDemo>
          </div>
          <div style={{ width: "calc(10%)", minWidth: "50px" }} >
            <Stextfield
              name="measurementfield"
              label=""
              value={generalInfo.payment.MeasurementCharge.total}
              type="number"
              labelclassname=""
              textfieldclassname="paymenttextfield"
              divclassname=""
              placeholder=""
              disabled={true}
            />
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
            <PopoverDemo
                Open={openDileveryPop}
                setOpen={setOpenDileveryPop}
                contentclass=""
                btnclass=""
                side="top"
                icon={
                  <button
                    className={"PopIconButton "}
                    aria-label="Update dimensions"
                  >
                    <Icon
                      icon="mdi:scooter-outline"
                      style={{
                        width: "0.8rem",
                        height: "0.8rem",
                        color: "black",
                        cursor: "pointer",
                      }}
                    />
                  </button>
                }
              >
                <Dileverypop
                  handleVehichleTypeField={handleVehichleTypeField}
                  handleDistanceField={handleDistanceField}
                  generalInfo={generalInfo}
                />
              </PopoverDemo>
          </div>
          <div style={{ width: "calc(10%)", minWidth: "50px" }} >
            <Stextfield
              name="labourfield"
              label=""
              value={ generalInfo?.payment?.DileveryCharge?.total || 0 }
              type="number"
              labelclassname=""
              textfieldclassname="paymenttextfield"
              divclassname=""
              placeholder=""
              disabled={true}
            />
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
            <PopoverDemo
          
                contentclass=""
                btnclass=""
                side="top"
                icon={
                  <button
                    className={"PopIconButton "}
                    aria-label="Update dimensions"
                  >
                    <Icon
                      icon="game-icons:nails"
                      style={{
                        width: "0.8rem",
                        height: "0.8rem",
                        color: "black",
                        cursor: "pointer",
                      }}
                    />
                  </button>
                }
              >
                <Fittingpop
                  setGeneralInfo={setGeneralInfo}
                  generalInfo={generalInfo}
                />
              </PopoverDemo>
          </div>
          <div style={{ width: "calc(10%)", minWidth: "50px" }}>
            <Stextfield
              name="otherfield"
              label=""
              value={generalInfo?.payment?.fittingCharge?.total || 0}
              type="number"
              labelclassname=""
              textfieldclassname="paymenttextfield"
              divclassname=""
              placeholder=""
             disabled={true}
            />
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
          <div style={{ width: "calc(10%)", minWidth: "50px" }}>
            <Stextfield
              name="discountfield"
              label=""
              value={generalInfo.payment.labourCharge}
              type="number"
              labelclassname=""
              textfieldclassname="paymenttextfield"
              divclassname=""
              placeholder=""
              onChange={(e) =>
                setGeneralInfo((prev) => {
                  return {
                    ...prev,
                    payment: {
                      ...prev.payment,
                      labourCharge: e.target.value ? e.target.value : 0,
                    },
                  };
                })
              }
              disabled={false}
            />
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
              width: "calc(10% - 40px)",
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
          <div style={{ width: "calc(10%)", minWidth: "50px" }}>
            <Stextfield
              name="discountfield"
              label=""
              value={generalInfo.payment.discount}
              type="number"
              labelclassname=""
              textfieldclassname="paymenttextfield"
              divclassname=""
              placeholder=""
              onChange={(e) =>
                setGeneralInfo((prev) => {
                  return {
                    ...prev,
                    payment: {
                      ...prev.payment,
                      discount: e.target.value ? e.target.value : 0,
                    },
                  };
                })
              }
              disabled={false}
            />
          </div>
        </div>
        {/* <div style={{display:"flex", alignItems:"center",padding:"0px 20px", borderBottom:"1px solid rgb(233, 233, 231)"}}>
          <div style={{width:"90%",borderRight:"1px solid rgb(233, 233, 231)", padding:"10px 20px", display:"flex", justifyContent:"end"}}>Total ( after GST(18%) )</div>
          <div style={{width:"10%", minWidth:"50px", padding:"10px 20px"}}>{calculateProductCharge()+paymentinfo.MeasurementCharge+paymentinfo.LabourCharge+paymentinfo.fittingCharge + (calculateProductCharge()+paymentinfo.MeasurementCharge+paymentinfo.LabourCharge+paymentinfo.fittingCharge)*(18/100)}</div>
         </div> */}
        {/* {!selectedorder && <div
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
              alignItems: "center",
            }}
          >
            <div
              style={{
                marginRight: !selectedorder && "10px",
                display: "flex",
                alignItems: "center",
                gap: "40px",
              }}
            >
              <div
                style={{ display: "flex", gap: "20px", alignItems: "center" }}
              >
                 {generalInfo.paymenthis.length>0 && generalInfo.paymenthis[0].paidOptionInfo
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
              <div>Paid</div>
            </div>
            {!selectedorder && (
              <PopoverDemo
           
                contentclass=""
                btnclass=""
                side="top"
                icon={
                  <button
                    className={"PopIconButton "}
                    aria-label="Update dimensions"
                  >
                    <Icon
                      icon="material-symbols:payments-outline"
                      style={{
                        width: "0.8rem",
                        height: "0.8rem",
                        color: "green",
                        cursor: "pointer",
                      }}
                    />
                  </button>
                }
              >
                <Payment
                  paymentinfo={generalInfo.payment}
                  handlePayAmountChange={handlePaymentAmountChange}
                  handlePaycheckchange={handlePaymentcheckchange}
                />
              </PopoverDemo>
            )}
          </div>

          <div style={{ width: "calc(10%)", minWidth: "50px" }}>
            <Stextfield
              name="carriagefield"
              label=""
              value={generalInfo.payment.paid}
              type="number"
              labelclassname=""
              textfieldclassname="paymenttextfield"
              divclassname=""
              placeholder=""
              onChange={(e) =>
                setGeneralInfo((prev) => {
                  return {
                    ...prev,
                    payment: {
                      ...prev.payment,
                      paid: e.target.value ? e.target.value : 0,
                    },
                  };
                })
              }
              disabled={true}
            />
          </div>
        </div>} */}
        {/* {!selectedorder?
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
            Pending
          </div>
          <div
            style={{
              width: "calc(10% - 40px)",
              minWidth: "50px",
              padding: "10px 20px",
            }}
          >
            Rs. {calculatePending()}
          </div>
        </div>: */}
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
          Bill after discount
        </div>
        <div
          style={{
            width: "calc(10% - 40px)",
            minWidth: "50px",
            padding: "10px 20px",
          }}
        >
          Rs. {calculateFinalBill()}
        </div>
      </div>
        {/* } */}
      </div>

      {selectedorder && <div
          style={{
            paddingBottom: "0px 20px",
            display: "flex",
            justifyContent: "end",
            marginTop: "10px",
            color:"rgb(55, 53, 47)"
          }}
        >
          <button onClick={() => UpdatePayment()} className="tertiarybtn">
            Update initial payment
          </button>
        </div>}
    
        </>
    )
}

Paymentinfo.propTypes = { 

  // handlePaymentAmountChange: PropTypes.func.isRequired,
  // handlePaymentcheckchange: PropTypes.func.isRequired,
  // calculatePending: PropTypes.func.isRequired,
  calculateTotalBill: PropTypes.func.isRequired,
  setGeneralInfo: PropTypes.func.isRequired,
  calculateProductCharge: PropTypes.func.isRequired,
  generalInfo: PropTypes.any.isRequired,
  selectedorder: PropTypes.object.isRequired,
  UpdatePayment: PropTypes.func.isRequired,
  handleVehichleTypeField: PropTypes.func.isRequired,
  handleDistanceField: PropTypes.func.isRequired,
  calculateFinalBill: PropTypes.func.isRequired

  };


export default Paymentinfo;