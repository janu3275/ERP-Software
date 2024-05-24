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

    const updateVendorSuccessfn = () => {
      // Invalidate or refetch the vendor list query
      queryClient.invalidateQueries({ queryKey:[`vendors`] });
      queryClient.invalidateQueries({ queryKey:[`vendors-${vendorId}`] });


   }
  
    const { data: vendorInfo , error: getVendorByIDerr, isLoading: getVendorByIDIsLoading } = useGetVendorByID(null, vendorId);

    const { mutate: triggerUpdateVendor , error: updateVendorByIDerr, isLoading: updateVendorByIDIsLoading } = useUpdateVendor(updateVendorSuccessfn);

    const components = vendorInfo?.product_type === 'glass products' ? ['Vendor details', 'Bills', 'Purchase Orders', 'Payments'] : ['Vendor details', 'Bills', 'Payments']

    


    const switchTab = (name) => {
        if(selectedtab!==name){
            setselectedtab(name)
        }
      
    }

 

 

  
return (

        <div className="detailoutercomp">
      <div className="switchtabletabs">
        {components.length>0 && components.map((name, index)=> <button onClick={()=>switchTab(name)}  className={selectedtab===name ? "tabletabbtn select":"tabletabbtn"} key={index}> <div className={selectedtab===name ? "tabletabdiv select":"tabletabdiv"}>{name}</div>  </button>)}
      </div>
      <div className="infocomp">
      {vendorInfo && selectedtab==='Vendor details' && 
      <div style={{width:"max-content", margin:"auto"}}> 
        <div className="tabheading" style={{width:"auto"}}>{selectedtab}</div>
        <VendorInfoform selectedVendor={vendorInfo} UpdateVendor={triggerUpdateVendor}/> 
        
        </div>}

        {vendorId && selectedtab==='Bills' && 
      <div> 
        <div className="billtabheading"> {selectedtab} </div>
        { vendorInfo && <VendorBills vendorId={vendorId} product_type={vendorInfo.product_type}/> }
        
        </div>} 

        {vendorId && selectedtab==='Payments' && 
      <div> 
        <div className="billtabheading"> {selectedtab} </div>
        <VendorPayments vendorId={vendorId}/> 
        
        </div>}

        {vendorId && selectedtab==='Purchase Orders' && 
      <div> 
        <div className="billtabheading"> {selectedtab} </div>
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