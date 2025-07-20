import PropTypes from "prop-types";
import Stextfield from "../../../../../../../assets/singlecomponents/singletextfield/stextfield";





const GlassAccessoryAndQunatity = ({ onChange, value, glassAccessoryArr }) => { 



  const returnItemName = (item) => {

    if(!item || glassAccessoryArr.length<=0){
        console.log(item)
        return 
    }

    const accessoryItem = glassAccessoryArr.filter((accessory)=>accessory.id===item.glass_accessory_id)[0]
    return `${accessoryItem['name']}`

  }



   

   

    return (

       <div style={{borderBottom: value.length>0?"0":"1px solid rgb(233, 233, 231)"}} className="table-container">

      <div className="table-header-row">
        <div className="table-header-cell" style={{minWidth:"30rem"}}>Glass Accessory</div>
       
        <div className="table-header-cell" style={{paddingRight:0, width:"calc(100% - 42.7rem)", borderRight:"0"}}>Quantity (In files)</div>
      </div>

      {value.map((item, index)=> <div key={index} className="table-row">
        <div className="table-row-cell" style={{minWidth:"30rem"}}>{returnItemName(item)}</div>
        
        <div className="table-row-cell" style={{paddingLeft:"1px", width:"auto", paddingRight:"1px", background:"rgba(242, 241, 238, 0.6)"}}>
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


GlassAccessoryAndQunatity.propTypes = {
    onChange: PropTypes.func.isRequired,
    value: PropTypes.array.isRequired,
    glassAccessoryArr: PropTypes.array.isRequired
};



export default GlassAccessoryAndQunatity;