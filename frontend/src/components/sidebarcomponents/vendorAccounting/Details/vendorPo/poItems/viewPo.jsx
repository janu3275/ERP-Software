import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { returnAllglassInventory, returnConvertedDate } from "../../../../../../commonfn";






const ViewPo = ({value, poRef}) => { 

  const [glassInventoryArr, setglassInventoryArr] = useState([])


  const setinitialData = async() => {
    const glassInventoryArr = await returnAllglassInventory()
    setglassInventoryArr(glassInventoryArr)
    
  } 


  const returnItemName = (item) => {

    if(!item || glassInventoryArr.length<=0){
        console.log(item)
        return 
    }

    const inventoryItem = glassInventoryArr.filter((inventory)=>inventory.id===item.glass_inventory_id)[0]
    return `${inventoryItem['thickness']}mm ${inventoryItem['color']} ${inventoryItem['glass_type']} ${inventoryItem['glass_company']} - glass`

  }

  const returnItemSize = (item) => {
    if(!item || glassInventoryArr.length<=0){
        console.log(item)
        return 
    }
    const inventoryItem = glassInventoryArr.filter((inventory)=>inventory.id===item.glass_inventory_id)[0]
    return `${inventoryItem ['length']} x ${inventoryItem ['width']}`
  }

   useEffect(() => {
   setinitialData()
   },[])

   
    console.log(value)
    return (
        <div style={{display:"flex", flexDirection:"column", gap:"20px", padding:"20px 0px"}}  ref={poRef}>
       {value?.create_time && <div style={{display:"flex", gap:"10px", paddingLeft:"75px"}}><div>Purchase Order date:</div><div>{returnConvertedDate(value?.create_time)}</div></div>}
       <div className="table-container" style={{width:"fit-content", margin:"auto"}}>

      <div className="table-header-row">
        <div className="table-header-cell" style={{minWidth:"30rem"}}>Glass Item</div>
        <div className="table-header-cell">Size (in ft)</div>
        <div className="table-header-cell" style={{ borderRight:"0"}}>Quantity (In files)</div>
      </div>

      {value?.gls_items && value?.gls_items.map((item, index)=> <div key={index} className="table-row">
        <div className="table-row-cell" style={{minWidth:"30rem"}}>{returnItemName(item)}</div>
        <div className="table-row-cell">{returnItemSize(item)}</div>
        <div className="table-row-cell" style={{  background:"rgba(242, 241, 238, 0.6)", marginBottom:"0.6px"}}>
         {value?.gls_items[index].quantity}
          </div>
      </div>)}

       </div>
       </div>

      )
}

ViewPo.propTypes = {
    
    value: PropTypes.array.isRequired,
    poRef: PropTypes.any
};



export default ViewPo;