import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import PropTypes from "prop-types";
import "./details.css";
import { Axios } from "../../../../../utils/axios.mjs";
import CustomerInfoform from "./Info/Infoform";
import CustomerPayments from './payments/payments';
import CustomerOrder from "./orders/cutomerOrders";


const CustomerDetails = ({ CustomerId }) => {
    
    const components = ['Customer details', 'Customer Payments', 'Customer Orders']
    const [selectedtab, setselectedtab] = useState('Customer details')
    const [CustomerInfo, setCustomerInfo] = useState(null)






    const initialiseData = async(CustomerId) => {

     
      const Customer = await returnCustomerInfoById(CustomerId)
      setCustomerInfo(Customer)

    }

    const returnCustomerInfoById = async(CustomerId) => { 
        console.log(CustomerId)
        try {

            let res = await Axios.get(`/Customer/getbyid/${CustomerId}`)
            if(res.data.success){
              console.log(res.data.data)
              let Customerinfo = res.data.data
              return Customerinfo
              
            }

          } catch (error) {
            console.log(error)
          }

    }

    const switchTab = (name)=>{
        if(selectedtab!==name){
            setselectedtab(name)
        }
      
    }

    const UpdateCustomer = async({data, Customerid}) => {

      console.log(data)

    try {

        let body = {
          customerid: `${Customerid}`, 
          ...data
     
        }

        let res = await Axios.post( `/Customer/update`, body )

        if(res.data.success){
          const Customer = await returnCustomerInfoById(Customerid)
          setCustomerInfo(Customer)
        }

      } catch (error) {
        console.log(error)
      }

    }

  



    useEffect(() => {
    initialiseData(CustomerId)
    },[CustomerId])

  
    return (
        <div style={{overflow:"auto", marginRight:"-20px"}} className="detailoutercomp">
      <div className="switchtabletabs">
        {components.length>0 && components.map((name, index)=><button onClick={()=>switchTab(name)}  className={selectedtab===name ? "tabletabbtn select":"tabletabbtn"} key={index}> <div className={selectedtab===name ? "tabletabdiv select":"tabletabdiv"}>{name}</div>  </button>)}
      </div>
      <div className="infocomp">
      {CustomerInfo && selectedtab==='Customer details' && 
      <div style={{width:"max-content", margin:"auto"}}>  
        <div style={{width:"auto"}} className="tabheading">{selectedtab}</div>
        {CustomerInfo && <CustomerInfoform selectedCustomer={CustomerInfo} UpdateCustomer={UpdateCustomer} /> }
        
        </div>}
        {CustomerId && selectedtab==='Customer Payments' && 
      <div> 
        <div className="billtabheading"> {selectedtab} </div>
        <CustomerPayments CustomerId={CustomerId}/> 
        
        </div>}

        {CustomerId && selectedtab==='Customer Orders' && 
      <div> 
        <div className="billtabheading"> {selectedtab} </div>
        <CustomerOrder CustomerId={CustomerId}/> 
        
        </div>}
      </div>
      </div>
    )
}

CustomerDetails.propTypes = {
       CustomerId: PropTypes.any.isRequired
};


export default CustomerDetails;