

import PropTypes from "prop-types";
import { Axios } from "../../../../../../../utils/axios.mjs";
import { useEffect, useState } from "react";
import { returnAllglassInventory } from "../../../../../../commonfn";
import DialogDemo from "../../../../../../assets/singlecomponents/dialog/dialog";
import InventoryItems from "./InventoryItems";
import PoItemAndQunatity from "./poitemAndQuantity";
import "./poItemsComp.css";




const PoItemsComp = ({onChange, value}) => { 

const [glassInventoryArr, setglassInventoryArr] = useState([])
const [itemsFormOpen, setitemsFormOpen] = useState(false)

const setinitialData = async() => {
    const glassInventoryArr = await returnAllglassInventory()
    setglassInventoryArr(glassInventoryArr)
    
} 

const closeInventoryItems = ()=>{
    setitemsFormOpen(false)
}
   
useEffect(() => {
 setinitialData()
},[])
   

    return (

       <div style={{display:"flex", flexDirection:"column", gap:"20px", marginBottom:"20px"}}>
       
            <DialogDemo Open={itemsFormOpen} setOpen={setitemsFormOpen} buttontext={value.length>0?"Update items":"Add items"}  contentclass="dailogcontentclass" btnclass = 'tertiarybtn'> 
         {(props) => ( 

            //   <button onClick={(e)=>{
            //     e.preventDefault()
            //     setitemsFormOpen(true)
            //     }} className="primarybtndiv">{value.length>0?"Update items":"Add items"}</button>
               <InventoryItems {...props} onChange={onChange} value={value} glassInventoryArr={glassInventoryArr}  closeInventoryItems={closeInventoryItems}/>
         )}
            
            </DialogDemo>
            
            <PoItemAndQunatity onChange={onChange} value={value} glassInventoryArr={glassInventoryArr}/>
            
           
       </div>

      )
}

PoItemsComp.propTypes = {
    onChange: PropTypes.func.isRequired,
    value: PropTypes.array.isRequired
};



export default PoItemsComp;