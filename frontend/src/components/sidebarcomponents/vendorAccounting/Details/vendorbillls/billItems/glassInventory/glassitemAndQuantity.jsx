import PropTypes from "prop-types";
import Stextfield from "../../../../../../../assets/singlecomponents/singletextfield/stextfield";





const GlassItemAndQunatity = ({ onChange, value, glassInventoryArr }) => { 



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

   

   

    return (

       <div className="table-container">

      <div className="table-header-row">
        <div className="table-header-cell" style={{minWidth:"30rem"}}>Glass Item</div>
        <div className="table-header-cell">Size (in ft)</div>
        <div className="table-header-cell" style={{paddingRight:0, width:"calc(100% - 42.7rem)", borderRight:"0"}}>Quantity (In files)</div>
      </div>

      {value.map((item, index)=> <div key={index} className="table-row">
        <div className="table-row-cell" style={{minWidth:"30rem"}}>{returnItemName(item)}</div>
        <div className="table-row-cell">{returnItemSize(item)}</div>
        <div className="table-row-cell" style={{paddingLeft:"0", width:"calc(100% - 42.25rem)", paddingRight:"1px", background:"rgba(242, 241, 238, 0.6)", marginBottom:"0.6px"}}>
        <Stextfield
            key={index}
            name={`${index}`}
            label=""
            value={value[index].quantity}
            type="number"
            labelclassname=""
            textfieldclassname="poquantityInput"
            divclassname="primarytextdivclass"
            placeholder="type.. "
            onChange={(e,name,index) => {
                console.log(e, name, index)
             let newvalue = value.map((item, indx) => {
                if(index===indx){
                    return {
                        ...item,
                        quantity: e.target.value
                    }
                }else{
                    return {
                        ...item
                    }
                }
             })
             onChange(newvalue)
            }}
            index={index}
            disabled={false}

          />
          </div>
      </div>)}

      {value.length===0 && <div style={{color:"#5151517a", display:"flex", justifyContent:"center", alignItems:"center", minHeight:"4rem"}}>You have not chosen any items yet </div>}

       </div>

      )
}


GlassItemAndQunatity.propTypes = {
    onChange: PropTypes.func.isRequired,
    value: PropTypes.array.isRequired,
    glassInventoryArr: PropTypes.array.isRequired
};



export default GlassItemAndQunatity;