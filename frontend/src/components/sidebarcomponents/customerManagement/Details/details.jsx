import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import PropTypes from "prop-types";
import "./details.css";
import { Axios } from "../../../../../utils/axios.mjs";
import CustomerInfoform from "./Info/Infoform";
import CustomerPayments from './payments/payments';
import CustomerOrder from "./orders/cutomerOrders";


const CustomerDetails = ({ CustomerId }) => {
    
    const components = [{name:'Customer details', icon:<Icon
      icon="mdi:file-account-outline"
      style={{
        width: "1.5rem",
        height: "1.5rem",
        color: "rgb(228 123 78)",
        cursor:"pointer"
        
        }}
    />,  
  
  largeicon: <Icon
  icon="mdi:file-account-outline"
  style={{
    width: "3rem",
    height: "3rem",
    color: "rgb(228 123 78)",
    cursor:"pointer"
    
    }}
/>

    }, {name:'Customer Payments',
      icon:<Icon
      icon="tdesign:money"
      style={{
        width: "1.3rem",
        height: "1.3rem",
        color: "rgb(30 171 7)",
        cursor:"pointer"
        
        }}
    />,
    largeicon: <Icon
  icon="tdesign:money"
  style={{
    width: "3rem",
    height: "3rem",
    color: "rgb(30 171 7)",
    cursor:"pointer"
    
    }}
/>
    },{name: 'Customer Orders', icon:<Icon
      icon="mingcute:documents-line"
      style={{
        width: "1.5rem",
        height: "1.5rem",
        color: "rgb(60, 137, 255)",
        cursor:"pointer"
        
        }}
    />,
    largeicon: <Icon
  icon="mingcute:documents-line"
  style={{
    width: "2.8rem",
    height: "2.8rem",
    color: "rgb(60, 137, 255)",
    cursor:"pointer"
    
    }}
/>}]
    const [selectedtab, setselectedtab] = useState('Customer details')
    const [selectedtabIcon, setselectedtabIcon] = useState(<Icon
      icon="mdi:file-account-outline"
      style={{
        width: "3rem",
        height: "3rem",
        color: "rgb(228 123 78)",
        cursor:"pointer"
        
        }}
    />);
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

    const switchTab = (comp) => {
      
      if(selectedtab!==comp.name){
          setselectedtab(comp.name)
          setselectedtabIcon(comp.largeicon)
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
        {components.length>0 && components.map((comp, index)=><button onClick={()=>switchTab(comp)}  className={selectedtab===comp.name ? "tabletabbtn select":"tabletabbtn"} key={index}> <div className={selectedtab===comp.name ? "tabletabdiv select":"tabletabdiv"}>{comp.icon}{comp.name}</div>  </button>)}
      </div>
      <div className="infocomp">
      {CustomerInfo && selectedtab==='Customer details' && 
      <div style={{width:"max-content", margin:"auto"}}>  
        <div style={{width:"auto"}} className="tabheading">{selectedtabIcon}{selectedtab}</div>
        {CustomerInfo && <CustomerInfoform selectedCustomer={CustomerInfo} UpdateCustomer={UpdateCustomer} /> }
        
        </div>}
        {CustomerId && selectedtab==='Customer Payments' && 
      <div> 
        <div className="billtabheading">{selectedtabIcon} {selectedtab} </div>
        <CustomerPayments CustomerId={CustomerId}/> 
        
        </div>}

        {CustomerId && selectedtab==='Customer Orders' && 
      <div> 
        <div className="billtabheading">{selectedtabIcon} {selectedtab} </div>
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