import "./generalinfo.css";
import PropTypes from "prop-types";
import { SelectDemo } from '../../../../../assets/singlecomponents/select/select';
import Stextfield from '../../../../../assets/singlecomponents/singletextfield/stextfield';
import Calendar from "../../../../../assets/singlecomponents/calender/calender";
import { useState } from "react";
import DialogDemo from "../../../../../assets/singlecomponents/dialog/dialog";
import CustomerSearchComp from "../../../customerManagement/catalog/customerSearchComp";
import SingleLabelwithtextarea from "../../../../../assets/singlecomponents/textarea/singletextarea";



const Generalinfo = ({generalInfo,setGeneralInfo, allCustomer, handleDateChange, UpdateGeneralInfo, selectedorder, getTodaysdate, allCustomerInfo, viewOrder }) => {

  const [openCustomerForm, setOpenCustomerForm] = useState(false)
  const selectCustomer = (customer) => {
  console.log(customer)
  setGeneralInfo((prev) => {
 
    return {
      ...prev,
      customer: {
        ...prev.customer,
        name: customer[0].value,
        id: customer[0].id
      },
    };
  })

  setOpenCustomerForm(false)

  }

  const triggerOpencustomerForm = ()=>{
    if(!openCustomerForm){
      setOpenCustomerForm(true)
    }
  }

    return (
        <>
     
        <div>
          <div
            style={{
              padding: "20px",
              border: "1px solid rgb(233, 233, 231)",
              borderBottom: "0",
              borderTopLeftRadius:"6px",
              borderTopRightRadius:"6px",
              color:"rgb(55, 53, 47)",
              fontSize:"17px",
              fontWeight:"500"
            }}

          >
            General Information
          </div>
          <div
            style={{
              padding: "20px",
              border: "1px solid rgb(233, 233, 231)",
              borderBottom: "1px solid rgb(233, 233, 231)",
              borderBottomLeftRadius:"6px",
              borderBottomRightRadius:"6px"
            }}
          >
            <div
              style={{
                display: "flex",
                gap: "20px",
                justifyContent: "space-between",
                marginBottom:"20px"
              }}
            >
              {/* <SelectDemo
                placeholder="Choose customer"
                divclassname="primarytextdivclass"
                labelclassname = "formlabel"
                triggerclassname="customertriggerclass"
                groups={allCustomer}
                label="Customer"
                onChange={(e, name, index) =>
                  setGeneralInfo((prev) => {
                    console.log(e, name, index);
                    return {
                      ...prev,
                      customer: {
                        ...prev.customer,
                        name: e,
                        id: allCustomerInfo.filter(
                          (customer) => customer.name === e
                        )[0].id,
                      },
                    };
                  })
                }
                value={generalInfo.customer.name}
                name="customer"
              /> */}

                 <Stextfield
                  name="customer"
                  label="Customer"
                  value={generalInfo.customer.name}
                  type="text"
                  labelclassname="formlabel"
                  textfieldclassname="primarytextfieldclass"
                  divclassname="primarytextdivclass"
                  // divclassname="measurediv"
                  placeholder="Choose customer"
                  onclick={triggerOpencustomerForm}
                  disabled={false}
                />
            
            <DialogDemo Open={openCustomerForm} setOpen={setOpenCustomerForm} buttontext=""  contentclass="dailogcontentclass" btnclass = 'primarybtndiv'> 
         {(props) => (
          
             
              <CustomerSearchComp
              {...props}
              selectCustomer={selectCustomer}
              />
            )}
         </DialogDemo>
             
           
              <div
               className="primarytextdivclass"
              >
                <div className="formlabel">Order to be dilevered by :</div>
              
                  <Calendar
             
                  onDateSelect={(date) => {
                    handleDateChange(date)
                   }}

                  date = {generalInfo.completionDate }
                  mindate={getTodaysdate().mindate}
             
             />
              </div>
           
            </div>

            <div
              style={{
                display: "flex",
                gap: "20px",
                justifyContent: "space-between",
                marginBottom:"20px"
              }}
            >
                 <SingleLabelwithtextarea
             name="shipping_address"
             label="Shipping address"
             value={generalInfo.shipping_address}
             type="text"
             labelclassname="formlabel"
             textfieldclassname="primarytextareaclass"
             divclassname="primarytextdivclass"
             placeholder="Type shipping address"
             onChange={(e) =>
              setGeneralInfo((prev) => {
                return {
                  ...prev,
                  shipping_address: e.target.value,
                };
              })
            }
             disabled={false}
          />

            <Stextfield
                  name="measurement"
                  label="Measurement given by"
                  value={generalInfo.measuredby}
                  type="text"
                  labelclassname="formlabel"
                  textfieldclassname="primarytextfieldclass"
                  divclassname="primarytextdivclass"
                  // divclassname="measurediv"
                  placeholder="Person who is giving measurement"
                  onChange={(e) =>
                    setGeneralInfo((prev) => {
                      return {
                        ...prev,
                        measuredby: e.target.value,
                      };
                    })
                  }
                  disabled={false}
                />

         
          </div>
          </div>
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
          <button
            onClick={() => UpdateGeneralInfo()}
            className="tertiarybtn"
          >
            Update general information
          </button>
        </div>}
        </>
    )
}

Generalinfo.propTypes = { 

    selectedobj: PropTypes.object.isRequired,
    generalInfo:PropTypes.object.isRequired, 
    setGeneralInfo: PropTypes.func.isRequired,
    allCustomer: PropTypes.array.isRequired, 
    handleDateChange: PropTypes.func.isRequired, 
    UpdateGeneralInfo: PropTypes.func.isRequired, 
    selectedorder:PropTypes.object.isRequired, 
    getTodaysdate:PropTypes.func.isRequired, 
    allCustomerInfo: PropTypes.array.isRequired

  };


export default Generalinfo;