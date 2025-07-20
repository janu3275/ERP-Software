import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import PropTypes from "prop-types";
import "./details.css";
import { Axios } from "../../../../../utils/axios.mjs";
import VendorInfoform from "./vendorInfo/vendorInfoform";
import VendorBills from "./vendorbillls/vendorBills";
import VendorPayments from "./vendorPayments/vendorPayments";
import VendorPOs from "./vendorPo/vendorPo";
import { useGetVendorByID, useUpdateVendor } from "../../Vendorqueryhooks";
import { useQueryClient } from "@tanstack/react-query";

const VendorDetails = ({vendorId}) => {
    
    const queryClient = useQueryClient(); 
    const [selectedtab, setselectedtab] = useState('Vendor details')
    const [selectedtabIcon, setselectedtabIcon] = useState(<Icon
      icon="mdi:file-account-outline"
      style={{
        width: "3rem",
        height: "3rem",
        color: "rgb(228 123 78)",
        cursor:"pointer"
        
        }}
    />);
    const updateVendorSuccessfn = () => {
      // Invalidate or refetch the vendor list query
      queryClient.invalidateQueries({ queryKey:[`vendors`] });
      queryClient.invalidateQueries({ queryKey:[`vendors-${vendorId}`] });


   }
  
    const { data: vendorInfo , error: getVendorByIDerr, isLoading: getVendorByIDIsLoading } = useGetVendorByID(null, vendorId);

    const { mutate: triggerUpdateVendor , error: updateVendorByIDerr, isLoading: updateVendorByIDIsLoading } = useUpdateVendor(updateVendorSuccessfn);

    const components = vendorInfo?.product_type === 'glass products' ? [{name:'Vendor details', icon:<Icon
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
/> },{name:'Purchase Orders', icon:<Icon
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
/>}, {name:'Bills',  icon:<Icon
      icon="oui:documents"
      style={{
        width: "1.3rem",
        height: "1.3rem",
        color: "rgb(185, 7, 7)",
        cursor:"pointer"
        
        }}
    />,
    largeicon: <Icon
  icon="oui:documents"
  style={{
    width: "3rem",
    height: "3rem",
    color: "rgb(185, 7, 7)",
    cursor:"pointer"
    
    }}
/>}, {name:'Payments', icon:<Icon
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
/>}] : [{name:'Vendor details', icon:<Icon
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
/> }, {name:'Bills',  icon:<Icon
      icon="oui:documents"
      style={{
        width: "1.3rem",
        height: "1.3rem",
        color: "rgb(185, 7, 7)",
        cursor:"pointer"
        
        }}
    />,
    largeicon: <Icon
  icon="oui:documents"
  style={{
    width: "3rem",
    height: "3rem",
    color: "rgb(185, 7, 7)",
    cursor:"pointer"
    
    }}
/>}, {name:'Payments', icon:<Icon
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
/>}]

    


    const switchTab = (comp) => {
      if(selectedtab!==comp.name){
        setselectedtab(comp.name)
        setselectedtabIcon(comp.largeicon)
    }
      
    }

 

 

  
return (

        <div style={{overflow:"auto", marginRight:"-20px"}} className="detailoutercomp">
      <div className="switchtabletabs">
        {components.length>0 && components.map((comp, index)=> <button onClick={()=>switchTab(comp)}  className={selectedtab===comp.name ? "tabletabbtn select":"tabletabbtn"} key={index}> <div className={selectedtab===comp.name ? "tabletabdiv select":"tabletabdiv"}>{comp.icon}{comp.name}</div>  </button>)}
      </div>
      <div className="infocomp">
      {vendorInfo && selectedtab==='Vendor details' && 
      <div style={{width:"max-content", margin:"auto"}}> 
        <div className="tabheading" style={{width:"auto"}}>{selectedtabIcon}{selectedtab}</div>
        <VendorInfoform selectedVendor={vendorInfo} UpdateVendor={triggerUpdateVendor} /> 
        
        </div>}

        {vendorId && selectedtab==='Bills' && 
      <div> 
        <div className="billtabheading">{selectedtabIcon}{selectedtab}</div>
        { vendorInfo && <VendorBills vendorId={vendorId} product_type={vendorInfo.product_type}/> }
        
        </div>} 

        {vendorId && selectedtab==='Payments' && 
      <div> 
        <div className="billtabheading">{selectedtabIcon} {selectedtab} </div>
        <VendorPayments vendorId={vendorId}/> 
        
        </div>}

        {vendorId && selectedtab==='Purchase Orders' && 
      <div> 
        <div className="billtabheading">{selectedtabIcon} {selectedtab} </div>
        <VendorPOs vendorId={vendorId} /> 
        
        </div>}
      </div>
      </div>
    )
}

VendorDetails.propTypes = {
    vendorId: PropTypes.any.isRequired,
};


export default VendorDetails;