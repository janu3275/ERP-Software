
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { returnAllGlassAccessories, returnAllglassInventory, returnAllotherItems } from "../../../../../../commonfn";
import DialogDemo from "../../../../../../assets/singlecomponents/dialog/dialog";
import InventoryItems from "./glassInventory/glassItems";
import GlassItemAndQunatity from "./glassInventory/glassitemAndQuantity";
import AccessoryItems from "./glassAccessory/accessoryItems";
import OtherItems from "./otherProducts/otherItems";
import GlassAccessoryAndQunatity from "./glassAccessory/accessoryItemAndQuantity";
import OtherItemAndQunatity from "./otherProducts/otherItemsAndQuantity";




const BillItemsComp = ({ onChange, value, product_type }) => { 

const [ItemsArr, setItemsArr] = useState({
    InventoryArr:[],
    accessoryArr:[],
    otherProductsArr:[]
})
const [itemsFormOpen, setitemsFormOpen] = useState(false)

const setinitialData = async() => {
   if(product_type==='glass products'){
    setInventoryData()
   }else if(product_type==='glass accessories'){
    setAccessoryData()
   }else{
    setOtherProductsData()
   }
    
} 

const setInventoryData = async() => {
    const InventoryArr = await returnAllglassInventory()
    setItemsArr((prev)=>{
        return {
            ...prev,
            InventoryArr:InventoryArr
        }
    })
    
}

const setAccessoryData = async() => {
    const AccessoryArr = await returnAllGlassAccessories()
    setItemsArr((prev)=>{
        return {
            ...prev,
            accessoryArr:AccessoryArr
        }
    })
    
}

const setOtherProductsData = async() => {

    const otherProductsArr = await returnAllotherItems()

    setItemsArr((prev) => {
        return {
            ...prev,
            otherProductsArr:otherProductsArr
        }
    })
    
}

const closeInventoryItems = () => {
    setitemsFormOpen(false)
}
   
useEffect(() => {
 setinitialData()
},[])
   

    return (

       <div style={{display:"flex", flexDirection:"column", gap:"20px", marginBottom:"20px"}}>
       
            <DialogDemo Open={itemsFormOpen} setOpen={setitemsFormOpen} buttontext={value.length>0?"Update items":"Add items"}  contentclass="dailogcontentclass" btnclass = 'tertiarybtn'> 
         {(props) => ( 

        product_type==='glass products'?<InventoryItems {...props} onChange={onChange} value={value} glassInventoryArr={ItemsArr.InventoryArr}  closeInventoryItems={closeInventoryItems}/>:
        product_type==='glass accessories'? <AccessoryItems {...props} onChange={onChange} value={value} glassAccessoryArr={ItemsArr.accessoryArr}  closeInventoryItems={closeInventoryItems}/>
        : <OtherItems {...props} onChange={onChange} value={value} otherItemsArr={ItemsArr.otherProductsArr}  closeInventoryItems={closeInventoryItems}/>
   
    )}
            
            </DialogDemo>
            
            {product_type==='glass products'? <GlassItemAndQunatity onChange={onChange} value={value} glassInventoryArr={ItemsArr.InventoryArr} />:
             product_type==='glass accessories'? <GlassAccessoryAndQunatity onChange={onChange} value={value} glassAccessoryArr={ItemsArr.accessoryArr} />:
             <OtherItemAndQunatity onChange={onChange} value={value} otherItemsArr={ItemsArr.otherProductsArr} />
            }
            
           
       </div>

      )
}

BillItemsComp.propTypes = {
    onChange: PropTypes.func.isRequired,
    value: PropTypes.array.isRequired,
    product_type: PropTypes.string.isRequired
};



export default BillItemsComp;