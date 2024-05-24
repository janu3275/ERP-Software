import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import PropTypes from "prop-types";
import Customer from "./customers/customers";
import Position from "./positions/position";

import ExpenseService from "./expenseServices/expenseService";
import GlassColor from "./glass_properties/glass_color/glassColor";
import GlassCompany from "./glass_properties/glass_company/glassCompany";
import GlassSize from "./glass_properties/glass_size/glassSize";
import GlassThickness from "./glass_properties/glass_thickness/glassThickness";
import GlassType from "./glass_properties/glass_type/glassType";
import GlassCustomization from "./glass_services/customization/customization";
import GlassDilevery from "./glass_services/dilevery/dilevery";
import GlassFitting from "./glass_services/fitting/fitting";
import GlassMeasurement from "./glass_services/measurement/measurement";
import GlassAccessory from "./products/glassAccessory/glassAccessory";
import GlassInventory from "./products/glassInventory/glassInventory";
import GlassProduct from "./products/glassProduct/glassProduct";
import OtherProduct from "./products/otherProduct/otherProduct";
import Units from "./units/units";
import Department from "./departments/department";
import EmiType from "./emiTypes/emiTypes";

const CommonComp = ({selectedtab}) => {
  
 
    const returnHeading = (selectedtab) =>{
      if(selectedtab.customers){
        return "Customers"
      }else if(selectedtab.departments){
        return "Departments"
      }else if(selectedtab.positions){
        return "Positions"
      }else if(selectedtab.expenseServices){
        return "Services being used"
      }else if(selectedtab.glassColor){
        return "Glass color"
      }else if(selectedtab.glassCompany){
        return "Glass company"
      }else if(selectedtab.glassSize){
        return "Glass size"
      }else if(selectedtab.glassThickness){
        return "Glass thickness"
      }else if(selectedtab.glassTypes){
        return "Glass types"
      }else if(selectedtab.glassCustomisation){
        return "Glass customisation"
      }else if(selectedtab.glassDilevery){
        return "Glass dilevery"
      }else if(selectedtab.glassFitting){
        return "Glass fitting"
      }else if(selectedtab.glassMeasurement){
        return "Glass Measurement"
      }else if(selectedtab.glassAccessory){
        return "Glass accessory"
      }else if(selectedtab.glassInventory){
        return "Glass inventory"
      }else if(selectedtab.glassProducts){
        return "Glass products"
      }else if(selectedtab.otherProducts){
        return "Other proucts"
      }else if(selectedtab.units){
        return "Units"
      }else if(selectedtab.emiTypes){
        return "Emi types"
      }
    }
 

  




  
    return (

    <div className="detailoutercomp">
     
      <div className="infocomp">
      
      <div> 
      <div className="tabheading" style={{width:"auto"}}>{returnHeading(selectedtab)}</div>
        { selectedtab.customers? <Customer />
        : selectedtab.positions? <Position />
        : selectedtab.departments? <Department />
        : selectedtab.expenseServices? <ExpenseService />
        : selectedtab.glassColor? <GlassColor />
        : selectedtab.glassCompany? <GlassCompany />
        : selectedtab.glassSize? <GlassSize />
        : selectedtab.glassThickness? <GlassThickness />
        : selectedtab.glassTypes? <GlassType />
        : selectedtab.glassCustomisation? <GlassCustomization />
        : selectedtab.glassDilevery? <GlassDilevery />
        : selectedtab.glassFitting? <GlassFitting />
        : selectedtab.glassMeasurement? <GlassMeasurement />
        : selectedtab.glassAccessory? <GlassAccessory />
        : selectedtab.glassInventory? <GlassInventory />
        : selectedtab.glassProducts? <GlassProduct />
        : selectedtab.otherProducts? <OtherProduct />
        : selectedtab.units? <Units />
        : selectedtab.emiTypes? <EmiType />
        :
        <></>}
      </div>

    </div>
      </div>
    )
}

CommonComp.propTypes = {
    selectedtab: PropTypes.string.isRequired
};


export default CommonComp;