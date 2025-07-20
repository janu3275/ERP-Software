import {  useState } from "react";
import { Icon } from "@iconify/react";
import PropTypes from "prop-types";
import "./VendorPanel.css";
import { toCamelCase } from "../../../../commonfn";
import Stextfield from "../../../../assets/singlecomponents/singletextfield/stextfield";
import { useGetVendors } from "../../Vendorqueryhooks";
import PanelButton from "../../../../assets/singlecomponents/panelButton/panelbutton";


const VendorPanel = ({ selectVendor, selectSummaryTab, selectedTab, selectCatalogTab }) => {


    const [searchvalue, setsearchValue] = useState('');

    const { data: allVendorinfo , error: getVendorerr, isLoading: getVendorIsLoading } = useGetVendors();

    const returnfilterVendors = (allVendorinfo, searchvalue) => {
        console.log(allVendorinfo, searchvalue)
         if(!allVendorinfo){
          return []
         }
         if(!searchvalue){
          return allVendorinfo
         }
        
          const filterVendors =  allVendorinfo.filter((ven)=>ven.vendor_name.toLowerCase().includes(searchvalue.toLowerCase()))
          if(!filterVendors){
            return []
          }
          return filterVendors
        
      }

      const setFilterValue = (e, name, index)=> {
        let val = e.target.value
        setsearchValue(val)
      }

     

    
  
    return (
       
      <div className="OuterComp">
      <div className="Comp">
      <div className="sidebartopdiv" >
     
        <PanelButton selected={selectedTab.summary} name="Vendor account"  funct={selectSummaryTab}
        icon={<Icon
          icon="carbon:account"
          style={{
            width: "1.3rem",
            height: "1.3rem",
            color: "rgb(60, 137, 255)",
            cursor:"pointer"
            
            }}
        />}
        />
        

        <PanelButton selected={selectedTab.catalog} name="Vendors"  funct={selectCatalogTab} 
        icon={<Icon
          icon="bi:people"
          style={{
            width: "1.3rem",
            height: "1.3rem",
            color: "rgb(30, 171, 7)",
            cursor:"pointer"
            
            }}
        />}
        />
       </div>
       <div className="sidebarmiddiv"  >
        <div style={{width:"100%", position:"sticky", top:"0", backgroundColor:"white", zIndex:"1", paddingTop:"10px", marginLeft:"-15px", paddingLeft:"15px"}}>
         <div style={{display:"flex", alignItems:"center", justifyContent:"space-between", gap:"20px", width:"-webkit-fill-available", color:"#9f9f9f", fontSize:"14px", padding:"10px 0px", paddingTop:"0"}}>
        <div>All vendors</div> 
        </div> 
        <div style={{width:"-webkit-fill-available", marginBottom:"10px" }}>
        <Stextfield
          name='vendor'
          label=""
          value={searchvalue}
          type="text"
          labelclassname=""
          textfieldclassname="primarytextfieldclass"
          divclassname="primarytextdivclass"
          placeholder="search vendors .."
          onChange={setFilterValue}
          index={-1}
          disabled={false}
          error={undefined}
        />  
        </div>   
        </div>
        
        {returnfilterVendors(allVendorinfo, searchvalue).length>0 && returnfilterVendors(allVendorinfo, searchvalue).map((vendor, index)=>
        // <button key={index} className={selectedTab.vendorId==vendor.id?"sidebarButton select":"sidebarButton"} style={{padding:"5px 10px"}} onClick={()=>selectVendor(vendor.id)}>
        // <div className="singlepanel" >
        //     <div style={{display:"flex", flexDirection:"column", justifyContent:"space-between", gap:"0.3rem", height:"-webkit-fill-available"}}>
        //         <div className="PanelName">{toCamelCase(vendor.vendor_name)}</div>
        //         <div className="Panelperson">{toCamelCase(vendor.contact_person)}</div>
        //     </div>
        //     <div>
        //     {selectedTab.vendorId==vendor.id && <Icon
        //         icon="iconamoon:arrow-right-2-bold"
        //         style={{
        //           width: "1.2rem",
        //           height: "1.2rem",
        //           color: "#515151",
        //           cursor: "pointer",
        //         }}
        //         />}
        //     </div>
        // </div>
        // </button>
         <PanelButton key={index} selected={selectedTab.vendorId==vendor.id} name={(vendor.vendor_name)}  funct={selectVendor} functprop={vendor.id} 
         icon={<Icon
           icon="ic:sharp-account-circle"
           style={{
             width: "2rem",
             height: "2rem",
             color: "rgb(170 170 170)",
             cursor:"pointer"
             
             }}
         />}
         left="-48.1px"
         color="rgb(228, 123, 78)"
         />
      )}
        </div>
        </div>
      </div>
    )
}

VendorPanel.propTypes = {
    selectSummaryTab: PropTypes.func.isRequired,
    selectVendor: PropTypes.func.isRequired,
    selectedTab: PropTypes.object.isRequired,
    selectCatalogTab: PropTypes.func.isRequired
};


export default VendorPanel;