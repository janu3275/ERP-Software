import {  useState } from "react";
import { Icon } from "@iconify/react";
import PropTypes from "prop-types";
import "./VendorPanel.css";
import { toCamelCase } from "../../../../commonfn";
import Stextfield from "../../../../assets/singlecomponents/singletextfield/stextfield";
import { useGetVendors } from "../../Vendorqueryhooks";

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
        <button className={selectedTab.summary?"sidebarButton select":"sidebarButton"}  onClick={()=>selectSummaryTab()}> 
            <div className="singlepanel" >
                <div className="PanelName">Summary</div>
                <div>  
                    {selectedTab.summary && <Icon
                icon="iconamoon:arrow-right-2-bold"
                style={{
                  width: "1.2rem",
                  height: "1.2rem",
                  color: "#515151",
                  cursor: "pointer",
                }}
                />}</div>
            </div>  
        </button>
        <button className={selectedTab.catalog?"sidebarButton select":"sidebarButton"}  onClick={()=>selectCatalogTab()}> 
            <div className="singlepanel" >
                <div className="PanelName">Catalog</div>
                <div>  
                    {selectedTab.catalog && <Icon
                icon="iconamoon:arrow-right-2-bold"
                style={{
                  width: "1.2rem",
                  height: "1.2rem",
                  color: "#515151",
                  cursor: "pointer",
                }}
                />}</div>
            </div>  
        </button>
       
         <div style={{width:"-webkit-fill-available", marginTop:"10px"}}>
        {/* <div>Vendors</div>  */}
        <div>
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
        /></div>   
        </div>   
        </div>
        <div className="sidebarmiddiv">
        {returnfilterVendors(allVendorinfo, searchvalue).length>0 && returnfilterVendors(allVendorinfo, searchvalue).map((vendor, index)=><button key={index} className={selectedTab.vendorId==vendor.id?"sidebarButton select":"sidebarButton"} style={{padding:"5px 10px"}} onClick={()=>selectVendor(vendor.id)}>
        <div className="singlepanel" >
            <div style={{display:"flex", flexDirection:"column", justifyContent:"space-between", gap:"0.3rem", height:"-webkit-fill-available"}}>
                <div className="PanelName">{toCamelCase(vendor.vendor_name)}</div>
                <div className="Panelperson">{toCamelCase(vendor.contact_person)}</div>
            </div>
            <div>
            {selectedTab.vendorId==vendor.id && <Icon
                icon="iconamoon:arrow-right-2-bold"
                style={{
                  width: "1.2rem",
                  height: "1.2rem",
                  color: "#515151",
                  cursor: "pointer",
                }}
                />}
            </div>
        </div>
        </button>)}
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